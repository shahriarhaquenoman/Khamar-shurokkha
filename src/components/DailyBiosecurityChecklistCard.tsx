import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { toBanglaNum } from '../translations';
import {
  STANDARD_BIOSECURITY_TASKS,
  BiosecurityChecklistRecord,
} from '../services/biosecurityService';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  Footprints,
  BookOpen,
  SprayCan,
  Trash2,
  Droplets,
  Shirt,
} from 'lucide-react';

interface DailyBiosecurityChecklistCardProps {
  farmId: string;
  farmName: string;
  ownerUid: string;
  ownerName: string;
  lang: Language;
  records: Record<string, BiosecurityChecklistRecord>;
  onSaveRecord: (record: BiosecurityChecklistRecord) => void;
  onBiosecurityComplete?: (score: number) => void;
}

export const DailyBiosecurityChecklistCard: React.FC<DailyBiosecurityChecklistCardProps> = ({
  farmId,
  farmName,
  ownerUid,
  ownerName,
  lang,
  records,
  onSaveRecord,
  onBiosecurityComplete,
}) => {
  const isBn = lang === 'bn';
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [inspectorName, setInspectorName] = useState<string>(ownerName || 'খামারি নিজে');
  const [notes, setNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const checklistKey = `${farmId}_${selectedDate}`;
  const existingRecord = records[checklistKey];

  useEffect(() => {
    if (existingRecord) {
      setCompletedItems(existingRecord.itemsCompleted);
      setInspectorName(existingRecord.inspectorName || ownerName || 'খামারি নিজে');
      setNotes(existingRecord.notes || '');
      setIsSaved(true);
      return;
    }

    setCompletedItems(ownerUid.startsWith('demo_user_')
      ? ['footbath_maintenance', 'visitor_logging', 'dedicated_footwear']
      : []);
    setInspectorName(ownerName || 'খামারি নিজে');
    setNotes('');
    setIsSaved(false);
  }, [existingRecord, ownerName, ownerUid]);

  const toggleTask = (taskId: string) => {
    setIsSaved(false);
    setCompletedItems((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const totalTasks = STANDARD_BIOSECURITY_TASKS.length;
  const scorePercent = Math.round((completedItems.length / totalTasks) * 100);

  const handleSave = () => {
    setIsSaving(true);
    onSaveRecord({
      checklistId: `bio_${farmId}_${selectedDate}`,
      farmId,
      ownerUid,
      date: selectedDate,
      itemsCompleted: completedItems,
      totalItems: totalTasks,
      scorePercent,
      inspectorName,
      notes,
      createdAt: existingRecord?.createdAt || new Date().toISOString(),
    });
    setIsSaved(true);
    onBiosecurityComplete?.(scorePercent);
    setIsSaving(false);
  };

  const getTaskIcon = (taskId: string) => {
    switch (taskId) {
      case 'footbath_maintenance':
        return <Footprints className="w-4 h-4 text-emerald-700" />;
      case 'visitor_logging':
        return <BookOpen className="w-4 h-4 text-blue-700" />;
      case 'dedicated_footwear':
        return <Shirt className="w-4 h-4 text-purple-700" />;
      case 'vehicle_tire_spray':
        return <SprayCan className="w-4 h-4 text-amber-700" />;
      case 'carcass_deep_burial':
        return <Trash2 className="w-4 h-4 text-rose-700" />;
      case 'drinker_line_flush':
        return <Droplets className="w-4 h-4 text-cyan-700" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {isBn ? 'দৈনিক সুরক্ষা তালিকা' : 'Daily Biosecurity Checklist'}
              </span>
              {isSaved && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                  <Check className="w-3 h-3" />
                  <span>{isBn ? 'সংরক্ষিত' : 'Saved'}</span>
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {isBn ? 'আজকের খামার হাইজিন ও ফুটবাথ চেকলিস্ট' : 'Daily Farm Hygiene & Footbath Checklist'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isBn
                ? 'শেডে প্রবেশের আগে ফুটবাথের পানি, দর্শনার্থী তালিকা ও পরিচ্ছন্নতা দেখে নিন'
                : 'Check footbath freshness, visitor logs, and core sanitation before entering sheds'}
            </p>
          </div>
        </div>

        {/* Real-Time Score Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <div
            className={`px-3.5 py-1.5 rounded-2xl border flex items-center gap-1.5 font-black text-xs sm:text-sm ${
              scorePercent >= 80
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : scorePercent >= 50
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                scorePercent >= 80
                  ? 'text-emerald-600'
                  : scorePercent >= 50
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            />
            <span>
              {isBn ? 'দৈনিক কাজের হার: ' : 'Completion: '}
              <span className="text-base font-black tabular-nums">{toBanglaNum(scorePercent, lang)}%</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {toBanglaNum(completedItems.length, lang)} / {toBanglaNum(totalTasks, lang)}{' '}
            {isBn ? 'টি কাজ সম্পন্ন' : 'tasks checked'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              scorePercent >= 80 ? 'bg-emerald-600' : scorePercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Tasks Grid (Touch-friendly 44px+ items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STANDARD_BIOSECURITY_TASKS.map((task) => {
          const isDone = completedItems.includes(task.id);

          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none active:scale-[0.99] ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-500 text-emerald-950 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {/* Checkbox Box */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border-2 border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              {/* Task Details */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="p-1 rounded-md bg-white border border-slate-200 shrink-0">
                    {getTaskIcon(task.id)}
                  </div>
                  <h4
                    className={`font-black text-xs sm:text-sm leading-tight ${
                      isDone ? 'text-emerald-950' : 'text-slate-900'
                    }`}
                  >
                    {isBn ? task.titleBn : task.titleEn}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug">
                  {task.descriptionBn}
                </p>

                {task.priority === 'critical' && !isDone && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <AlertCircle className="w-3 h-3" />
                    <span>{isBn ? 'জরুরি জীবনিরাপত্তা ধাপ' : 'Critical Step'}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Toggle & Explanation */}
      <div className="pt-1">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1.5 underline-offset-2 hover:underline"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{isBn ? 'ফুটবাথ ও জীবাণুনাশক দ্রবণ তৈরির সঠিক নিয়ম জানুন' : 'Footbath mixing guide'}</span>
        </button>

        {showGuide && (
          <div className="mt-2 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2 animate-in fade-in">
            <h5 className="font-bold text-emerald-950">
              {isBn ? 'ফুটবাথ সতেজ রাখার নির্দেশিকা:' : 'Footbath Guidelines:'}
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
              <li>
                {isBn
                  ? 'প্রতি ১০ লিটার পানিতে ১০০ গ্রাম ব্লিচিং পাউডার অথবা অনুমোদিত পটাশিয়াম পারম্যাঙ্গানেট / ভিরকন মিশিয়ে দ্রবণ তৈরি করুন।'
                  : 'Mix 100g bleaching powder or Virkon per 10L water.'}
              </li>
              <li>
                {isBn
                  ? 'দ্রবণ ঘোলাটে বা নোংরা হয়ে গেলে প্রতি ২৪ ঘণ্টা পর পর অবশ্যই নতুন দ্রবণ দিতে হবে।'
                  : 'Refresh every 24 hours or whenever dirty.'}
              </li>
              <li>
                {isBn
                  ? 'শেডে প্রবেশের আগে বুট জুতো কমপক্ষে ১০-১৫ সেকেন্ড ফুটবাথে ভিজিয়ে রাখুন।'
                  : 'Immerse boots for at least 10-15 seconds before entry.'}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            {isBn ? 'তারিখ:' : 'Date:'}{' '}
            <strong className="text-slate-800">{toBanglaNum(selectedDate, lang)}</strong>
            {' · '}
            {isBn ? 'সম্পন্নকারী: ' : 'Recorded by: '}
            <strong className="text-slate-800">{inspectorName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              isSaved
                ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
            }`}
          >
            {isSaving ? (
              <span>{isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>{isBn ? '✓ অ্যাকাউন্টে সংরক্ষিত' : 'Saved to account'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isBn ? 'চেকলিস্ট সংরক্ষণ করুন' : 'Save Daily Checklist'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
