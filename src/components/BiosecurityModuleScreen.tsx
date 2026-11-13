import React, { useState, useMemo } from 'react';
import {
  FarmProfile,
  Language,
  AuditResponse,
  AuditItemAnswer,
  ActionPlanItem,
  JudgeXRayExplanation,
  ActionStatus,
  NavScreen,
} from '../types';
import { AuditScreen } from './AuditScreen';
import { ActionPlannerScreen } from './ActionPlannerScreen';
import { JudgeXRayScreen } from './JudgeXRayScreen';
import { DailyBiosecurityChecklistCard } from './DailyBiosecurityChecklistCard';
import { ActionUpdatePayload } from './BioShieldTaskDetailModal';
import { getFarmAnimalGroups } from '../data/biosecurityQuestions';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  ShieldCheck,
  ClipboardCheck,
  ListTodo,
  Cpu,
  CheckSquare,
  BookOpen,
} from 'lucide-react';

interface BiosecurityModuleScreenProps {
  farm: FarmProfile;
  ownerUid?: string;
  records: Record<string, import('../services/biosecurityService').BiosecurityChecklistRecord>;
  onSaveChecklist: (record: import('../services/biosecurityService').BiosecurityChecklistRecord) => void;
  lang: Language;
  answers: Record<string, AuditItemAnswer>;
  onAnswer: (domainId: string, response: AuditResponse) => void;
  onCompleteAudit: () => void;
  actions: ActionPlanItem[];
  xRayExplanations: JudgeXRayExplanation[];
  onUpdateActionStatus: (
    actionId: string,
    newStatus: ActionStatus,
    data?: ActionUpdatePayload
  ) => void;
  onApplySimulatedPlan: (newActions: ActionPlanItem[], newExpls: JudgeXRayExplanation[]) => void;
  onNavigate?: (screen: NavScreen, topicKey?: string) => void;
}

export const BiosecurityModuleScreen: React.FC<BiosecurityModuleScreenProps> = ({
  farm,
  ownerUid = 'demo_user',
  records,
  onSaveChecklist,
  lang,
  answers,
  onAnswer,
  onCompleteAudit,
  actions,
  xRayExplanations,
  onUpdateActionStatus,
  onApplySimulatedPlan,
  onNavigate,
}) => {
  const isBn = lang === 'bn';
  const [activeSubTab, setActiveSubTab] = useState<'actions' | 'checklist' | 'audit' | 'xray'>('actions');

  const { hasPoultry, hasRuminant } = useMemo(() => getFarmAnimalGroups(farm), [farm]);

  const farmActions = useMemo(() => {
    const poultryOnlyDomains = ['bio_07_wild_birds_pests', 'bio_09_other_animals_separation'];
    return actions.filter((act) => {
      if (act.farmId && act.farmId !== farm.id) return false;
      if (hasRuminant && !hasPoultry && poultryOnlyDomains.includes(act.domainId)) {
        return false;
      }
      return true;
    });
  }, [actions, farm.id, hasPoultry, hasRuminant]);

  const biosecurityFarmAdapter: FarmProfile = {
    ...farm,
    farmName: farm.name,
    budgetCategory: farm.budgetCategory || 'low',
    flockSize: farm.approximateHeadCount,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block w-24 h-20 rounded-2xl overflow-hidden border border-emerald-200 shrink-0 bg-emerald-50">
              <ResilientImage
                src={hasPoultry && !hasRuminant ? FARM_VISUAL_ASSETS.poultryBiosecurity : FARM_VISUAL_ASSETS.cattleGoat}
                alt={isBn ? 'খামারের বায়োসিকিউরিটি সুরক্ষা' : 'Farm biosecurity protection'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[#166534] text-xs font-extrabold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#166534]" />
                <span>{isBn ? 'BioShield খামার সুরক্ষা কার্যক্রম' : 'BioShield Farm Protection'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isBn ? 'খামারের সুরক্ষা কাজ, চেকলিস্ট ও পরীক্ষা' : 'Farm Biosecurity Tasks, Checklist & Check'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isBn
                  ? 'খুঁজে দেখি → আগে কোনটি? → কাজ ঠিক করি → কাজ করি ও জানাই'
                  : 'Identify → Prioritize → Assign → Act & Feedback'}
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('knowledge_library')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-extrabold inline-flex items-center gap-2 self-start cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-700" />
              <span>{isBn ? 'সচিত্র নির্দেশিকা ও জ্ঞানভান্ডার' : 'Open Knowledge Library'}</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('actions')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'actions'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>{isBn ? 'করণীয় কাজের তালিকা' : 'Action Plan'}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/15 text-[11px] font-mono tabular-nums">
              {farmActions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'checklist'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{isBn ? 'দৈনিক হাইজিন চেকলিস্ট' : 'Daily Hygiene Checklist'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>{isBn ? 'খামার সুরক্ষা পরীক্ষা' : '10-Point Check'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('xray')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'xray'
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{isBn ? 'যুক্তি ব্যাখ্যা' : 'Logic X-Ray'}</span>
          </button>
        </div>
      </div>

      {/* View Rendering */}
      {activeSubTab === 'actions' && (
        <ActionPlannerScreen
          actions={farmActions}
          farm={biosecurityFarmAdapter}
          lang={lang}
          onUpdateActionStatus={onUpdateActionStatus}
          onNavigate={onNavigate || (() => setActiveSubTab('actions'))}
          onExplainAction={() => setActiveSubTab('xray')}
        />
      )}

      {activeSubTab === 'checklist' && (
        <DailyBiosecurityChecklistCard
          farmId={farm.id}
          farmName={farm.name}
          ownerUid={ownerUid}
          ownerName={farm.ownerName}
          lang={lang}
          records={records}
          onSaveRecord={onSaveChecklist}
        />
      )}

      {activeSubTab === 'audit' && (
        <AuditScreen
          farm={farm}
          answers={answers}
          onAnswer={onAnswer}
          onCompleteAudit={() => {
            onCompleteAudit();
            setActiveSubTab('actions');
          }}
          lang={lang}
        />
      )}

      {activeSubTab === 'xray' && (
        <JudgeXRayScreen
          lang={lang}
          farm={biosecurityFarmAdapter as any}
          activeActions={farmActions}
          xRayExplanations={xRayExplanations}
          onApplySimulatedPlan={onApplySimulatedPlan}
        />
      )}
    </div>
  );
};
