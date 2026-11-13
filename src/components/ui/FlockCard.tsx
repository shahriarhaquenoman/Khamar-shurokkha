import React, { useState } from 'react';
import { FlockProfile, ScheduledCareTask, CareRecord, Language } from '../../types';
import { toBanglaNum } from '../../translations';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import {
  Plus,
  Minus,
  Syringe,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';

interface FlockCardProps {
  flock: FlockProfile;
  scheduledTasks?: ScheduledCareTask[];
  careRecords?: CareRecord[];
  lang?: Language;
  onViewDetail: (flock: FlockProfile) => void;
  onRecordCare: (flockId: string, type: 'vaccination' | 'deworming') => void;
  onRecordMortality: (flockId: string, count: number) => void;
  onAskAI?: (flock: FlockProfile) => void;
}

export const FlockCard: React.FC<FlockCardProps> = ({
  flock,
  scheduledTasks = [],
  careRecords = [],
  lang = 'bn',
  onViewDetail,
  onRecordCare,
  onRecordMortality,
  onAskAI,
}) => {
  const isBn = lang === 'bn';
  const [mortalityInput, setMortalityInput] = useState<number>(1);
  const [showMortalityConfirm, setShowMortalityConfirm] = useState(false);

  // Species emoji
  const speciesEmoji: Record<string, string> = {
    chicken_broiler: '🍗',
    chicken_layer: '🥚',
    chicken_sonali: '🐓',
    duck: '🦆',
  };

  // Next upcoming vaccine task for this flock
  const pendingTasks = scheduledTasks
    .filter((t) => t.targetId === flock.id && t.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const nextTask = pendingTasks[0];

  const handleApplyMortality = () => {
    if (mortalityInput > 0) {
      onRecordMortality(flock.id, mortalityInput);
      setShowMortalityConfirm(false);
      setMortalityInput(1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: ID & Health Status */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-orange-900 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              {flock.id}
            </span>
            <StatusBadge
              variant={
                flock.poultryType === 'chicken_broiler'
                  ? 'broiler'
                  : flock.poultryType === 'chicken_layer'
                  ? 'layer'
                  : flock.poultryType === 'chicken_sonali'
                  ? 'sonali'
                  : 'duck'
              }
              size="sm"
              lang={lang}
            />
          </div>

          <StatusBadge
            variant={
              flock.healthStatus === 'normal'
                ? 'healthy'
                : flock.healthStatus === 'high_mortality'
                ? 'overdue'
                : 'needs_attention'
            }
            size="sm"
            lang={lang}
          />
        </div>

        {/* Main Identity Row */}
        <div className="flex items-center gap-3.5 my-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 flex items-center justify-center text-3xl shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
            {speciesEmoji[flock.poultryType] || '🐥'}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-black text-lg text-slate-900 truncate">
              {flock.batchName}
            </h3>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 mt-0.5">
              <span className="font-bold text-emerald-800">
                {isBn ? 'জীবিত পাখি:' : 'Live birds:'}{' '}
                <span className="text-sm font-black text-slate-900 font-mono">
                  {toBanglaNum(flock.currentBirdCount, lang)}
                </span>
              </span>
              <span>·</span>
              <span className="text-slate-700">
                {isBn ? `বয়স: ${toBanglaNum(flock.ageDays, lang)} দিন` : `Age: ${flock.ageDays}d`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Bird Counts & Mortality Box */}
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs mb-4">
          <div className="flex items-center justify-between text-slate-600">
            <span>{isBn ? 'শুরুর সংখ্যা / স্থানান্তর:' : 'Initial Placement:'}</span>
            <span className="font-bold text-slate-800 font-mono">
              {toBanglaNum(flock.initialBirdCount, lang)} {isBn ? 'টি' : 'birds'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/60">
            <span className="flex items-center gap-1.5 text-rose-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'মোট মৃত্যু (মর্টালিটি):' : 'Total Mortality:'}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-black text-rose-700 font-mono">
                {toBanglaNum(flock.mortalityCount, lang)}
              </span>

              {/* Quick mortality log toggle button */}
              <button
                onClick={() => setShowMortalityConfirm(!showMortalityConfirm)}
                className="px-2 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[11px] transition-colors"
                title={isBn ? 'আজকের মৃত্যু রেকর্ড করুন' : 'Log Mortality'}
              >
                {showMortalityConfirm ? 'বাতিল' : isBn ? '+ মৃত্যু লগ' : '+ Log'}
              </button>
            </div>
          </div>

          {/* Inline Quick Mortality Input */}
          {showMortalityConfirm && (
            <div className="pt-2 border-t border-rose-200 flex items-center justify-between gap-2 bg-rose-50/70 p-2 rounded-xl animate-in fade-in duration-150">
              <span className="text-xs font-bold text-rose-900">
                {isBn ? 'আজকের মৃত পাখি:' : 'Deaths today:'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMortalityInput(Math.max(1, mortalityInput - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-rose-200 flex items-center justify-center text-slate-700 hover:bg-rose-100 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-black font-mono text-sm text-slate-900">
                  {toBanglaNum(mortalityInput, lang)}
                </span>
                <button
                  onClick={() => setMortalityInput(mortalityInput + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-rose-200 flex items-center justify-center text-slate-700 hover:bg-rose-100 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleApplyMortality}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  {isBn ? 'নিশ্চিত' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Next Scheduled Care Task */}
          {nextTask && (
            <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                <span className="truncate max-w-[150px]">{nextTask.titleBn}</span>
              </span>
              <span className="font-bold text-orange-800 font-mono">
                {toBanglaNum(nextTask.dueDate, lang)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRecordCare(flock.id, 'vaccination')}
            leftIcon={<Syringe className="w-3.5 h-3.5 text-orange-600" />}
            className="text-xs"
            title={isBn ? 'ঝাঁকের ভ্যাকসিন রেকর্ড' : 'Flock Vaccine'}
          >
            {isBn ? 'টিকা লগ' : 'Log Care'}
          </Button>

          {onAskAI && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI(flock)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              className="text-xs px-2.5 text-indigo-700 hover:bg-indigo-50"
              title={isBn ? 'ঝাঁকের সমস্যা নিয়ে এআই পরামর্শ' : 'Ask AI'}
            >
              <span className="hidden sm:inline">{isBn ? 'এআই' : 'AI'}</span>
            </Button>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewDetail(flock)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
          className="text-xs font-bold"
        >
          {isBn ? 'বিস্তারিত' : 'View'}
        </Button>
      </div>
    </div>
  );
};
