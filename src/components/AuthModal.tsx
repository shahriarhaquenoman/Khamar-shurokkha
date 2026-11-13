import React, { useState } from 'react';
import { Language } from '../types';
import { FarmerAccount, authService, DEMO_FARMER_ACCOUNTS } from '../services/authService';
import {
  X,
  User,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  LogOut,
  Info,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FarmerAccount | null;
  lang: Language;
  onUserChanged: (user: FarmerAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  lang,
  onUserChanged,
}) => {
  if (!isOpen) return null;
  const isBn = lang === 'bn';

  const [mode, setMode] = useState<'demo' | 'real'>(currentUser?.isDemo ? 'demo' : 'real');
  const [name, setName] = useState(currentUser?.isDemo ? '' : currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.isDemo ? '' : currentUser?.phoneNumber || '');
  const [email, setEmail] = useState(currentUser?.isDemo ? '' : currentUser?.email || '');
  const [prefLang, setPrefLang] = useState<Language>(currentUser?.preferredLanguage || 'bn');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectDemo = async (demoKey: 'demo-rafiq' | 'demo-fatema') => {
    setLoading(true);
    try {
      const account = await authService.selectDemoFarmer(demoKey);
      onUserChanged(account);
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'Error activating demo account');
    } finally {
      setLoading(false);
    }
  };

  const handleRealRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন' : 'Please enter your phone number');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const account = await authService.signInFarmerWithProfile(
        name.trim(),
        phone.trim(),
        prefLang,
        email.trim() || undefined
      );
      onUserChanged(account);
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    const fallback = await authService.selectDemoFarmer('demo-rafiq');
    onUserChanged(fallback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                {isBn ? 'খামারি অ্যাকাউন্ট ও পরিচিতি' : 'Farmer Account Profile'}
              </h3>
              <p className="text-xs text-slate-300">
                {currentUser?.isDemo
                  ? isBn
                    ? 'বর্তমানে প্রদর্শনী (ডেমো) মোডে আছেন'
                    : 'Currently in Demo Mode'
                  : isBn
                  ? 'প্রকৃত ফায়ারবেস ক্লাউড অ্যাকাউন্ট'
                  : 'Authenticated Firebase Account'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between Demo & Real */}
        <div className="p-3 bg-slate-100 flex gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setMode('demo')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'demo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isBn ? 'প্রদর্শনী / ডেমো খামারি' : 'Demonstration Logins'}
          </button>
          <button
            type="button"
            onClick={() => setMode('real')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'real'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isBn ? 'নতুন খামারি নিবন্ধন (ফায়ারবেস)' : 'Real Farmer Registration'}
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
              {errorMsg}
            </div>
          )}

          {mode === 'demo' ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'পরীক্ষা ও পর্যালোচনার জন্য প্রস্তুতকৃত ডেমো অ্যাকাউন্ট। কোনো ওটিপি বা অতিরিক্ত পিন ছাড়াই দ্রুত সকল খামার ও প্রাণীর ডাটা পর্যবেক্ষণ করুন।'
                    : 'Advisory demonstration profiles. Switch instantly without OTP to test multi-farm features.'}
                </span>
              </div>

              {/* Demo Profiles */}
              <div
                onClick={() => handleSelectDemo('demo-rafiq')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  currentUser?.uid === 'demo_user_rafiq_001'
                    ? 'border-emerald-600 bg-emerald-50/70'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">মোঃ রফিকুল ইসলাম</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                      DEMO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    গ্রিন ভ্যালি ইন্টিগ্রেটেড ফার্ম (মাধবপুর, হবিগঞ্জ) · গরু, ব্রয়লার, ছাগল ও ভেড়া
                  </p>
                </div>
                {currentUser?.uid === 'demo_user_rafiq_001' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>

              <div
                onClick={() => handleSelectDemo('demo-fatema')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  currentUser?.uid === 'demo_user_fatema_002'
                    ? 'border-emerald-600 bg-emerald-50/70'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">মোছাঃ ফাতেমা বেগম</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                      DEMO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    সোনার বাংলা খামার (শেরপুর) · দুগ্ধ খামার ও ছাগল পালন
                  </p>
                </div>
                {currentUser?.uid === 'demo_user_fatema_002' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleRealRegister} className="space-y-3.5">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'আপনার নিজস্ব ক্লাউড অ্যাকাউন্ট। এতে যোগ করা খামার ও পশুপাখির সকল তথ্য ফায়ারবেস ফায়ারস্টোরে স্থায়ীভাবে সংরক্ষিত থাকবে।'
                    : 'Persistent personal account stored directly in Firebase Cloud Firestore.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'খামারির পূর্ণ নাম *' : 'Farmer Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBn ? 'যেমন: মোঃ আলমগীর হোসেন' : 'e.g. Md. Alamgir Hossain'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>
                  {loading
                    ? isBn
                      ? 'অ্যাকাউন্ট তৈরি হচ্ছে...'
                      : 'Connecting...'
                    : isBn
                    ? 'নিবন্ধন সম্পন্ন ও ক্লাউড সংযোগ'
                    : 'Register & Connect to Cloud'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {!currentUser?.isDemo && (
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBn ? 'অ্যাকাউন্ট থেকে লগআউট' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
