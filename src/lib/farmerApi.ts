import { supabase } from './supabase';
import { AnimalProfile, FlockProfile, KhamarBondhuMessage, Language } from '../types';

async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (error || !token) {
    throw new Error('Sign in to access your private farm data.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(path, { ...init, headers, cache: 'no-store' });
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.error || 'The request could not be completed.');
  }
  return payload as T;
}

export async function loadPrivateFarmerState<T>(): Promise<T | null> {
  const response = await authorizedFetch('/api/state');
  const result = await readJson<{ state: T | null }>(response);
  return result.state;
}

export async function savePrivateFarmerState<T>(state: T): Promise<void> {
  const response = await authorizedFetch('/api/state', {
    method: 'PUT',
    body: JSON.stringify({ state }),
  });
  await readJson<{ saved: boolean }>(response);
}

export async function uploadPrivatePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 10 MB.');
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not prepare the image.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.8)
  );
  if (!blob || blob.size > 2.8 * 1024 * 1024) {
    throw new Error('The compressed image is too large. Choose a smaller photo.');
  }

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.readAsDataURL(blob);
  });

  const response = await authorizedFetch('/api/media', {
    method: 'POST',
    body: JSON.stringify({ base64, mimeType: 'image/webp' }),
  });
  const result = await readJson<{ path: string }>(response);
  return result.path;
}

export async function getPrivatePhotoUrl(path: string): Promise<string> {
  const response = await authorizedFetch(`/api/media?path=${encodeURIComponent(path)}`);
  const result = await readJson<{ signedUrl: string }>(response);
  return result.signedUrl;
}

export async function askGeminiFarmQuestion(
  messages: KhamarBondhuMessage[],
  context: { district: string; upazila: string; animals: AnimalProfile[]; flocks: FlockProfile[] },
  lang: Language
): Promise<{ text: string; isEmergencyAlert: boolean }> {
  const response = await authorizedFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: messages.map(({ sender, text }) => ({ sender, text })),
      context: {
        district: context.district,
        upazila: context.upazila,
        animals: context.animals.map(({ species, healthStatus }) => ({ species, healthStatus })),
        flocks: context.flocks.map(({ poultryType, healthStatus }) => ({ species: poultryType, healthStatus })),
      },
      lang,
    }),
  });
  return readJson<{ text: string; isEmergencyAlert: boolean }>(response);
}
