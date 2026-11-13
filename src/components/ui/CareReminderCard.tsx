import React from 'react';
import { ScheduledCareTask, Language } from '../../types';
import { toBanglaNum } from '../../translations';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import {
  Bell,
  Check,
  Syringe,
  Pill,
  Clock,
  ChevronRight,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface CareReminderCardProps {
  task: ScheduledCareTask;
  lang?: Language;
  onComplete: (taskId: string) => void;
  onViewDetails?: (task: ScheduledCareTask) => void;
}

export const CareReminderCard: React.FC<CareReminderCardProps> = ({
  task,
  lang = 'bn',
  onComplete,
  onViewDetails,
}) => {
  const isBn = lang === 'bn';

  // Calculate days difference
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(task.dueDate);
  taskDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0 || task.status === 'overdue';
  const isWithin3Days = diffDays >= 0 && diffDays <= 3;
  const isVaccine = task.careType === 'vaccination';

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all border ${
        isOverdue
          ? 'bg-gradient-to-br from-rose-50 via-red-50 to-rose-100/80 border-rose-300 shadow-md ring-4 ring-rose-500/10'
          : isWithin3Days
          ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100/90 border-2 border-orange-500 shadow-md ring-4 ring-orange-400/20'
          : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          {/* Urgency Badge */}
          {isOverdue ? (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isBn ? 'জরুরি: সময় পার হয়েছে!' : 'Overdue Alert!'}</span>
            </span>
          ) : isWithin3Days ? (
            <>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500 text-white shadow-xs tracking-wide flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {diffDays === 0
                    ? isBn
                      ? 'আজকের কাজ'
                      : 'Due Today'
                    : isBn
                    ? `আর মাত্র ${toBanglaNum(diffDays, lang)} দিন বাকি`
                    : `${diffDays} days left`}
                </span>
              </span>
            </>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{isBn ? 'পরবর্তী শিডিউল' : 'Scheduled Ahead'}</span>
            </span>
          )}

          {/* Care Type Badge */}
          <StatusBadge variant={isVaccine ? 'vaccination' : 'deworming'} size="sm" lang={lang} />
        </div>

        {/* Target Entity Pill */}
        <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/80 font-mono">
          {task.targetName}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="mt-4 flex items-start gap-3.5">
        <div
          className={`p-3.5 rounded-2xl shrink-0 border shadow-xs ${
            isOverdue
              ? 'bg-rose-600 text-white border-rose-700'
              : isWithin3Days
              ? 'bg-orange-500 text-white border-orange-600'
              : 'bg-emerald-700 text-white border-emerald-800'
          }`}
        >
          {isVaccine ? <Syringe className="w-6 h-6" /> : <Pill className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-600">
            {isBn ? 'নির্ধারিত তারিখ:' : 'Due Date:'}{' '}
            <span className="text-slate-900 font-bold">
              {toBanglaNum(task.dueDate, lang)}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-snug">
            {isBn ? task.titleBn : task.titleEn}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {isBn ? task.descriptionBn : task.descriptionEn}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-600 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-600 shrink-0" />
          <span>
            {isBn
              ? 'প্রয়োগ সম্পন্ন হলে নিচে নিশ্চিত করুন যাতে ইতিহাস হালনাগাদ হয়।'
              : 'Confirm once administered to update profile timeline.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(task)}
              className="text-xs"
            >
              {isBn ? 'লগ ও বিস্তারিত' : 'Details'}
            </Button>
          )}

          <Button
            variant="success"
            size="md"
            leftIcon={<Check className="w-4 h-4 stroke-[2.5]" />}
            onClick={() => onComplete(task.id)}
            className="flex-1 sm:flex-none text-xs sm:text-sm shadow-md"
          >
            {isBn ? '✓ দেওয়া হয়েছে (সম্পন্ন)' : 'Mark Completed'}
          </Button>
        </div>
      </div>
    </div>
  );
};
