import React from 'react';
import { Language } from '../../types';
import { toBanglaNum } from '../../translations';
import { StatusBadge } from './StatusBadge';
import {
  Bell,
  Syringe,
  Pill,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'vaccine_reminder' | 'deworm_reminder' | 'biosecurity_alert' | 'outbreak_warning' | 'system_notice';
  createdAt: string;
  isRead: boolean;
  relatedTaskId?: string;
  relatedTargetId?: string;
}

interface NotificationCardProps {
  notification: NotificationData;
  lang?: Language;
  onMarkRead?: (id: string) => void;
  onAction?: (notification: NotificationData) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  lang = 'bn',
  onMarkRead,
  onAction,
}) => {
  const isBn = lang === 'bn';

  const typeConfig: Record<
    NotificationData['type'],
    { icon: React.ReactNode; bg: string; border: string; badgeTextBn: string; badgeTextEn: string }
  > = {
    vaccine_reminder: {
      icon: <Syringe className="w-5 h-5 text-orange-600" />,
      bg: 'bg-orange-50/70',
      border: 'border-orange-200',
      badgeTextBn: 'টিকা রিমাইন্ডার',
      badgeTextEn: 'Vaccine Due',
    },
    deworm_reminder: {
      icon: <Pill className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      badgeTextBn: 'কৃমিনাশক নোটিশ',
      badgeTextEn: 'Deworming Due',
    },
    biosecurity_alert: {
      icon: <ShieldAlert className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      badgeTextBn: 'জীবনিরাপত্তা সতর্কতা',
      badgeTextEn: 'Biosecurity Alert',
    },
    outbreak_warning: {
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50/70',
      border: 'border-rose-300',
      badgeTextBn: 'আঞ্চলিক প্রাদুর্ভাব',
      badgeTextEn: 'Regional Outbreak',
    },
    system_notice: {
      icon: <Bell className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      badgeTextBn: 'সিস্টেম নোটিশ',
      badgeTextEn: 'Notice',
    },
  };

  const current = typeConfig[notification.type] || typeConfig.system_notice;

  return (
    <div
      onClick={() => {
        if (!notification.isRead && onMarkRead) {
          onMarkRead(notification.id);
        }
        if (onAction) {
          onAction(notification);
        }
      }}
      className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
        !notification.isRead
          ? `${current.bg} ${current.border} shadow-2xs font-medium`
          : 'bg-white border-slate-200 hover:bg-slate-50 opacity-85'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-200 shrink-0 mt-0.5">
          {current.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                {isBn ? current.badgeTextBn : current.badgeTextEn}
              </span>
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" />
              <span>{toBanglaNum(notification.createdAt.split('T')[0], lang)}</span>
            </div>
          </div>

          <h4 className="text-sm font-black text-slate-900 leading-snug">
            {notification.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
};
