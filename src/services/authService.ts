import { supabase } from '../lib/supabase';
import { normalizeBangladeshPhone, phoneLoginEmail } from '../lib/phone';
import { Language } from '../types';

export interface FarmerAccount {
  uid: string;
  displayName: string;
  phoneNumber: string;
  email?: string;
  preferredLanguage: Language;
  createdAt: string;
  updatedAt?: string;
  isDemo: boolean;
}

export const DEMO_FARMER_ACCOUNTS: Record<string, FarmerAccount> = {
  'demo-rafiq': {
    uid: 'demo_user_rafiq_001',
    displayName: 'মোঃ রফিকুল ইসলাম (খামারি)',
    phoneNumber: '+880 1711-234567',
    email: 'rafiq.greenvalley@example.com',
    preferredLanguage: 'bn',
    createdAt: '2025-11-10T08:00:00Z',
    isDemo: true,
  },
  'demo-fatema': {
    uid: 'demo_user_fatema_002',
    displayName: 'মোছাঃ ফাতেমা বেগম (খামারি)',
    phoneNumber: '+880 1812-987654',
    email: 'fatema.agro@example.com',
    preferredLanguage: 'bn',
    createdAt: '2026-01-15T09:30:00Z',
    isDemo: true,
  },
};

function toFarmerAccount(user: {
  id: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: Record<string, unknown>;
}): FarmerAccount {
  const metadata = user.user_metadata || {};
  return {
    uid: user.id,
    displayName:
      typeof metadata.display_name === 'string' ? metadata.display_name : 'খামারি',
    phoneNumber:
      typeof metadata.phone_number === 'string' ? metadata.phone_number : '',
    preferredLanguage: metadata.preferred_language === 'en' ? 'en' : 'bn',
    createdAt: user.created_at || new Date().toISOString(),
    updatedAt: user.updated_at,
    isDemo: false,
  };
}

async function responseError(response: Response): Promise<Error> {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  return new Error(payload?.error || 'The request could not be completed.');
}

export const authService = {
  subscribeToAuth(callback: (user: FarmerAccount | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ? toFarmerAccount(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  },

  async selectDemoFarmer(demoKey: 'demo-rafiq' | 'demo-fatema'): Promise<FarmerAccount> {
    await supabase.auth.signOut();
    return DEMO_FARMER_ACCOUNTS[demoKey] || DEMO_FARMER_ACCOUNTS['demo-rafiq'];
  },

  async signInFarmerWithPassword(phoneNumber: string, password: string): Promise<FarmerAccount> {
    const normalizedPhone = normalizeBangladeshPhone(phoneNumber);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: phoneLoginEmail(normalizedPhone),
      password,
    });

    if (error || !data.user) {
      throw new Error('Invalid mobile number or password.');
    }
    return toFarmerAccount(data.user);
  },

  async registerFarmerWithPassword(
    displayName: string,
    phoneNumber: string,
    password: string,
    preferredLanguage: Language = 'bn'
  ): Promise<FarmerAccount> {
    const normalizedPhone = normalizeBangladeshPhone(phoneNumber);
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: displayName.trim(),
        phoneNumber: normalizedPhone,
        password,
        lang: preferredLanguage,
      }),
    });
    if (!response.ok) throw await responseError(response);

    try {
      return await this.signInFarmerWithPassword(normalizedPhone, password);
    } catch {
      throw new Error('Account created. Sign in with your mobile number and password.');
    }
  },

  async updateFarmerProfile(
    updates: Partial<Pick<FarmerAccount, 'displayName' | 'preferredLanguage'>>
  ): Promise<void> {
    const profileUpdate: Record<string, string> = {};
    if (updates.displayName !== undefined) {
      const displayName = updates.displayName.trim();
      if (displayName.length < 2 || displayName.length > 80 || /[\\u0000-\\u001f\\u007f]/.test(displayName)) {
        throw new Error('Enter a name between 2 and 80 characters.');
      }
      profileUpdate.display_name = displayName;
    }
    if (updates.preferredLanguage !== undefined) {
      if (updates.preferredLanguage !== 'bn' && updates.preferredLanguage !== 'en') {
        throw new Error('Choose a supported language.');
      }
      profileUpdate.preferred_language = updates.preferredLanguage;
    }
    if (!Object.keys(profileUpdate).length) return;

    const { data, error } = await supabase.auth.updateUser({ data: profileUpdate });
    if (error || !data.user) throw new Error('Profile could not be updated. Please try again.');

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ ...profileUpdate, updated_at: new Date().toISOString() })
      .eq('id', data.user.id)
      .select('id')
      .single();
    if (profileError) throw new Error('Profile could not be updated. Please try again.');
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('Sign out could not be completed. Please try again.');
  },
};
