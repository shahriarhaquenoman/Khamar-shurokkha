import React, { useState } from 'react';
import { NavScreen, Language } from '../types';
import {
  LayoutDashboard,
  Layers,
  ShieldCheck,
  HeartPulse,
  MoreHorizontal,
  Calendar,
  Radio,
  BookOpen,
  Settings,
  X,
  Phone,
  Milestone,
} from 'lucide-react';
import { toBanglaNum } from '../translations';

interface MobileNavProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen, topicKey?: string) => void;
  lang: Language;
  pendingTasksCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentScreen,
  onNavigate,
  lang,
  pendingTasksCount,
}) => {
  const isBn = lang === 'bn';
  const [moreOpen, setMoreOpen] = useState(false);

  const isHelpActive =
    currentScreen === 'health_support' ||
    currentScreen === 'vet_services' ||
    currentScreen === 'ai_assistant';

  const isMoreActive =
    currentScreen === 'calendar' ||
    currentScreen === 'regional_alerts' ||
    currentScreen === 'knowledge_library' ||
    currentScreen === 'settings' ||
    currentScreen === 'ussd_simulator' ||
    currentScreen === 'governance_portal' ||
    currentScreen === 'roadmap';

  const handleSelect = (screen: NavScreen) => {
    setMoreOpen(false);
    onNavigate(screen);
  };

  return (
    <>
      {/* "আরও" Bottom Sheet Drawer */}
      {moreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-4 pb-6 shadow-2xl border-t border-slate-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-sm font-black text-slate-900">
                {isBn ? 'আরও প্রয়োজনীয় সেবা' : 'More Farm Services'}
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSelect('calendar')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left min-h-[54px] transition-all ${
                  currentScreen === 'calendar'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Calendar className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span className="text-xs font-bold leading-snug">
                    {isBn ? 'টিকা ও যত্ন ক্যালেন্ডার' : 'Care Calendar'}
                  </span>
                </div>
                {pendingTasksCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-white shrink-0">
                    {toBanglaNum(pendingTasksCount, lang)}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSelect('regional_alerts')}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left min-h-[54px] transition-all ${
                  currentScreen === 'regional_alerts'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Radio className="w-5 h-5 shrink-0 text-rose-600" />
                <span className="text-xs font-bold leading-snug">
                  {isBn ? 'সতর্কতা ও তথ্য' : 'Alerts & Advisories'}
                </span>
              </button>

              <button
                onClick={() => handleSelect('knowledge_library')}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left min-h-[54px] transition-all ${
                  currentScreen === 'knowledge_library'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-5 h-5 shrink-0 text-indigo-600" />
                <span className="text-xs font-bold leading-snug">
                  {isBn ? 'শিখি (জ্ঞানভান্ডার)' : 'Knowledge Library'}
                </span>
              </button>

              <button
                onClick={() => handleSelect('settings')}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left min-h-[54px] transition-all ${
                  currentScreen === 'settings'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0 text-slate-600" />
                <span className="text-xs font-bold leading-snug">
                  {isBn ? 'সেটিংস ও এসএমএস' : 'Settings & SMS'}
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => handleSelect('ussd_simulator')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>{isBn ? 'USSD ডেমো' : 'USSD Demo'}</span>
              </button>
              <button
                onClick={() => handleSelect('roadmap')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold min-h-[44px]"
              >
                <Milestone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'রোডম্যাপ' : 'Roadmap'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1.5 py-1 shadow-lg safe-area-pb">
        <div className="grid grid-cols-5 max-w-md mx-auto gap-1">
          <button
            onClick={() => handleSelect('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative min-h-[48px] active:scale-95 ${
              currentScreen === 'dashboard'
                ? 'text-emerald-950 font-black bg-emerald-100/70'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <LayoutDashboard
              className={`w-5 h-5 ${
                currentScreen === 'dashboard' ? 'stroke-[2.5] text-emerald-900' : 'stroke-2 text-slate-600'
              }`}
            />
            <span className="text-[10px] mt-1 leading-none truncate max-w-full">
              {isBn ? 'আজকের কাজ' : 'Today'}
            </span>
          </button>

          <button
            onClick={() => handleSelect('animals')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative min-h-[48px] active:scale-95 ${
              currentScreen === 'animals'
                ? 'text-emerald-950 font-black bg-emerald-100/70'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <Layers
              className={`w-5 h-5 ${
                currentScreen === 'animals' ? 'stroke-[2.5] text-emerald-900' : 'stroke-2 text-slate-600'
              }`}
            />
            <span className="text-[10px] mt-1 leading-none truncate max-w-full">
              {isBn ? 'আমার খামার' : 'My Farm'}
            </span>
          </button>

          <button
            onClick={() => handleSelect('biosecurity')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative min-h-[48px] active:scale-95 ${
              currentScreen === 'biosecurity'
                ? 'text-emerald-950 font-black bg-emerald-100/70'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <ShieldCheck
              className={`w-5 h-5 ${
                currentScreen === 'biosecurity' ? 'stroke-[2.5] text-emerald-900' : 'stroke-2 text-slate-600'
              }`}
            />
            <span className="text-[10px] mt-1 leading-none truncate max-w-full">
              {isBn ? 'সুরক্ষা' : 'BioShield'}
            </span>
          </button>

          <button
            onClick={() => handleSelect('health_support')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative min-h-[48px] active:scale-95 ${
              isHelpActive
                ? 'text-emerald-950 font-black bg-emerald-100/70'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <HeartPulse
              className={`w-5 h-5 ${
                isHelpActive ? 'stroke-[2.5] text-emerald-900' : 'stroke-2 text-slate-600'
              }`}
            />
            <span className="text-[10px] mt-1 leading-none truncate max-w-full">
              {isBn ? 'সহায়তা' : 'Support'}
            </span>
          </button>

          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative min-h-[48px] active:scale-95 ${
              isMoreActive || moreOpen
                ? 'text-emerald-950 font-black bg-emerald-100/70'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <div className="relative">
              <MoreHorizontal
                className={`w-5 h-5 ${
                  isMoreActive || moreOpen ? 'stroke-[2.5] text-emerald-900' : 'stroke-2 text-slate-600'
                }`}
              />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-amber-600 text-white shadow-xs">
                  {toBanglaNum(pendingTasksCount, lang)}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 leading-none truncate max-w-full">
              {isBn ? 'আরও' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
