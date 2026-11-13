import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { normalizeBangladeshPhone, phoneLoginEmail } from '../lib/phone.ts';
import type { Database, Json } from '../types/database';

const MEDIA_BUCKET = 'farm-media';
const MAX_STATE_BYTES = 1_800_000;
const MAX_PHOTO_BYTES = 2_800_000;
const signupAttempts = new Map<string, { count: number; expiresAt: number }>();
let adminClient: SupabaseClient<Database> | undefined;

export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

function json(status: number, body: Record<string, unknown>): ApiResult {
  return { status, body };
}

function getAdminClient() {
  if (adminClient) return adminClient;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Supabase server credentials are unavailable.');
  adminClient = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

async function getAuthenticatedUser(authorization: string | null): Promise<User | null> {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return null;
  const { data, error } = await getAdminClient().auth.getUser(token);
  return error ? null : data.user;
}

function getClientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || headers.get('x-real-ip') || 'unknown';
}

function allowSignup(headers: Headers): boolean {
  const now = Date.now();
  const key = getClientKey(headers);
  const current = signupAttempts.get(key);
  if (!current || current.expiresAt <= now) {
    signupAttempts.set(key, { count: 1, expiresAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}

function publicErrorMessage(isBangla: boolean, kind: 'invalid' | 'duplicate' | 'server') {
  if (kind === 'invalid') {
    return isBangla
      ? 'নাম, বাংলাদেশি মোবাইল নম্বর বা পাসওয়ার্ডটি সঠিক নয়।'
      : 'Enter a valid name, Bangladesh mobile number, and password.';
  }
  if (kind === 'duplicate') {
    return isBangla
      ? 'অ্যাকাউন্ট তৈরি করা যায়নি। নম্বরটি আগে ব্যবহৃত হলে লগইন করুন।'
      : 'The account could not be created. If this number is registered, sign in.';
  }
  return isBangla
    ? 'সেবা সাময়িকভাবে পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।'
    : 'The service is temporarily unavailable. Please try again.';
}

async function handleSignup(body: unknown, headers: Headers): Promise<ApiResult> {
  if (!allowSignup(headers)) {
    return json(429, { error: 'Too many sign-up attempts. Try again later.' });
  }

  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const displayName = typeof input.displayName === 'string' ? input.displayName.trim() : '';
  const rawPhone = typeof input.phoneNumber === 'string' ? input.phoneNumber : '';
  const password = typeof input.password === 'string' ? input.password : '';
  const lang = input.lang === 'en' ? 'en' : 'bn';
  let phoneNumber = '';
  try {
    phoneNumber = normalizeBangladeshPhone(rawPhone);
  } catch {
    return json(400, { error: publicErrorMessage(lang === 'bn', 'invalid') });
  }

  if (
    displayName.length < 2 ||
    displayName.length > 80 ||
    /[\u0000-\u001f\u007f]/.test(displayName) ||
    password.length < 10 ||
    password.length > 128
  ) {
    return json(400, { error: publicErrorMessage(lang === 'bn', 'invalid') });
  }

  const { error } = await getAdminClient().auth.admin.createUser({
    email: phoneLoginEmail(phoneNumber),
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      phone_number: phoneNumber,
      preferred_language: lang,
    },
  });

  if (error) {
    return json(409, { error: publicErrorMessage(lang === 'bn', 'duplicate') });
  }

  return json(201, { created: true });
}

async function handleState(method: string, user: User, body: unknown): Promise<ApiResult> {
  const db = getAdminClient();

  if (method === 'GET') {
    const { data, error } = await db
      .from('farmer_app_state')
      .select('state')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) return json(503, { error: 'Farm data is temporarily unavailable.' });
    return json(200, { state: data?.state ?? null });
  }

  if (method !== 'PUT') return json(405, { error: 'Method not allowed.' });
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const state = input.state;
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return json(400, { error: 'A valid farm state is required.' });
  }

  const serialized = JSON.stringify(state);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_STATE_BYTES) {
    return json(413, { error: 'Farm data exceeds the storage limit.' });
  }

  const { error } = await db.from('farmer_app_state').upsert(
    { user_id: user.id, state: state as Json, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
  if (error) return json(503, { error: 'Farm data could not be saved. Please retry.' });
  return json(200, { saved: true, savedAt: new Date().toISOString() });
}

function parsePrivateMediaPath(value: string, userId: string): string | null {
  const path = value.startsWith('farm-media://') ? value.slice('farm-media://'.length) : value;
  if (!path || path.includes('..') || path.includes('\\') || path.startsWith('/') || !path.startsWith(`${userId}/`)) {
    return null;
  }
  return path;
}

async function handleMedia(
  method: string,
  url: URL,
  user: User,
  body: unknown
): Promise<ApiResult> {
  const storage = getAdminClient().storage.from(MEDIA_BUCKET);

  if (method === 'GET') {
    const objectPath = parsePrivateMediaPath(url.searchParams.get('path') || '', user.id);
    if (!objectPath) return json(404, { error: 'Photo not found.' });
    const { data, error } = await storage.createSignedUrl(objectPath, 30 * 60);
    if (error || !data?.signedUrl) return json(404, { error: 'Photo not found.' });
    return json(200, { signedUrl: data.signedUrl });
  }

  if (method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const base64 = typeof input.base64 === 'string' ? input.base64 : '';
  if (input.mimeType !== 'image/webp' || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    return json(400, { error: 'Choose a supported image file.' });
  }

  const image = Buffer.from(base64, 'base64');
  if (image.length === 0 || image.length > MAX_PHOTO_BYTES) {
    return json(413, { error: 'Choose a smaller photo.' });
  }

  const objectPath = `${user.id}/${randomUUID()}.webp`;
  const { error } = await storage.upload(objectPath, image, {
    cacheControl: '3600',
    contentType: 'image/webp',
    upsert: false,
  });
  if (error) return json(503, { error: 'Photo could not be saved. Please retry.' });
  return json(201, { path: `farm-media://${objectPath}` });
}

function sanitizeChatMessages(value: unknown): Array<{ sender: 'user' | 'assistant'; text: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-12)
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === 'object' && (item.sender === 'user' || item.sender === 'assistant') && typeof item.text === 'string'
    )
    .map((item) => ({
      sender: item.sender as 'user' | 'assistant',
      text: (item.text as string).trim().slice(0, 2000),
    }))
    .filter((item) => item.text.length > 0);
}

