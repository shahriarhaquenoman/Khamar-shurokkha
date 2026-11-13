import React, { useEffect, useState } from 'react';
import { ArrowRight, Lock, LogOut, Phone, Shield, User, X } from 'lucide-react';
import { Language } from '../types';
import { FarmerAccount, authService, DEMO_FARMER_ACCOUNTS } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FarmerAccount | null;
  lang: Language;
  onUserChanged: (user: FarmerAccount) => void;
}

function keepImeComposition(event: React.KeyboardEvent<HTMLInputElement>) {
  if (
    event.key === 'Enter' &&
    (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)
  ) {
    event.preventDefault();
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  lang,
  onUserChanged,
}) => {
  const isBn = lang === 'bn';
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(lang);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setAuthMode('sign-in');
    setName('');
    setPhone(currentUser?.isDemo ? '' : currentUser?.phoneNumber || '');
    setPassword('');
    setPreferredLanguage(currentUser?.preferredLanguage || lang);
    setErrorMessage('');
  }, [isOpen, currentUser?.uid, currentUser?.isDemo, currentUser?.phoneNumber, currentUser?.preferredLanguage, lang]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const account =
        authMode === 'sign-up'
          ? await authService.registerFarmerWithPassword(name, phone, password, preferredLanguage)
          : await authService.signInFarmerWithPassword(phone, password);
      onUserChanged(account);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'invalid_phone') {
        setErrorMessage(isBn ? 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।' : 'Enter a valid Bangladesh mobile number.');
      } else {
        setErrorMessage(message || (isBn ? 'লগইন করা যায়নি। আবার চেষ্টা করুন।' : 'Could not sign in. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await authService.signOut();
      onUserChanged(DEMO_FARMER_ACCOUNTS['demo-rafiq']);
      onClose();
    } catch {
      setErrorMessage(isBn ? 'লগআউট করা যায়নি। আবার চেষ্টা করুন।' : 'Sign out could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-xs animate-in fade-in duration-150">
      <section
        aria-labelledby="farmer-account-title"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-slate-100 bg-slate-900 p-4 text-white sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/20 p-2 text-emerald-300">
              <User aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black sm:text-lg" id="farmer-account-title">
                {isBn ? 'খামারি অ্যাকাউন্ট' : 'Farmer account'}
              </h2>
              <p className="text-xs text-slate-300">
                {currentUser?.isDemo
                  ? isBn ? 'নিজের খামার তথ্য সংরক্ষণে অ্যাকাউন্ট তৈরি করুন' : 'Create an account to save your farm data'
                  : isBn ? 'আপনার ব্যক্তিগত খামার তথ্য' : 'Your private farm data'}
              </p>
            </div>
          </div>
          <button
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>


        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950">
                <Shield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <span>
                  {isBn
                    ? 'মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন। OTP নেই; তাই ফোন নম্বরের মালিকানা যাচাই হয় না এবং পাসওয়ার্ড ভুলে গেলে অ্যাকাউন্ট ফেরত পাওয়ার ব্যবস্থা নেই।'
                    : 'Use a mobile number and password. There is no OTP, so phone ownership is not verified and password recovery is unavailable.'}
                </span>
              </div>

              <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  aria-pressed={authMode === 'sign-in'}
                  className={`min-h-9 flex-1 rounded-lg text-xs font-bold ${authMode === 'sign-in' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  onClick={() => { setAuthMode('sign-in'); setErrorMessage(''); }}
                  type="button"
                >
                  {isBn ? 'লগইন' : 'Sign in'}
                </button>
                <button
                  aria-pressed={authMode === 'sign-up'}
                  className={`min-h-9 flex-1 rounded-lg text-xs font-bold ${authMode === 'sign-up' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  onClick={() => { setAuthMode('sign-up'); setErrorMessage(''); }}
                  type="button"
                >
                  {isBn ? 'নতুন অ্যাকাউন্ট' : 'Create account'}
                </button>
              </div>

              <form className="space-y-3.5" onSubmit={(event) => void handleSubmit(event)}>
                {authMode === 'sign-up' && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="farmer-name">
                      {isBn ? 'খামারির নাম *' : 'Farmer name *'}
                    </label>
                    <div className="relative">
                      <User aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        autoComplete="name"
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        id="farmer-name"
                        maxLength={80}
                        onChange={(event) => setName(event.target.value)}
                        onKeyDown={keepImeComposition}
                        placeholder={isBn ? 'যেমন: মোঃ আলমগীর হোসেন' : 'e.g. Md. Alamgir Hossain'}
                        required
                        value={name}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="farmer-phone">
                    {isBn ? 'বাংলাদেশি মোবাইল নম্বর *' : 'Bangladesh mobile number *'}
                  </label>
                  <div className="relative">
                    <Phone aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      autoComplete="tel"
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      id="farmer-phone"
                      inputMode="tel"
                      onChange={(event) => setPhone(event.target.value)}
                      onKeyDown={keepImeComposition}
                      placeholder="017XXXXXXXX"
                      required
                      type="tel"
                      value={phone}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="farmer-password">
                    {isBn ? 'পাসওয়ার্ড *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <Lock aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      autoComplete={authMode === 'sign-up' ? 'new-password' : 'current-password'}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      id="farmer-password"
                      minLength={authMode === 'sign-up' ? 10 : undefined}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyDown={keepImeComposition}
                      required
                      type="password"
                      value={password}
                    />
                  </div>
                  {authMode === 'sign-up' && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {isBn ? 'কমপক্ষে ১০টি অক্ষর ব্যবহার করুন।' : 'Use at least 10 characters.'}
                    </p>
                  )}
                </div>

                {authMode === 'sign-up' && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700" htmlFor="preferred-language">
                      {isBn ? 'পছন্দের ভাষা' : 'Preferred language'}
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      id="preferred-language"
                      onChange={(event) => setPreferredLanguage(event.target.value as Language)}
                      value={preferredLanguage}
                    >
                      <option value="bn">বাংলা</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                )}

                <button
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  <span>
                    {loading
                      ? isBn ? 'অনুগ্রহ করে অপেক্ষা করুন…' : 'Please wait…'
                      : authMode === 'sign-up'
                        ? isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create account'
                        : isBn ? 'লগইন করুন' : 'Sign in'}
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </form>
          </div>

          {!currentUser?.isDemo && (
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                className="flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 disabled:opacity-50"
                disabled={loading}
                onClick={() => void handleSignOut()}
                type="button"
              >
                <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{isBn ? 'লগআউট' : 'Sign out'}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
