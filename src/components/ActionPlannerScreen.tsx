import React, { useState } from 'react';
import { ActionPlanItem, ActionStatus, Language, NavScreen, FarmProfile } from '../types';
import { t, toBanglaNum } from '../translations';
import { ActionDetailModal } from './ActionDetailModal';
import { ActionUpdatePayload } from './BioShieldTaskDetailModal';
import { StatusBadge } from './ui/StatusBadge';
import {
  ListTodo,
  CheckCircle2,
  Sparkles,
  User,
  HelpCircle,
  PauseCircle,
  MinusCircle,
} from 'lucide-react';

interface ActionPlannerScreenProps {
  actions: ActionPlanItem[];
  farm: FarmProfile;
  lang: Language;
  onUpdateActionStatus: (
    actionId: string,
    newStatus: ActionStatus,
    data?: ActionUpdatePayload
  ) => void;
  onNavigate: (screen: NavScreen, topicKey?: string) => void;
  onExplainAction: (actionId: string) => void;
}

export const ActionPlannerScreen: React.FC<ActionPlannerScreenProps> = ({
  actions,
  farm,
  lang,
  onUpdateActionStatus,
  onNavigate,
  onExplainAction,
}) => {
  const isBn = lang === 'bn';
  const [selectedAction, setSelectedAction] = useState<ActionPlanItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'pending' | 'in_progress' | 'help_needed' | 'completed' | 'unable_to_complete' | 'not_applicable'
  >('all');

  const filteredActions = actions.filter((act) => {
    if (activeFilter === 'all') return true;
    return act.status === activeFilter;
  });

  const pendingCount = actions.filter((a) => a.status === 'pending' || a.status === 'overdue').length;
  const inProgressCount = actions.filter((a) => a.status === 'in_progress').length;
  const helpNeededCount = actions.filter((a) => a.status === 'help_needed').length;
  const completedCount = actions.filter((a) => a.status === 'completed').length;
  const unableCount = actions.filter((a) => a.status === 'unable_to_complete').length;
  const notApplicableCount = actions.filter((a) => a.status === 'not_applicable').length;

  const eligibleTotal = actions.filter((a) => a.status !== 'not_applicable').length;
  const completionRate = eligibleTotal > 0 ? Math.round((completedCount / eligibleTotal) * 100) : 0;

  const getStatusBadgeProps = (status: ActionStatus): {
    variant: 'completed' | 'in_progress' | 'help_needed' | 'not_applicable' | 'overdue' | 'upcoming';
    label: string;
  } => {
    switch (status) {
      case 'completed':
        return { variant: 'completed', label: isBn ? 'সম্পন্ন করেছি' : 'Completed' };
      case 'in_progress':
        return { variant: 'in_progress', label: isBn ? 'কাজ চলছে' : 'In Progress' };
      case 'help_needed':
        return { variant: 'help_needed', label: isBn ? 'সহায়তা প্রয়োজন' : 'Help Needed' };
      case 'not_applicable':
        return { variant: 'not_applicable', label: isBn ? 'খামারে প্রযোজ্য নয়' : 'Not Applicable' };
      case 'unable_to_complete':
        return { variant: 'upcoming', label: isBn ? 'এখন পারছি না' : 'Deferred' };
      case 'overdue':
        return { variant: 'overdue', label: isBn ? 'সময়োত্তীর্ণ' : 'Overdue' };
      default:
        return { variant: 'upcoming', label: isBn ? 'শুরু হয়নি' : 'Pending' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900">
                  {isBn ? 'খামারের করণীয় কাজের তালিকা' : 'Farm Action Plan & Follow-Up'}
                </h1>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? `প্রযোজ্য কাজের সম্পন্ন হার: ${toBanglaNum(completionRate, lang)}% (${toBanglaNum(completedCount, lang)}/${toBanglaNum(eligibleTotal, lang)})`
                    : `Eligible activity completion: ${completionRate}% (${completedCount}/${eligibleTotal})`}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onExplainAction('all')}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{isBn ? 'বাছাইয়ের কারণ দেখুন' : 'View Prioritization Logic'}</span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1 border-t border-slate-100 mt-3.5">
          {[
            { id: 'all' as const, labelBn: 'সব', labelEn: 'All', count: actions.length },
            { id: 'pending' as const, labelBn: 'বাকি', labelEn: 'Pending', count: pendingCount },
            { id: 'in_progress' as const, labelBn: 'চলমান', labelEn: 'Active', count: inProgressCount },
            { id: 'help_needed' as const, labelBn: 'সহায়তা প্রয়োজন', labelEn: 'Need Help', count: helpNeededCount },
            { id: 'completed' as const, labelBn: 'সম্পন্ন', labelEn: 'Done', count: completedCount },
            { id: 'unable_to_complete' as const, labelBn: 'এখন সম্ভব নয়', labelEn: 'Deferred', count: unableCount },
            { id: 'not_applicable' as const, labelBn: 'প্রযোজ্য নয়', labelEn: 'N/A', count: notApplicableCount },
          ].map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#166534] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isBn ? tab.labelBn : tab.labelEn} ({toBanglaNum(tab.count, lang)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-3.5">
        {filteredActions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">
              {isBn ? 'এই তালিকায় কোনো কাজ নেই' : 'No Actions in This Filter'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBn
                ? 'খামারের ১০টি পয়েন্ট পরীক্ষা করে নতুন করণীয় তালিকা তৈরি করতে পারেন।'
                : 'Complete the 10-point farm check to generate tailored tasks.'}
            </p>
          </div>
        ) : (
          filteredActions.map((action, idx) => {
            const badge = getStatusBadgeProps(action.status);
            return (
              <div
                key={action.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <span className="font-mono text-slate-500">
                      #{toBanglaNum(idx + 1, lang)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        action.riskCategory === 'critical'
                          ? 'text-[#DC2626] font-extrabold'
                          : action.riskCategory === 'high'
                          ? 'text-[#DB2777] font-extrabold'
                          : 'text-[#166534] font-bold'
                      }
                    >
                      {action.riskCategory === 'critical'
                        ? (isBn ? 'জরুরি ঝুঁকি' : 'Urgent')
                        : action.riskCategory === 'high'
                        ? (isBn ? 'উচ্চ অগ্রাধিকার' : 'High Priority')
                        : (isBn ? 'নিয়মিত যত্ন' : 'Routine')}
                    </span>
                  </div>

                  <StatusBadge variant={badge.variant} label={badge.label} size="sm" lang={lang} />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {isBn ? action.titleBn : action.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    <strong className="text-slate-800">{isBn ? 'কেন জরুরি: ' : 'Why needed: '}</strong>
                    {isBn ? action.whyRecommendedBn : action.whyRecommendedEn}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold">
                  <span>
                    {isBn ? 'সময়সীমা:' : 'Target:'}{' '}
                    <span className="font-mono font-bold text-slate-800">
                      {toBanglaNum(action.deadlineDate, lang)}
                    </span>
                  </span>
                  {action.assignedTo && (
                    <span className="inline-flex items-center gap-1 text-emerald-800">
                      <User className="w-3.5 h-3.5" />
                      <span>{action.assignedTo}</span>
                    </span>
                  )}
                </div>

                {action.status === 'help_needed' && action.helpReason && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{action.helpReason}</span>
                  </div>
                )}

                {action.status === 'unable_to_complete' && action.unableReason && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                    <PauseCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{action.unableReason}</span>
                  </div>
                )}

                {action.status === 'not_applicable' && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <MinusCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{isBn ? 'খামারের ধরন অনুযায়ী প্রযোজ্য নয় চিহ্নিত' : 'Marked not applicable to this farm'}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onExplainAction(action.id)}
                    className="min-h-[44px] px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t(lang, 'explainLogicBtn')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAction(action)}
                    className="min-h-[46px] px-5 py-2.5 text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer"
                  >
                    {action.status === 'completed'
                      ? (isBn ? 'বিস্তারিত ও নোট দেখুন' : 'View Summary')
                      : (isBn ? 'কাজ করি ও জানাই' : 'Open Guide & Feedback')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ActionDetailModal
        action={selectedAction}
        isOpen={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        onUpdateStatus={onUpdateActionStatus}
        lang={lang}
        onNavigate={onNavigate}
      />
    </div>
  );
};
