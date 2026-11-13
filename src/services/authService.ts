import {
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
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

const USER_SESSION_STORAGE_KEY = 'khamar_shurokkha_active_account';

export const authService = {
  // Listen for real Firebase Auth state changes
  subscribeToAuth(callback: (user: FarmerAccount | null) => void): () => void {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as FarmerAccount;
            callback(data);
            return;
          }
        } catch (e) {
          console.warn('Could not read user profile from Firestore:', e);
        }

        // Default profile if newly signed in
        const fallback: FarmerAccount = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'খামারি ভাই/বোন',
          phoneNumber: fbUser.phoneNumber || '',
          email: fbUser.email || undefined,
          preferredLanguage: 'bn',
          createdAt: new Date().toISOString(),
          isDemo: false,
        };
        callback(fallback);
      } else {
        // Check if a demo session is currently active
        const savedDemo = localStorage.getItem(USER_SESSION_STORAGE_KEY);
        if (savedDemo && DEMO_FARMER_ACCOUNTS[savedDemo]) {
          callback(DEMO_FARMER_ACCOUNTS[savedDemo]);
        } else {
          // Default to primary demo farmer for effortless advisor/testing experience
          callback(DEMO_FARMER_ACCOUNTS['demo-rafiq']);
        }
      }
    });
  },

  // Switch to or activate a Demo Account
  async selectDemoFarmer(demoKey: 'demo-rafiq' | 'demo-fatema'): Promise<FarmerAccount> {
    try {
      await fbSignOut(auth);
    } catch (_) {}
    const account = DEMO_FARMER_ACCOUNTS[demoKey] || DEMO_FARMER_ACCOUNTS['demo-rafiq'];
    localStorage.setItem(USER_SESSION_STORAGE_KEY, demoKey);
    return account;
  },

  // Register or sign in real farmer via Firebase anonymous / phone
  async signInFarmerWithProfile(
    displayName: string,
    phoneNumber: string,
    preferredLanguage: Language = 'bn',
    email?: string
  ): Promise<FarmerAccount> {
    localStorage.removeItem(USER_SESSION_STORAGE_KEY);
    const userCredential = await signInAnonymously(auth);
    const uid = userCredential.user.uid;

    const profile: FarmerAccount = {
      uid,
      displayName,
      phoneNumber,
      email: email?.trim() || undefined,
      preferredLanguage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    try {
      await setDoc(doc(db, 'users', uid), profile, { merge: true });
    } catch (e) {
      console.warn('Error saving farmer profile to Firestore:', e);
    }

    return profile;
  },

  async updateFarmerProfile(
    uid: string,
    updates: Partial<Pick<FarmerAccount, 'displayName' | 'phoneNumber' | 'email' | 'preferredLanguage'>>
  ): Promise<void> {
    if (uid.startsWith('demo_user_')) {
      return; // Demo accounts are immutable
    }
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(USER_SESSION_STORAGE_KEY);
    await fbSignOut(auth);
  },
};
