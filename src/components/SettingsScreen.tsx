import React, { useState, useEffect } from 'react';
import {
  Settings,
  Languages,
  RotateCcw,
  Download,
  Info,
  CheckCircle2,
  Sparkles,
  Bell,
  Smartphone,
  Phone,
  Clock,
  ShieldAlert,
  Award,
  PlayCircle,
  LogOut,
  Compass,
  PhoneCall,
} from 'lucide-react';
import { Language, FarmProfile, NavScreen, SmsNotificationPreferences } from '../types';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  KHAMAR_CONTACT_CONFIG,
  getKhamarPhoneDisplay,
  getKhamarUssdDisplay,
  getKhamarUssdShortLabel,
} from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';

interface SettingsScreenProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  farm: FarmProfile;
  smsPrefs: SmsNotificationPreferences;
  onSmsPrefsChange: (preferences: SmsNotificationPreferences) => void;
  inAppNotifications: boolean;
  onInAppNotificationsChange: (enabled: boolean) => void;
  isDemoActive: boolean;
  onLaunchDemo: () => void;
  onResetAllData: () => void;
  onNavigate: (screen: NavScreen) => void;
  isJudgeDemoActive?: boolean;
  onActivateJudgeDemo?: (startWalkthrough?: boolean) => void;
  onExitJudgeDemo?: () => void;
  onOpenWalkthrough?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  lang,
  onLanguageChange,
  farm,
  smsPrefs,
  onSmsPrefsChange,
  inAppNotifications,
  onInAppNotificationsChange,
  isDemoActive,
  onLaunchDemo,
  onResetAllData,
  onNavigate,
  isJudgeDemoActive = false,
  onActivateJudgeDemo,
  onExitJudgeDemo,
  onOpenWalkthrough,
}) => {
  const isBn = lang === 'bn';
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [smsSavedToast, setSmsSavedToast] = useState(false);
  const inAppNotifs = inAppNotifications;

  const handleSaveSmsPrefs = (updated: SmsNotificationPreferences) => {
    onSmsPrefsChange(updated);
    setSmsSavedToast(true);
    setTimeout(() => setSmsSavedToast(false), 3000);
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        farm,
        smsNotificationPreferences: smsPrefs,
        exportedAt: new Date().toISOString(),
        system: 'Khamar Shurokkha Multi-Species Platform',
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `khamar_shurokkha_${farm.id}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {isBn ? 'সেটিংস, ভাষা ও এসএমএস পছন্দসমূহ' : 'Settings, Language & SMS Preferences'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isBn
              ? 'ভাষা নির্বাচন, এসএমএস সম্মতি ও নীরব সময়সূচি এবং ডেমো তথ্য নিয়ন্ত্রণ'
              : 'Language selection, SMS reminder opt-in preferences, and farm controls'}
          </p>
        </div>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-black text-base">
          <Languages className="w-5 h-5 text-emerald-700" />
          <span>{isBn ? 'অ্যাপের ভাষা (Language)' : 'Language Selection'}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => onLanguageChange('bn')}
            className={`min-h-[64px] p-4 rounded-2xl border text-center transition-all cursor-pointer ${
              lang === 'bn'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-black'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg block">বাংলা</span>
            <span className="text-xs text-slate-500">{isBn ? 'সহজ খামারি ভাষা (মূল)' : 'Default'}</span>
          </button>

          <button
            onClick={() => onLanguageChange('en')}
            className={`min-h-[64px] p-4 rounded-2xl border text-center transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-black'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg block">English</span>
            <span className="text-xs text-slate-500">English Interface</span>
          </button>
        </div>
      </div>

      {/* SMS Notification & Consent Architecture (Honest Planned Status) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Smartphone className="w-5 h-5 text-emerald-700" />
            <span>{isBn ? 'এসএমএস (SMS) রিমাইন্ডার ও সম্মতি ব্যবস্থা' : 'SMS Reminder & Consent Preferences'}</span>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            {isBn ? 'পরিকল্পিত / ডেমো গেটওয়ে (লাইভ SMS পাঠানো হয় না)' : 'Planned / Demo Gateway (No Live SMS Sent)'}
          </span>
        </div>

        {/* Honest Planned Gateway Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {isBn
              ? 'স্বচ্ছতা তথ্য: বর্তমানে লাইভ টেলিকম SMS গেটওয়ে যুক্ত নেই। আপনার সম্মতি ও পছন্দসমূহ শুধু ভবিষ্যৎ SMS বা ভয়েস কল (IVR) সেবার প্রস্তুতির জন্য সংরক্ষণ করা হচ্ছে এবং অ্যাপ থেকেই সব নোটিফিকেশন দেখা যাবে।'
              : 'Transparency notice: No live telecom SMS gateway is connected yet. Saving your opt-in consent and categories stores your preferences for future SMS/IVR delivery without fake SMS dispatch claims.'}
          </p>
        </div>

        {/* In-App Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                {isBn ? 'অ্যাপের ভেতরে নোটিফিকেশন' : 'In-App Reminders'}
              </div>
              <div className="text-xs text-slate-500">
                {isBn ? 'উপরের বেল আইকনে টিকা, যত্ন ও সতর্কতার খবর' : 'Bell alerts inside the application'}
              </div>
            </div>
          </div>
          <button
            onClick={() => onInAppNotificationsChange(!inAppNotifs)}
            aria-label={isBn ? 'অ্যাপ নোটিফিকেশন চালু বা বন্ধ' : 'Toggle in-app notifications'}
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
              inAppNotifs ? 'bg-emerald-700' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${
                inAppNotifs ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Phone & Explicit SMS Opt-In Consent */}
        <div className="p-4 rounded-2xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                {isBn ? 'মোবাইল নম্বর (SMS পছন্দের জন্য)' : 'Phone Number (for SMS preference)'}
              </label>
              <input
                type="tel"
                value={smsPrefs.phoneNumber}
                onChange={(e) => handleSaveSmsPrefs({ ...smsPrefs, phoneNumber: e.target.value, isPhoneVerified: false })}
                placeholder="017XX-XXXXXX"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono"
              />
            </div>

            <div className="flex items-end">
              <div className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-700">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {smsPrefs.isPhoneVerified
                    ? isBn ? 'OTP যাচাইকৃত নম্বর' : 'OTP Verified'
                    : isBn ? 'নম্বর যাচাই অবস্থা: এখনো OTP যাচাই হয়নি' : 'Verification status: Not OTP verified'}
                </span>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 cursor-pointer">
            <input
              type="checkbox"
              checked={smsPrefs.smsOptInConsent}
              onChange={(e) =>
                handleSaveSmsPrefs({
                  ...smsPrefs,
                  smsOptInConsent: e.target.checked,
                  consentTimestamp: new Date().toISOString(),
                })
              }
              className="mt-1 w-5 h-5 accent-emerald-700"
            />
            <span className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
              {isBn
                ? 'আমি টিকা, কৃমিনাশক ও জরুরি খামার সতর্কতার জন্য ভবিষ্যতে বাংলা SMS রিমাইন্ডার পেতে সম্মত আছি। (যেকোনো সময় বন্ধ করা যাবে)'
                : 'I consent to receive Bengali SMS reminders for vaccines, deworming, and urgent farm alerts when SMS delivery is active.'}
            </span>
          </label>

          {/* SMS Categories */}
          <div className="space-y-2">
            <span className="block text-xs font-extrabold text-slate-800">
              {isBn ? 'কোন কোন বিষয়ে SMS বার্তা পেতে চান?' : 'Select Reminder Categories'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              {[
                { key: 'vaccinations' as const, bn: 'টিকার তারিখ ও রিমাইন্ডার', en: 'Vaccination Due Dates' },
                { key: 'deworming' as const, bn: 'কৃমিনাশক সময়সূচি', en: 'Deworming Schedules' },
                { key: 'biosecurity' as const, bn: 'গুরুত্বপূর্ণ সুরক্ষা কাজ', en: 'Priority Biosecurity Actions' },
                { key: 'regionalAlerts' as const, bn: 'এলাকার জরুরি রোগ ও আবহাওয়া সতর্কতা', en: 'Regional Disease & Weather Alerts' },
                { key: 'vetAppointments' as const, bn: 'পশুচিকিৎসকের অ্যাপয়েন্টমেন্ট আপডেট', en: 'Vet Appointment Updates' },
              ].map((cat) => (
                <label
                  key={cat.key}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={smsPrefs.categories[cat.key]}
                    onChange={(e) =>
                      handleSaveSmsPrefs({
                        ...smsPrefs,
                        categories: { ...smsPrefs.categories, [cat.key]: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-emerald-700"
                  />
                  <span>{isBn ? cat.bn : cat.en}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quiet Hours & Future IVR Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsPrefs.quietHoursEnabled}
                  onChange={(e) => handleSaveSmsPrefs({ ...smsPrefs, quietHoursEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-700"
                />
                <Clock className="w-4 h-4 text-slate-600" />
                <span>{isBn ? 'রাতের নীরব সময় (রাত ৯টা – সকাল ৬টা)' : 'Quiet Hours (9 PM – 6 AM)'}</span>
              </label>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'রাতে অপ্রয়োজনীয় বার্তা পাঠানো হবে না।' : 'Non-urgent alerts will pause overnight.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsPrefs.ivrVoiceInterest}
                  onChange={(e) => handleSaveSmsPrefs({ ...smsPrefs, ivrVoiceInterest: e.target.checked })}
                  className="w-4 h-4 accent-emerald-700"
                />
                <Phone className="w-4 h-4 text-amber-700" />
                <span>{isBn ? 'ভবিষ্যৎ বাংলা ভয়েস কল (IVR) রিমাইন্ডারে আগ্রহী' : 'Interested in Future Bangla IVR Voice Reminders'}</span>
              </label>
              <p className="text-[11px] text-slate-500">
                {isBn ? 'যাদের পড়তে অসুবিধা হয় তাদের জন্য পরিকল্পিত ভয়েস সেবা।' : 'Planned accessibility support; no calls sent now.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            {smsPrefs.smsOptInConsent && (
              <button
                type="button"
                onClick={() => handleSaveSmsPrefs({ ...smsPrefs, smsOptInConsent: false })}
                className="min-h-[42px] px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
              >
                {isBn ? 'SMS সম্মতি প্রত্যাহার করুন (Opt-out)' : 'Withdraw SMS Consent (Opt-out)'}
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveSmsPrefs(smsPrefs)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold cursor-pointer ml-auto"
            >
              {isBn ? 'SMS পছন্দ সংরক্ষণ করুন' : 'Save SMS Preferences'}
            </button>
          </div>

          {smsSavedToast && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>
                {isBn
                  ? 'পছন্দ আপনার অ্যাকাউন্টে সংরক্ষিত হয়েছে; কোনো SMS পাঠানো হয়নি।'
                  : 'Preferences saved to your account; no SMS was sent.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Offline Access & USSD Services Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-blue-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Phone className="w-5 h-5 text-blue-600" />
            <span>{isBn ? 'ইন্টারনেট ছাড়া সেবা ও USSD' : 'Offline Access & USSD Services'}</span>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
            {isBn ? 'প্রকৃত USSD কোড এখনো বরাদ্দ হয়নি' : 'Official Short Code Not Yet Assigned'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 items-center">
          <div className="rounded-2xl overflow-hidden border border-blue-100 h-32 bg-blue-50">
            <ResilientImage
              src={FARM_VISUAL_ASSETS.featurePhone}
              alt={isBn ? 'সাধারণ বাটন ফোনে গ্রামীণ খামারি' : 'Rural farmer using basic feature phone'}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isBn
                ? 'স্মার্টফোন বা মোবাইল ইন্টারনেট না থাকা প্রান্তিক খামারিদের জন্য USSD ডায়াল মেনু পরিকল্পনা করা হয়েছে। নমুনা উদাহরণ (*123#) দিয়ে সিমুলেটরে অভিজ্ঞতাটি দেখা যাবে — তবে এখনো কোনো প্রকৃত টেলিকম USSD কোড বরাদ্দ হয়নি।'
                : 'Designed so smallholder farmers with 2G keypad phones can access tasks and vaccination reminders offline. Try the interactive *123# prototype simulator (official telecom short code is not yet assigned).'}
            </p>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-950 space-y-1">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#166534] shrink-0" />
                <span>
                  {isBn
                    ? `খামার সুরক্ষা যোগাযোগ নম্বর: ${getKhamarPhoneDisplay(lang)}`
                    : `Khamar Shurokkha Contact: ${getKhamarPhoneDisplay(lang)}`}
                </span>
              </div>
              <div className="pl-6 text-emerald-900">
                {isBn
                  ? `অফিসিয়াল USSD কোড: ${getKhamarUssdDisplay(lang)}`
                  : `Official USSD Code: ${getKhamarUssdDisplay(lang)}`}
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-2.5">
              <KhamarContactCallAction
                lang={lang}
                labelBn={
                  KHAMAR_CONTACT_CONFIG.isPhoneConfigured
                    ? `কল করুন: ${KHAMAR_CONTACT_CONFIG.officialPhone}`
                    : `কল করুন (${KHAMAR_CONTACT_CONFIG.placeholderPhone})`
                }
                labelEn={
                  KHAMAR_CONTACT_CONFIG.isPhoneConfigured
                    ? `Call: ${KHAMAR_CONTACT_CONFIG.officialPhone}`
                    : `Call (${KHAMAR_CONTACT_CONFIG.placeholderPhone})`
                }
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => onNavigate('ussd_simulator')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>
                  {isBn
                    ? `USSD সিমুলেটর (${getKhamarUssdShortLabel()})`
                    : `Open USSD Simulator (${getKhamarUssdShortLabel()})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Competition & Judge Demonstration Mode (Isolated Snapshot-Restore) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>{isBn ? 'প্রতিযোগিতা ও বিচারক ডেমো মোড' : 'Competition & Judge Demo Mode'}</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              isJudgeDemoActive
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-indigo-50 text-indigo-900 border-indigo-200'
            }`}
          >
            {isJudgeDemoActive
              ? isBn ? 'বিচারক ডেমো সক্রিয়' : 'Judge Demo Active'
              : isBn ? 'সক্রিয় নয়' : 'Inactive'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isBn
            ? 'বিচারক বা উপস্থাপনার জন্য একটি পূর্ণাঙ্গ নমুনা খামার (KS-JUDGE-01: গরু, মহিষ, ছাগল, পোল্ট্রি ব্যাচ, BioShield অ্যাকশন, টিকা ক্যালেন্ডার ও খামার বন্ধু ইতিহাস) লোড করে। বের হয়ে এলে আপনার আসল খামারের কোনো তথ্য মুছে না গিয়ে হুবহু আগের অবস্থায় ফিরে আসবে।'
            : 'Loads an isolated sample mixed-species showcase farm (KS-JUDGE-01) with an optional 7-step guided tour. Your real farm records are snapshotted safely and restored intact on exit.'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {!isJudgeDemoActive ? (
            <>
              <button
                type="button"
                onClick={() => onActivateJudgeDemo?.(false)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{isBn ? 'বিচারক ডেমো চালু করুন' : 'Activate Judge Demo'}</span>
              </button>

              <button
                type="button"
                onClick={() => onActivateJudgeDemo?.(true)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{isBn ? '৭-ধাপ গাইডেড ওয়াকথ্রু শুরু করুন' : 'Start Guided Walkthrough'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenWalkthrough?.()}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{isBn ? 'গাইডেড ওয়াকথ্রু খুলুন' : 'Open Guided Walkthrough'}</span>
              </button>

              <button
                type="button"
                onClick={() => onExitJudgeDemo?.()}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isBn ? 'ডেমো মোড বন্ধ করে আগের তথ্যে ফিরুন' : 'Exit Demo Mode'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Advisor Demo Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-black text-base">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{isBn ? 'ডেমো খামার ও তথ্য ব্যবস্থাপনা' : 'Demo Farm & Data Controls'}</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {isDemoActive ? (isBn ? 'ডেমো সক্রিয়' : 'Demo Active') : isBn ? 'ব্যক্তিগত খামার' : 'Custom Farm'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onLaunchDemo}
            className="min-h-[44px] px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? 'ডেমো তথ্য রিলোড করুন' : 'Load Demo Dataset'}</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isBn ? 'স্থানীয় তথ্য রিসেট করুন' : 'Reset Local Data'}</span>
          </button>

          <button
            onClick={handleExportData}
            className="min-h-[44px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isBn ? 'খামারের তথ্য ডাউনলোড (JSON)' : 'Download Farm JSON'}</span>
          </button>
        </div>

        {resetConfirmOpen && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-rose-900">
              {isBn
                ? 'আপনি কি নিশ্চিত যে স্থানীয় সংরক্ষিত খামার ও অ্যাকশন তথ্য মুছে ফেলতে চান?'
                : 'Clear all locally stored farm and action data?'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetAllData();
                  setResetConfirmOpen(false);
                }}
                className="min-h-[40px] px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isBn ? 'হ্যাঁ, মুছুন' : 'Yes, Reset'}
              </button>
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="min-h-[40px] px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {exportSuccess && (
          <div className="inline-flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'ফাইল ডাউনলোড হয়েছে' : 'JSON downloaded'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