function sanitizeFarmContext(value: unknown): string {
  if (!value || typeof value !== 'object') return 'No farm details supplied.';
  const context = value as Record<string, unknown>;
  const region = [context.district, context.upazila]
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.slice(0, 60))
    .filter(Boolean)
    .join(', ');
  const animals = Array.isArray(context.animals)
    ? context.animals
        .slice(0, 8)
        .map((item) => {
          if (!item || typeof item !== 'object') return '';
          const animal = item as Record<string, unknown>;
          return [animal.species, animal.healthStatus]
            .filter((part): part is string => typeof part === 'string')
            .map((part) => part.slice(0, 40))
            .join(' — ');
        })
        .filter(Boolean)
    : [];
  const flocks = Array.isArray(context.flocks)
    ? context.flocks
        .slice(0, 8)
        .map((item) => {
          if (!item || typeof item !== 'object') return '';
          const flock = item as Record<string, unknown>;
          return [flock.species, flock.healthStatus]
            .filter((part): part is string => typeof part === 'string')
            .map((part) => part.slice(0, 40))
            .join(' — ');
        })
        .filter(Boolean)
    : [];
  return [
    region ? `Farm region: ${region}` : '',
    animals.length ? `Animals: ${animals.join('; ')}` : '',
    flocks.length ? `Flocks: ${flocks.join('; ')}` : '',
  ]
    .filter(Boolean)
    .join('\n') || 'No farm details supplied.';
}

function isEmergencyMessage(text: string): boolean {
  return /শ্বাসকষ্ট|রক্তপাত|দাঁড়াতে পারছে না|মারা যাচ্ছে|হঠাৎ মারা|cannot stand|breathing trouble|severe bleeding|sudden death|dying/i.test(text);
}

async function generateFarmGuidance(messages: Array<{ sender: 'user' | 'assistant'; text: string }>, context: string, lang: 'bn' | 'en') {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('Gemini API_KEY is not configured.');

  const language = lang === 'bn' ? 'Bangla' : 'English';
  const system = [
    'You are Khamar Bondhu, a farm-care education assistant for small and medium farms in Bangladesh.',
    `Reply in ${language}, using short, practical, respectful language suitable for farmers.`,
    `Use this anonymized farm context only when relevant:\n${context}`,
    'Provide general husbandry and prevention guidance, never claim to diagnose an animal or replace a registered veterinarian.',
    'Do not prescribe medicines, antibiotics, or dosages. For severe symptoms, trouble breathing, inability to stand, severe bleeding, suspected poisoning, difficult birth, or sudden deaths, urge immediate contact with a registered veterinarian and isolation when safe.',
    'Do not claim that any clinic, vet, weather feed, or advisory is live or verified unless the user supplied that fact.',
  ].join('\n');
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });
  const firstUserIndex = messages.findIndex((message) => message.sender === 'user');
  const conversation = messages.slice(firstUserIndex);
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: conversation.map((message) => ({
      role: message.sender === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.text }],
    })),
    config: { maxOutputTokens: 800, systemInstruction: system, temperature: 0.35 },
  });
  const text = response.text?.trim();
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

async function handleChat(body: unknown, user: User): Promise<ApiResult> {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const messages = sanitizeChatMessages(input.messages);
  const latest = [...messages].reverse().find((message) => message.sender === 'user');
  if (!latest) return json(400, { error: 'Enter a question before sending.' });

  try {
    const text = await generateFarmGuidance(
      messages,
      sanitizeFarmContext(input.context),
      input.lang === 'en' ? 'en' : 'bn'
    );
    if (!text) return json(503, { error: 'The assistant could not prepare a reply. Please try again.' });
    return json(200, { text, isEmergencyAlert: isEmergencyMessage(latest.text) });
  } catch {
    return json(503, { error: 'The assistant is temporarily unavailable. Please contact a veterinarian for urgent symptoms.' });
  }
}

export async function handleApiRequest(
  method: string,
  url: URL,
  headers: Headers,
  body: unknown
): Promise<ApiResult> {
  try {
    if (url.pathname === '/api/auth/signup' && method === 'POST') {
      return await handleSignup(body, headers);
    }

    const user = await getAuthenticatedUser(headers.get('authorization'));
    if (!user) return json(401, { error: 'Please sign in to continue.' });

    if (url.pathname === '/api/state') return await handleState(method, user, body);
    if (url.pathname === '/api/media') return await handleMedia(method, url, user, body);
    if (url.pathname === '/api/chat' && method === 'POST') return await handleChat(body, user);
    return json(404, { error: 'Not found.' });
  } catch {
    return json(503, { error: 'The service is temporarily unavailable. Please try again.' });
  }
}
