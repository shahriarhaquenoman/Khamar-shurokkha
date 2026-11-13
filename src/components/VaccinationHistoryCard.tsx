import React from 'react';
import { CareRecord, ScheduledCareTask, Language } from '../types';
import { toBanglaNum } from '../translations';
import {
  Syringe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  PlusCircle,
  Calendar,
  UserCheck,
} from 'lucide-react';

export interface TimelineVaccineItem {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'missed';
  administeredBy?: string;
  productName?: string;
  batchNumber?: string;
  notes?: string;
  verifiedByVet?: string;
}

interface VaccinationHistoryCardProps {
  targetId: string;
  targetType: 'animal' | 'flock';
  careRecords: CareRecord[];
  scheduledTasks?: ScheduledCareTask[];
  lang: Language;
  onRecordCare?: () => void;
  className?: string;
}

export const VaccinationHistoryCard: React.FC<VaccinationHistoryCardProps> = ({
  targetId,
  targetType,
  careRecords,
  scheduledTasks = [],
  lang,
  onRecordCare,
  className = '',
}) => {
  const isBn = lang === 'bn';

  // 1. Gather completed and recorded care records for this target
  const vaccineRecords = careRecords.filter(
    (r) => r.targetId === targetId && r.careType === 'vaccination'
  );

  const timelineItems: TimelineVaccineItem[] = [];

  // Add recorded care records
  vaccineRecords.forEach((r) => {
    timelineItems.push({
      id: r.id,
      title: r.diseaseOrTarget,
      date: r.dateAdministered,
      status: r.status === 'missed' ? 'missed' : 'completed',
      administeredBy: r.administeredBy,
      productName: r.productName,
      batchNumber: r.batchNumber,
      notes: r.notes,
      verifiedByVet: r.verifiedByVet,
    });
  });

  // 2. Also check scheduled tasks for any marked as 'missed' or overdue that aren't in records
  const targetTasks = scheduledTasks.filter(
    (t) => t.targetId === targetId && t.careType === 'vaccination'
  );

  targetTasks.forEach((t) => {
    // Check if this task is marked missed or overdue
    const isMissed = t.status === 'missed';
    const isPastOverdue = t.status === 'overdue';

    if (isMissed || isPastOverdue) {
      // Avoid duplicate if already in timelineItems by matching title or date
      const alreadyIncluded = timelineItems.some(
        (item) => item.date === t.dueDate || item.title.includes(t.titleBn)
      );
      if (!alreadyIncluded) {
        timelineItems.push({
          id: `task_${t.id}`,
          title: isBn ? t.titleBn : t.titleEn,
          date: t.dueDate,
          status: 'missed',
          administeredBy: isBn ? 'সময়মতো দেওয়া হয়নি' : 'Not administered on schedule',
          notes: isBn ? t.descriptionBn : t.descriptionEn,
        });
      }
    }
  });

  // 3. Sort by date descending (most recent first)
  timelineItems.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeB - timeA;
  });

  // 4. Take the last 3 administered/missed vaccines
  const last3Vaccines = timelineItems.slice(0, 3);

  const completedCount = last3Vaccines.filter((v) => v.status === 'completed').length;
  const missedCount = last3Vaccines.filter((v) => v.status === 'missed').length;

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-slate-200/90 p-4 sm:p-5 shadow-xs transition-all space-y-4 ${className}`}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
            <Syringe className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                {isBn ? 'টিকা প্রদানের ইতিহাস (সর্বশেষ ৩টি)' : 'Vaccination History (Last 3)'}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {targetType === 'flock'
                ? isBn
                  ? 'এই পোল্ট্রি ব্যাচের সর্বশেষ ৩টি প্রতিষেধক টিকার স্থিতি ও রেকর্ড'
                  : 'Last 3 vaccination events and administration status for this flock'
                : isBn
                ? 'এই প্রাণীর সর্বশেষ ৩টি প্রতিষেধক টিকার স্থিতি ও ভেট রেকর্ড'
                : 'Last 3 vaccination events and veterinary verification records'}
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {completedCount > 0 && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {toBanglaNum(completedCount, lang)} {isBn ? 'সম্পন্ন' : 'Completed'}
              </span>
            </span>
          )}
          {missedCount > 0 && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {toBanglaNum(missedCount, lang)} {isBn ? 'মিস হয়েছে' : 'Missed'}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      {last3Vaccines.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <Syringe className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700">
            {isBn
              ? 'এখনো কোনো টিকা প্রদানের ইতিহাস নথিভুক্ত করা হয়নি।'
              : 'No vaccination history recorded for this animal yet.'}
          </p>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            {isBn
              ? 'নির্ধারিত বা জরুরি টিকা দেওয়া হলে তা সাথে সাথে লগ করুন।'
              : 'Record routine or emergency vaccinations to maintain accurate health history.'}
          </p>
          {onRecordCare && (
            <button
              onClick={onRecordCare}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রথম টিকা রেকর্ড করুন' : 'Record First Vaccine'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative pl-7 sm:pl-8 space-y-4">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-3.5 sm:left-4 top-3 bottom-3 w-0.5 bg-slate-200" />

          {last3Vaccines.map((item, idx) => {
            const isCompleted = item.status === 'completed';

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Status Node Icon */}
                <div
                  className={`absolute -left-7 sm:-left-8 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500 ring-4 ring-emerald-50'
                      : 'bg-rose-100 text-rose-700 border-2 border-rose-500 ring-4 ring-rose-50'
                  }`}
                  title={
                    isCompleted
                      ? isBn
                        ? 'টিকা সফলভাবে সম্পন্ন হয়েছে'
                        : 'Vaccination completed'
                      : isBn
                      ? 'টিকা মিস হয়েছে বা সময় পার হয়েছে'
                      : 'Vaccination missed / overdue'
                  }
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-600" />
                  )}
                </div>

                {/* Timeline Event Content Card */}
                <div
                  className={`rounded-2xl p-3.5 sm:p-4 border transition-all ${
                    isCompleted
                      ? 'bg-slate-50/70 hover:bg-emerald-50/30 border-slate-200/90'
                      : 'bg-rose-50/40 hover:bg-rose-50/70 border-rose-200'
                  }`}
                >
                  {/* Top Bar: Vaccine Name & Status Tag */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      {/* Product Name & Batch */}
                      {(item.productName || item.batchNumber) && (
                        <div className="text-[11px] text-slate-600 font-medium">
                          {item.productName && <span>{item.productName}</span>}
                          {item.batchNumber && (
                            <span className="font-mono text-slate-500 ml-1.5">
                              ({isBn ? 'ব্যাচ:' : 'Batch:'} {item.batchNumber})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{isBn ? '✓ দেওয়া হয়েছে' : 'Completed'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>{isBn ? '⚠️ মিস হয়েছে' : 'Missed'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Row: Date, Administrator, Verification */}
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {isBn ? 'তারিখ:' : 'Date:'}{' '}
                          <strong className="text-slate-800">
                            {toBanglaNum(item.date, lang)}
                          </strong>
                        </span>
                      </div>

                      {item.administeredBy && (
                        <div className="flex items-center gap-1 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {isBn ? 'প্রয়োগকারী:' : 'By:'}{' '}
                            <span className="text-slate-800">{item.administeredBy}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {item.verifiedByVet && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        <span>{isBn ? 'ভেট দ্বারা যাচাইকৃত' : 'Vet Verified'}</span>
                      </span>
                    )}
                  </div>

                  {/* Notes if present */}
                  {item.notes && (
                    <p className="mt-1.5 text-[11px] text-slate-600 leading-relaxed bg-white/70 rounded-lg p-2 border border-slate-100">
                      <strong className="text-slate-700">
                        {isBn ? 'নোট: ' : 'Note: '}
                      </strong>
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Quick Action */}
      {onRecordCare && last3Vaccines.length > 0 && (
        <div className="pt-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-slate-500 font-medium">
            {isBn
              ? `মোট ${toBanglaNum(vaccineRecords.length, lang)}টি টিকা রেকর্ড সংরক্ষিত রয়েছে`
              : `${vaccineRecords.length} total vaccination records logged`}
          </span>
          <button
            onClick={onRecordCare}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isBn ? '+ টিকা রেকর্ড যোগ করুন' : '+ Log Vaccine'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
