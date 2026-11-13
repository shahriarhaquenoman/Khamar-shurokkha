import React, { useState } from 'react';
import { NavScreen, Language, UserRole } from '../types';
import {
  LayoutDashboard,
  Layers,
  ShieldCheck,
  Calendar,
  Radio,
  HeartPulse,
  BookOpen,
  Settings,
  Phone,
  FileCheck2,
  Milestone,
  ChevronDown,
  ChevronRight,
  X,
  Award,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { toBanglaNum } from '../translations';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen, topicKey?: string) => void;
  lang: Language;
  role: UserRole;
  pendingTasksCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  lang,
  role,
  pendingTasksCount,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const isBn = lang === 'bn';
  const [restrictedExpanded, setRestrictedExpanded] = useState<boolean>(false);

  const handleNav = (screen: NavScreen) => {
    onNavigate(screen);
    if (onCloseMobile) onCloseMobile();
  };

  const isVetOrAdmin = role === 'admin' || role === 'vet_pro' || role === 'advisor';
  const isBioShieldActive = currentScreen === 'biosecurity';
  const isHelpActive =
    currentScreen === 'health_support' ||
    currentScreen === 'vet_services' ||
    currentScreen === 'ai_assistant';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[61px] left-0 z-50 md:z-30 h-screen md:h-[calc(100vh-61px)] w-72 bg-white border-r border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Drawer Header */}
          <div className="md:hidden flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
            <span className="font-bold text-slate-900 text-sm">
              {isBn ? 'খামার সুরক্ষা মেনু' : 'Khamar Shurokkha Menu'}
            </span>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Indicator Banner */}
          <div className="px-3 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 mb-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="font-bold text-emerald-950">
                {isBn
                  ? role === 'farmer'
                    ? 'খামারি পোর্টাল'
                    : role === 'vet_pro'
                    ? 'ভেটেরিনারি সার্জন'
                    : role === 'admin'
                    ? 'সিস্টেম অ্যাডমিন'
                    : 'উপদেষ্টা ডেমো মোড'
                  : role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            {role === 'advisor' && (
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-200/70 px-1.5 py-0.5 rounded">
                DEMO
              </span>
            )}
          </div>

          {/* PRIMARY 4 FARMER-FIRST DESTINATIONS */}
          <nav className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            <div className="px-2 pb-1 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {isBn ? 'মূল মেনু' : 'Main Menu'}
            </div>

            {/* 1. আজকের করণীয় (Home) */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                currentScreen === 'dashboard'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <LayoutDashboard
                  className={`w-4 h-4 shrink-0 ${
                    currentScreen === 'dashboard' ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{isBn ? 'আজকের করণীয়' : 'Today’s Actions'}</span>
              </div>
            </button>

            {/* 2. আমার খামার (My Farm) */}
            <button
              onClick={() => handleNav('animals')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                currentScreen === 'animals'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Layers
                  className={`w-4 h-4 shrink-0 ${
                    currentScreen === 'animals' ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{isBn ? 'আমার খামার' : 'My Farm'}</span>
              </div>
            </button>

            {/* 3. BioShield সুরক্ষা */}
            <button
              onClick={() => handleNav('biosecurity')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                isBioShieldActive
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <ShieldCheck
                  className={`w-4 h-4 shrink-0 ${
                    isBioShieldActive ? 'text-emerald-300' : 'text-emerald-700'
                  }`}
                />
                <span className="truncate">{isBn ? 'BioShield সুরক্ষা' : 'BioShield Protection'}</span>
              </div>
            </button>

            {/* 4. স্বাস্থ্য সহায়তা (Unified Vet + Khamar Bondhu) */}
            <button
              onClick={() => handleNav('health_support')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                isHelpActive
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <HeartPulse
                  className={`w-4 h-4 shrink-0 ${
                    isHelpActive ? 'text-emerald-300' : 'text-rose-600'
                  }`}
                />
                <span className="truncate">{isBn ? 'স্বাস্থ্য সহায়তা' : 'Health Support'}</span>
              </div>
            </button>

            {/* SECONDARY FARMER PAGES */}
            <div className="pt-3 mt-2 border-t border-slate-200 space-y-1.5">
              <div className="px-2 pb-0.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                {isBn ? 'আরও প্রয়োজনীয় সেবা' : 'More Farm Tools'}
              </div>

              {/* টিকা ও যত্ন ক্যালেন্ডার */}
              <button
                onClick={() => handleNav('calendar')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                  currentScreen === 'calendar'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Calendar
                    className={`w-4 h-4 shrink-0 ${
                      currentScreen === 'calendar' ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{isBn ? 'টিকা ও যত্ন ক্যালেন্ডার' : 'Care Calendar'}</span>
                </div>
                {pendingTasksCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                      currentScreen === 'calendar'
                        ? 'bg-white text-emerald-900'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {toBanglaNum(pendingTasksCount, lang)}
                  </span>
                )}
              </button>

              {/* সতর্কতা ও তথ্য */}
              <button
                onClick={() => handleNav('regional_alerts')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                  currentScreen === 'regional_alerts'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Radio
                    className={`w-4 h-4 shrink-0 ${
                      currentScreen === 'regional_alerts' ? 'text-emerald-300' : 'text-rose-600'
                    }`}
                  />
                  <span className="truncate">{isBn ? 'সতর্কতা ও তথ্য' : 'Alerts & Advisories'}</span>
                </div>
              </button>

              {/* শিখি (জ্ঞানভান্ডার) */}
              <button
                onClick={() => handleNav('knowledge_library')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                  currentScreen === 'knowledge_library'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <BookOpen
                    className={`w-4 h-4 shrink-0 ${
                      currentScreen === 'knowledge_library' ? 'text-emerald-300' : 'text-indigo-600'
                    }`}
                  />
                  <span className="truncate">{isBn ? 'শিখি (জ্ঞানভান্ডার)' : 'Knowledge Library'}</span>
                </div>
              </button>

              {/* সেটিংস ও এসএমএস */}
              <button
                onClick={() => handleNav('settings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all min-h-[44px] ${
                  currentScreen === 'settings'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Settings
                    className={`w-4 h-4 shrink-0 ${
                      currentScreen === 'settings' ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{isBn ? 'সেটিংস ও এসএমএস' : 'Settings & SMS'}</span>
                </div>
              </button>
            </div>

            {/* RESTRICTED / SECONDARY DEMO & GOVERNANCE TOOLS (COLLAPSIBLE DRAWER) */}
            <div className="pt-2 border-t border-slate-200 mt-3">
              <button
                type="button"
                onClick={() => setRestrictedExpanded(!restrictedExpanded)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50 min-h-[40px]"
              >
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? 'গভর্ন্যান্স ও ডেমো টুলস' : 'Governance & Demo Tools'}</span>
                </div>
                {restrictedExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {restrictedExpanded && (
                <div className="mt-1 space-y-1 p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-xs">
                  <div className="text-[10px] text-slate-500 leading-tight mb-2 flex items-start gap-1 p-1.5 rounded-lg bg-white border border-slate-200">
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      {isBn
                        ? 'ডেমো ও গভর্ন্যান্স প্রদর্শনী টুলস। প্রকৃত নিরাপত্তা ফায়ারবেস অথেন্টিকেশন দ্বারা নিয়ন্ত্রিত।'
                        : 'Demo & governance tools. Real security is enforced via Firebase Auth & rules.'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleNav('ussd_simulator')}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      currentScreen === 'ussd_simulator'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isBn ? 'ইউএসএসডি সিমুলেটর' : 'USSD Simulator'}</span>
                    </div>
                    <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-mono">
                      DEMO
                    </span>
                  </button>

                  {isVetOrAdmin && (
                    <button
                      onClick={() => handleNav('governance_portal')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        currentScreen === 'governance_portal'
                          ? 'bg-slate-800 text-white font-bold'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isBn ? 'প্রটোকল গভর্ন্যান্স' : 'Protocol Governance'}</span>
                      </div>
                      <span className="text-[9px] font-bold bg-indigo-100 text-indigo-900 px-1 py-0.2 rounded font-mono">
                        ADMIN
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNav('roadmap')}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      currentScreen === 'roadmap'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Milestone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isBn ? 'প্রজেক্ট রোডম্যাপ' : 'Project Roadmap'}</span>
                    </div>
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-800 px-1 py-0.2 rounded font-mono">
                      INFO
                    </span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* BioShield Attribution Footer */}
          <div className="pt-2.5 border-t border-slate-200 mt-2 shrink-0">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="leading-tight">
                {isBn
                  ? 'খামার সুরক্ষা — সহজ দৈনিক খামার সুরক্ষা ও প্রাণী যত্ন সহায়িকা।'
                  : 'Khamar Shurokkha — Simple Daily Farm Protection Companion.'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
