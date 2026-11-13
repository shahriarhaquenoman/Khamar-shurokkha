import React from 'react';
import { AnimalProfile, CareRecord, ScheduledCareTask, Language } from '../../types';
import { toBanglaNum } from '../../translations';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import {
  Sparkles,
  Syringe,
  Pill,
  ChevronRight,
  HeartPulse,
  Calendar,
  Tag,
  Stethoscope,
} from 'lucide-react';

interface AnimalProfileCardProps {
  animal: AnimalProfile;
  careRecords?: CareRecord[];
  scheduledTasks?: ScheduledCareTask[];
  lang?: Language;
  onViewDetail: (animal: AnimalProfile) => void;
  onRecordCare: (animalId: string, type: 'vaccination' | 'deworming') => void;
  onAskAI?: (animal: AnimalProfile) => void;
  onRequestVet?: (animal: AnimalProfile) => void;
}

export const AnimalProfileCard: React.FC<AnimalProfileCardProps> = ({
  animal,
  careRecords = [],
  scheduledTasks = [],
  lang = 'bn',
  onViewDetail,
  onRecordCare,
  onAskAI,
  onRequestVet,
}) => {
  const isBn = lang === 'bn';

  // Find species emoji
  const speciesEmoji: Record<string, string> = {
    cattle: '🐄',
    buffalo: '🐃',
    goat: '🐐',
    sheep: '🐑',
  };

  // Recent care for this animal
  const animalRecords = careRecords
    .filter((r) => r.targetId === animal.id)
    .sort((a, b) => b.dateAdministered.localeCompare(a.dateAdministered));
  const lastCare = animalRecords[0];

  // Pending care for this animal
  const pendingTasks = scheduledTasks
    .filter((t) => t.targetId === animal.id && t.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const nextTask = pendingTasks[0];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: ID & Health Status */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {animal.id}
            </span>
            <StatusBadge variant={animal.species as any} size="sm" lang={lang} />
          </div>

          <StatusBadge variant={animal.healthStatus} size="sm" lang={lang} />
        </div>

        {/* Animal Main Identity */}
        <div className="flex items-center gap-3.5 my-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
            {speciesEmoji[animal.species] || '🐾'}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-black text-lg text-slate-900 truncate">
              {animal.nameOrTag}
            </h3>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 mt-0.5">
              <span>{animal.breed}</span>
              <span>·</span>
              <span>{animal.sex === 'female' ? (isBn ? 'স্ত্রী (মাদী)' : 'Female') : (isBn ? 'পুরুষ (নর)' : 'Male')}</span>
              <span>·</span>
              <span className="font-medium text-slate-700">
                {isBn ? `${toBanglaNum(animal.estimatedAgeMonths, lang)} মাস` : `${animal.estimatedAgeMonths} mos`}
              </span>
            </div>
          </div>
        </div>

        {/* Health Activity Summary Box */}
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-1.5 text-xs mb-4">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Syringe className="w-3.5 h-3.5 text-orange-600" />
              <span>{isBn ? 'সর্বশেষ টিকা/চিকিৎসা:' : 'Last Administered:'}</span>
            </span>
            <span className="font-bold text-slate-800">
              {lastCare
                ? `${toBanglaNum(lastCare.dateAdministered, lang)}`
                : isBn
                ? 'এখনও রেকর্ড নেই'
                : 'No record yet'}
            </span>
          </div>

          {nextTask && (
            <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'পরবর্তী শিডিউল:' : 'Next Due:'}</span>
              </span>
              <span className="font-bold text-orange-700 font-mono">
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
            onClick={() => onRecordCare(animal.id, 'vaccination')}
            leftIcon={<Syringe className="w-3.5 h-3.5 text-orange-600" />}
            className="text-xs"
            title={isBn ? 'টিকা বা কৃমিনাশক দিন' : 'Administer Care'}
          >
            {isBn ? 'যত্ন লগ' : 'Log Care'}
          </Button>

          {onAskAI && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI(animal)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              className="text-xs px-2.5 text-indigo-700 hover:bg-indigo-50"
              title={isBn ? 'এআই স্বাস্থ্য পরামর্শ' : 'Ask AI'}
            >
              <span className="hidden sm:inline">{isBn ? 'এআই' : 'AI'}</span>
            </Button>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewDetail(animal)}
          rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
          className="text-xs font-bold"
        >
          {isBn ? 'প্রোফাইল' : 'View'}
        </Button>
      </div>
    </div>
  );
};
