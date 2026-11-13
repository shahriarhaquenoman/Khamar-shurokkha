import React, { useState } from 'react';
import { Language, AppNotification, NavScreen } from '../types';
import { toBanglaNum } from '../translations';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Syringe,
  Pill,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  lang: Language;
  onMarkRead: (id: string) => void;
  onNavigate?: (screen: NavScreen) => void;
  completedTaskIds?: string[];
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  lang,
  onMarkRead,
  onNavigate,
  completedTaskIds = [],
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;
  const isBn = lang === 'bn';

  // Suppress stale notifications whose linked task has already been completed or marked N/A
  const activeNotifications = notifications.filter(
    (n) => !n.targetTaskId || !completedTaskIds.includes(n.targetTaskId)
  );

  const unreadCount = activeNotifications.filter((n) => !n.isRead).length;
  const filtered =
    filter === 'unread' ? activeNotifications.filter((n) => !n.isRead) : activeNotifications;

  const handleMarkAllRead = () => {
    activeNotifications.filter((notification) => !notification.isRead).forEach((notification) => onMarkRead(notification.id));
  };

  const handleItemClick = (n: AppNotification) => {
    if (!n.isRead) onMarkRead(n.id);
    if (n.targetScreen && onNavigate) {
      onClose();
      onNavigate(n.targetScreen);
    }
  };

  const getNotifIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'vaccination':
        return <Syringe className="w-4 h-4 text-emerald-600" />;
      case 'deworming':
        return <Pill className="w-4 h-4 text-amber-600" />;
      case 'biosecurity':
        return <ShieldAlert className="w-4 h-4 text-teal-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'weather':
        return <Clock className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-white/10 text-emerald-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                {isBn ? 'খামার বার্তা ও রিমাইন্ডার' : 'Farm Reminders & Notices'}
              </h3>
              <p className="text-xs text-emerald-200">
                {unreadCount > 0
                  ? isBn
                    ? `${toBanglaNum(unreadCount, lang)}টি নতুন বার্তা আছে`
                    : `${unreadCount} unread reminders`
                  : isBn
                  ? 'সব বার্তা দেখা হয়েছে'
                  : 'All caught up'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="min-w-[44px] min-h-[44px] rounded-full text-emerald-200 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Truthful note: reading != completing */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11px] font-bold text-amber-950 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            {isBn
              ? 'বার্তা খোলা বা “পড়া হয়েছে” চিহ্নিত করলে কাজ সম্পন্ন হয় না — কাজের পাতায় গিয়ে অবস্থা জানান।'
              : 'Opening or marking a reminder read does not complete the underlying farm task.'}
          </span>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`min-h-[38px] px-3 py-1 rounded-xl font-bold cursor-pointer ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'সব' : 'All'} ({toBanglaNum(activeNotifications.length, lang)})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`min-h-[38px] px-3 py-1 rounded-xl font-bold cursor-pointer ${
                filter === 'unread' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'নতুন' : 'Unread'} ({toBanglaNum(unreadCount, lang)})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব পড়া হয়েছে' : 'Mark all read'}</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                {isBn ? 'এখন কোনো নতুন রিমাইন্ডার বাকি নেই' : 'No active reminders'}
              </p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  !n.isRead
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 mt-0.5">
                    {getNotifIcon(n.category)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                        {isBn ? n.titleBn : n.titleEn}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn ? n.bodyBn : n.bodyEn}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2 font-mono">
                        <span>{toBanglaNum(n.createdAt.split('T')[0], lang)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans text-emerald-800 font-bold">
                          {n.deliveryChannel === 'simulated_sms'
                            ? isBn ? 'পরিকল্পিত SMS' : 'Planned SMS'
                            : isBn ? 'অ্যাপ বার্তা' : 'In-App'}
                        </span>
                      </div>

                      {n.targetScreen && (
                        <span className="text-emerald-800 font-extrabold inline-flex items-center gap-1">
                          <span>{isBn ? 'কাজে যান' : 'Open'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
