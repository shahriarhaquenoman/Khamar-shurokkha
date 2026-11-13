import React, { useState } from 'react';
import { Logo } from './Logo';
import { FarmProfile, Language, NavScreen, UserRole, AppNotification } from '../types';
import { FarmerAccount } from '../services/authService';
import { t } from '../translations';
import {
  Globe,
  Sparkles,
  RotateCcw,
  Menu,
  Building2,
  Bell,
  UserCheck,
  ChevronDown,
  X,
  CheckCircle2,
  AlertTriangle,
  Syringe,
  Pill,
  User,
} from 'lucide-react';

interface HeaderProps {
  currentFarm: FarmProfile;
  allFarms: FarmProfile[];
  onSelectFarm: (farm: FarmProfile) => void;
  lang: Language;
  onToggleLang: () => void;
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
  onLaunchDemo: () => void;
  onResetDemo: () => void;
  isDemoActive: boolean;
  onNavigate: (screen: NavScreen) => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  currentUser?: FarmerAccount | null;
  onOpenAuthModal?: () => void;
  onOpenNotificationCenter?: () => void;
  completedTaskIds?: string[];
}

export const Header: React.FC<HeaderProps> = ({
  currentFarm,
  allFarms,
  onSelectFarm,
  lang,
  onToggleLang,
  role,
  onChangeRole,
  onLaunchDemo,
  onResetDemo,
  isDemoActive,
  onNavigate,
  onToggleMobileMenu,
  isMobileMenuOpen,
  notifications,
  onMarkNotificationRead,
  currentUser,
  onOpenAuthModal,
  onOpenNotificationCenter,
  completedTaskIds = [],
}) => {
  const isBn = lang === 'bn';
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const activeNotifications = notifications.filter(
    (n) => !n.targetTaskId || !completedTaskIds.includes(n.targetTaskId)
  );
  const unreadNotifs = activeNotifications.filter((n) => !n.isRead);

  const roleLabels: Record<UserRole, { bn: string; en: string }> = {
    farmer: { bn: 'খামারি মোড', en: 'Farmer' },
    vet_pro: { bn: 'ভেটেরিনারি সার্জন', en: 'Vet Pro' },
    admin: { bn: 'প্রশাসন', en: 'Admin' },
    advisor: { bn: 'উপদেষ্টা / বিচারক', en: 'Advisor Demo' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="cursor-pointer select-none text-left"
            aria-label={isBn ? 'খামার সুরক্ষা ড্যাশবোর্ডে ফিরুন' : 'Go to Khamar Shurokkha dashboard'}
          >
            <Logo size="md" lang={lang} compactOnMobile />
          </button>
        </div>

        {/* Center: Farm & Account Selector */}
        <div className="flex items-center relative">
          <button
            onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors max-w-[170px] sm:max-w-[280px]"
            title={isBn ? 'খামার ও একাউন্ট পরিবর্তন করুন' : 'Switch Farm or Account'}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{currentFarm.name.split('(')[0]}</span>
            <span className="hidden sm:inline text-[10px] text-slate-600 font-mono">({currentFarm.id})</span>
            <ChevronDown className="w-3 h-3 text-slate-600 shrink-0" />
          </button>

          {farmDropdownOpen && (
            <div className="absolute top-full left-0 sm:left-auto mt-1.5 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 text-[11px] font-bold text-slate-600 px-1">
                <span>{isBn ? 'খামারি একাউন্ট ও খামার নির্বাচন' : 'Farmer Account & Farm Selection'}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                  {currentFarm.id}
                </span>
              </div>

              {/* Account 1: Md. Rafiqul Islam (Multiple Farms) */}
              <div className="mb-2">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-800 flex items-center justify-between bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 text-emerald-700" />
                    <span>{isBn ? 'মো: রফিকুল ইসলাম' : 'Md. Rafiqul Islam'}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">01712-345678 (২টি খামার)</span>
                </div>

                <div className="space-y-1 mt-1 pl-2 border-l-2 border-emerald-500/40">
                  {allFarms
                    .filter((f) => f.ownerPhone === '01712-345678')
                    .map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectFarm(f);
                          setFarmDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          f.id === currentFarm.id
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate font-medium text-xs">{f.name}</div>
                          <div className="text-[10px] text-slate-600">{f.id} · {f.district}</div>
                        </div>
                        {f.id === currentFarm.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Account 2: Most. Fatema Begum (Cross-Account Isolation) */}
              <div>
                <div className="px-2 py-1 text-[11px] font-bold text-slate-800 flex items-center justify-between bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 text-amber-700" />
                    <span>{isBn ? 'মোছাঃ ফাতেমা বেগম' : 'Most. Fatema Begum'}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">01819-987654 (১টি খামার)</span>
                </div>

                <div className="space-y-1 mt-1 pl-2 border-l-2 border-amber-500/40">
                  {allFarms
                    .filter((f) => f.ownerPhone === '01819-987654')
                    .map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectFarm(f);
                          setFarmDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          f.id === currentFarm.id
                            ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">
                          <div className="truncate font-medium text-xs">{f.name}</div>
                          <div className="text-[10px] text-slate-600">{f.id} · {f.district}</div>
                        </div>
                        {f.id === currentFarm.id && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </button>
                    ))}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600 text-center">
                {isBn
                  ? '🔒 ভিন্ন খামারি একাউন্টের ডেটা সম্পূর্ণ পৃথক ও সুরক্ষিত থাকে'
                  : '🔒 Strict multi-tenant data isolation between farmer accounts'}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Island */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Farmer Account Badge / Modal Opener */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                currentUser?.isDemo
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950'
              }`}
              title={currentUser?.isDemo ? 'ডেমো অ্যাকাউন্ট পরিবর্তন করুন' : 'ক্লাউড অ্যাকাউন্ট'}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline truncate max-w-[100px]">
                {currentUser?.displayName?.split(' ')[0] || (isBn ? 'খামারি' : 'Account')}
              </span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                currentUser?.isDemo ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {currentUser?.isDemo ? 'DEMO' : 'LIVE'}
              </span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-semibold transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">
                {isBn ? roleLabels[role].bn : roleLabels[role].en}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-600" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in duration-150">
                <div className="text-[10px] font-bold text-slate-600 px-2 py-1 uppercase">
                  {isBn ? 'ব্যবহারকারীর ভূমিকা' : 'Switch Role'}
                </div>
                {(['farmer', 'vet_pro', 'admin', 'advisor'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      role === r
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{isBn ? roleLabels[r].bn : roleLabels[r].en}</span>
                    {role === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-xs">
                    {isBn ? 'নোটিফিকেশন ও অ্যালার্ট' : 'Notifications'}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">
                    {unreadNotifs.length} {isBn ? 'টি অপঠিত' : 'Unread'}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {activeNotifications.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-600">
                      {isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications'}
                    </div>
                  ) : (
                    activeNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onMarkNotificationRead(notif.id);
                          if (notif.targetScreen) {
                            onNavigate(notif.targetScreen);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          notif.isRead
                            ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            : 'bg-emerald-50/70 border border-emerald-200 text-slate-900 font-medium hover:bg-emerald-100/70'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {notif.category === 'vaccination' && (
                            <Syringe className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {notif.category === 'deworming' && (
                            <Pill className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          {notif.category === 'alert' && (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {isBn ? notif.titleBn : notif.titleEn}
                            </div>
                            <div className="text-slate-600 text-[11px] mt-0.5 leading-snug line-clamp-2">
                              {isBn ? notif.bodyBn : notif.bodyEn}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {onOpenNotificationCenter && (
                  <div className="pt-2 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        onOpenNotificationCenter();
                      }}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isBn ? 'পূর্ণ নোটিফিকেশন সেন্টার খুলুন' : 'Open Notification Center'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>{isBn ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Advisor Demo Controls */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Load Green Valley Integrated Farm Demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isBn ? 'ডেমো লোড' : 'Load Demo'}</span>
            </button>
            <button
              onClick={onResetDemo}
              className="p-1.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title={isBn ? 'রিসেট ডেটা' : 'Reset'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
