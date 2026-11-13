import React, { useState, useEffect } from 'react';
import {
  ActionPlanItem,
  ActionStatus,
  ScheduledCareTask,
  Language,
  FarmProfile,
  NavScreen,
} from '../types';
import { toBanglaNum } from '../translations';
import { AUTHORIZED_PROTOCOLS } from '../data/protocolData';
import { BIOSECURITY_DOMAINS } from '../data/biosecurityQuestions';
import { StatusBadge } from './ui/StatusBadge';
import {
  TopicIllustration,
  VaccinationIllustration,
  DewormingIllustration,
} from './BiosecurityIllustrations';
import {
  X,
  CheckCircle2,
  User,
  BookOpen,
  ThermometerSnowflake,
  Syringe,
  HelpCircle,
  PauseCircle,
  MinusCircle,
  MessageCircle,
  Stethoscope,
  Check,
  Package,
} from 'lucide-react';
import { getKhamarPhoneShortLabel } from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';

export type TaskDetailModalTarget =
  | {
      type: 'biosecurity_action';
      action: ActionPlanItem;
    }
  | {
      type: 'care_task';
      task: ScheduledCareTask;
    };

export interface ActionUpdatePayload {
  notes?: string;
  unableReason?: string;
  helpReason?: string;
  assignedTo?: string;
  assignedCategory?: 'self' | 'family' | 'worker';
  completedSteps?: number[];
}

interface BioShieldTaskDetailModalProps {
  target: TaskDetailModalTarget | null;
  isOpen: boolean;
  onClose: () => void;
  farm: FarmProfile;
  lang: Language;
  onUpdateActionStatus?: (
    actionId: string,
    newStatus: ActionStatus,
    data?: ActionUpdatePayload
  ) => void;
  onOpenCareRecord?: (targetId: string, type: 'vaccination' | 'deworming') => void;
  onNavigate?: (screen: NavScreen, topicKey?: string) => void;
}

const ASSIGNEE_PRESETS: {
  id: 'self' | 'family' | 'worker';
  labelBn: string;
  labelEn: string;
}[] = [
  { id: 'self', labelBn: 'আমি নিজে করব', labelEn: 'I will do it' },
  { id: 'family', labelBn: 'পরিবারের সদস্য করবেন', labelEn: 'Family member' },
  { id: 'worker', labelBn: 'খামারকর্মী করবেন', labelEn: 'Farm worker' },
];

const UNABLE_REASONS_BN = [
  'উপকরণ বা জীবাণুনাশক হাতের কাছে নেই',
  'আজ সময় বা লোকবল কম',
  'খরচের কারণে এখন সম্ভব নয়',
  'আবহাওয়া অনুকূল নয়',
];

const UNABLE_REASONS_EN = [
  'Required materials not available today',
  'Short on time or helpers today',
  'Budget constraint right now',
  'Unfavorable weather conditions',
];

export const BioShieldTaskDetailModal: React.FC<BioShieldTaskDetailModalProps> = ({
  target,
  isOpen,
  onClose,
  farm,
  lang,
  onUpdateActionStatus,
  onOpenCareRecord,
  onNavigate,
}) => {
  const isBn = lang === 'bn';
  const isBiosecurity = target?.type === 'biosecurity_action';
  const action = isBiosecurity && target?.type === 'biosecurity_action' ? target.action : null;
  const careTask = !isBiosecurity && target?.type === 'care_task' ? target.task : null;

  const [notes, setNotes] = useState('');
  const [unableReason, setUnableReason] = useState('');
  const [helpReason, setHelpReason] = useState('');
  const [assignedCategory, setAssignedCategory] = useState<'self' | 'family' | 'worker'>('self');
  const [assignedTo, setAssignedTo] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [feedbackPanel, setFeedbackPanel] = useState<'none' | 'help' | 'unable' | 'not_applicable'>('none');

  useEffect(() => {
    if (action) {
      setNotes(action.notes || '');
      setUnableReason(action.unableReason || '');
      setHelpReason(action.helpReason || '');
      setAssignedCategory(action.assignedCategory || 'self');
      setAssignedTo(action.assignedTo || farm.ownerName || (isBn ? 'আমি নিজে করব' : 'Self'));
      setCompletedSteps(action.completedSteps || []);
      setFeedbackPanel(
        action.status === 'help_needed'
          ? 'help'
          : action.status === 'unable_to_complete'
          ? 'unable'
          : 'none'
      );
    } else {
      setFeedbackPanel('none');
    }
  }, [action, careTask, farm.ownerName, isBn]);

  if (!isOpen || !target) return null;

  const matchedProtocol = careTask
    ? AUTHORIZED_PROTOCOLS.find((p) => p.id === careTask.protocolId)
    : null;

  const matchedDomain = action
    ? BIOSECURITY_DOMAINS.find((d) => d.id === action.domainId)
    : null;

  const topicOrder = matchedDomain?.order || 3;
  const knowledgeTopic =
    action?.knowledgeTopicId ||
    matchedDomain?.knowledgeTopicId ||
    (careTask ? 'topic_vaccine_deworming' : 'topic_daily_hygiene');

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleAssignPreset = (presetId: 'self' | 'family' | 'worker', label: string) => {
    setAssignedCategory(presetId);
    const val = presetId === 'self' ? `${farm.ownerName ? `${farm.ownerName} (` : ''}${label}${farm.ownerName ? ')' : ''}` : label;
    setAssignedTo(val);
    if (action && onUpdateActionStatus) {
      onUpdateActionStatus(action.id, action.status, {
        assignedCategory: presetId,
        assignedTo: val,
        completedSteps,
        notes,
      });
    }
  };

  const handleCompleteBiosecurity = () => {
    if (action && onUpdateActionStatus) {
      onUpdateActionStatus(action.id, 'completed', {
        notes,
        assignedTo,
        assignedCategory,
        completedSteps,
      });
      onClose();
    }
  };

  const handleSaveHelpNeeded = (routeTarget?: 'ai_assistant' | 'vet_services') => {
    if (action && onUpdateActionStatus) {
      onUpdateActionStatus(action.id, 'help_needed', {
        helpReason: helpReason.trim() || (isBn ? 'কাজটি কীভাবে করব বুঝতে বা সহায়তা দরকার' : 'Need guidance on this task'),
        notes,
        assignedTo,
        assignedCategory,
        completedSteps,
      });
    }
    if (routeTarget && onNavigate) {
      onClose();
      onNavigate(routeTarget);
    } else if (!routeTarget) {
      onClose();
    }
  };

  const handleUnableSubmit = () => {
    if (action && onUpdateActionStatus) {
      onUpdateActionStatus(action.id, 'unable_to_complete', {
        unableReason: unableReason.trim() || (isBn ? 'এই মুহূর্তে সম্ভব নয়' : 'Deferred for now'),
        notes,
        assignedTo,
        assignedCategory,
        completedSteps,
      });
      onClose();
    }
  };

  const handleNotApplicable = () => {
    if (action && onUpdateActionStatus) {
      onUpdateActionStatus(action.id, 'not_applicable', {
        notes: notes.trim() || (isBn ? 'আমার খামারের জন্য প্রযোজ্য নয়' : 'Marked not applicable to farm'),
        assignedTo,
        assignedCategory,
      });
      onClose();
    }
  };

  const handleOpenKnowledge = () => {
    if (onNavigate) {
      onClose();
      onNavigate('knowledge_library', knowledgeTopic);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-900/20 bg-emerald-950 text-white flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {isBiosecurity ? (
                <StatusBadge
                  variant={
                    action?.status === 'completed'
                      ? 'completed'
                      : action?.status === 'help_needed'
                      ? 'help_needed'
                      : action?.status === 'not_applicable'
                      ? 'not_applicable'
                      : action?.riskCategory === 'critical'
                      ? 'overdue'
                      : 'due_soon'
                  }
                  label={
                    action?.status === 'completed'
                      ? isBn ? 'সম্পন্ন হয়েছে' : 'Completed'
                      : action?.status === 'help_needed'
                      ? isBn ? 'সহায়তা প্রয়োজন' : 'Help Needed'
                      : action?.status === 'not_applicable'
                      ? isBn ? 'প্রযোজ্য নয়' : 'Not Applicable'
                      : action?.riskCategory === 'critical'
                      ? isBn ? 'আজই জরুরি' : 'Urgent Today'
                      : isBn ? 'গুরুত্বপূর্ণ করণীয়' : 'Recommended Care'
                  }
                  size="sm"
                  lang={lang}
                />
              ) : (
                <StatusBadge
                  variant={careTask?.careType === 'vaccination' ? 'vaccination' : 'deworming'}
                  size="sm"
                  lang={lang}
                />
              )}
              <span className="text-[11px] font-mono text-emerald-200">
                {toBanglaNum(isBiosecurity ? action?.deadlineDate || '' : careTask?.dueDate || '', lang)}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
              {isBiosecurity ? (isBn ? action?.titleBn : action?.titleEn) : (isBn ? careTask?.titleBn : careTask?.titleEn)}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
            className="min-w-[44px] min-h-[44px] rounded-full text-emerald-200 hover:text-white hover:bg-white/10 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          {/* Illustration */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            {isBiosecurity ? (
              <TopicIllustration topicOrder={topicOrder} className="w-full h-36" />
            ) : careTask?.careType === 'deworming' ? (
              <DewormingIllustration className="w-full h-36" />
            ) : (
              <VaccinationIllustration className="w-full h-36" />
            )}
          </div>

          {/* A. কী করব (What To Do) */}
          <section className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="text-xs font-black text-slate-900">
              {isBn ? 'ক. কী করতে হবে?' : 'A. What To Do'}
            </h4>
            <p className="text-sm font-bold text-slate-800 leading-snug">
              {isBiosecurity
                ? action?.targetDescriptionBn || farm.name
                : `${careTask?.targetName} — ${isBn ? careTask?.titleBn : careTask?.titleEn}`}
            </p>
            <p className="text-xs text-slate-600 font-medium">
              {isBn ? 'নির্ধারিত সময়:' : 'Target date:'}{' '}
              <span className="font-mono font-bold text-slate-800">
                {toBanglaNum(isBiosecurity ? action?.deadlineDate || '' : careTask?.dueDate || '', lang)}
              </span>
            </p>
          </section>

          {/* B. কেন করব (Why Important) */}
          <section className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5">
            <h4 className="text-xs font-black text-amber-950">
              {isBn ? 'খ. কেন এটি খামারের জন্য জরুরি?' : 'B. Why Is This Needed?'}
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
              {isBiosecurity
                ? (isBn ? action?.whyRecommendedBn : action?.whyRecommendedEn)
                : (isBn ? careTask?.descriptionBn : careTask?.descriptionEn)}
            </p>
            {matchedProtocol && (
              <p className="text-xs text-amber-900 font-bold pt-1">
                {isBn ? 'সুরক্ষার লক্ষ্য:' : 'Target disease:'}{' '}
                {isBn ? matchedProtocol.diseaseOrTargetBn : matchedProtocol.diseaseOrTargetEn}
              </p>
            )}
          </section>

          {/* C. কীভাবে করব (How To Do) */}
          <section className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black text-emerald-950">
                {isBn ? 'গ. কীভাবে করবেন? (সহজ ধাপ)' : 'C. How To Do It (Simple Steps)'}
              </h4>
              {onNavigate && (
                <button
                  type="button"
                  onClick={handleOpenKnowledge}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আরও জানুন' : 'Learn More'}</span>
                </button>
              )}
            </div>

            {isBiosecurity && action?.requiredMaterialsBn && (
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-slate-700">
                <Package className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">
                    {isBn ? 'কী কী লাগবে: ' : 'Materials: '}
                  </span>
                  <span>{isBn ? action.requiredMaterialsBn : action.requiredMaterialsEn}</span>
                </div>
              </div>
            )}

            {isBiosecurity && action ? (
              <div className="space-y-2">
                {(isBn ? action.stepsBn : action.stepsEn).map((step, idx) => {
                  const checked = completedSteps.includes(idx);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                        checked
                          ? 'bg-emerald-100/80 border-emerald-300'
                          : 'bg-white border-emerald-100 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          checked ? 'bg-emerald-700 text-white' : 'bg-emerald-800 text-white'
                        }`}
                      >
                        {checked ? <Check className="w-3.5 h-3.5" /> : toBanglaNum(idx + 1, lang)}
                      </span>
                      <span className={`text-xs sm:text-sm leading-snug ${checked ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}`}>
                        {step}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : matchedProtocol ? (
              <div className="space-y-2 text-xs text-slate-800">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-100">
                  <span className="font-bold text-emerald-900 block">
                    {isBn ? '১. প্রয়োগের নিয়ম:' : '1. Dosage & Rule:'}
                  </span>
                  <p className="mt-0.5">{matchedProtocol.firstDoseRule}</p>
                </div>
                {matchedProtocol.boosterRule && (
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100">
                    <span className="font-bold text-emerald-900 block">
                      {isBn ? '২. পরবর্তী বুস্টার:' : '2. Booster:'}
                    </span>
                    <p className="mt-0.5">{matchedProtocol.boosterRule}</p>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-white border border-emerald-100 flex items-center gap-2 text-blue-900 font-bold">
                  <ThermometerSnowflake className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{isBn ? 'টিকা ২°C–৮°C ঠান্ডা বক্সে রাখুন।' : 'Keep vaccine in 2°C–8°C cold box.'}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                {isBn
                  ? 'স্থানীয় প্রাণিসম্পদ কর্মী বা পশুচিকিৎসকের নির্দেশনা অনুযায়ী কাজটি সম্পন্ন করুন।'
                  : 'Follow standard local veterinary care guidelines.'}
              </p>
            )}
          </section>

          {/* D. কে করবেন (Assign - Optional) */}
          {isBiosecurity && action && (
            <section className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>{isBn ? 'ঘ. কে কাজটি করবেন? (ঐচ্ছিক)' : 'D. Who Will Do This? (Optional)'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ASSIGNEE_PRESETS.map((preset) => {
                  const active = assignedCategory === preset.id;
                  const label = isBn ? preset.labelBn : preset.labelEn;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handleAssignPreset(preset.id, label)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* E. কাজ করি ও জানাই (Act & Feedback) */}
          {isBiosecurity && action && (
            <section className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-900">
                {isBn ? 'ঙ. কাজ করি ও জানাই — বর্তমান অবস্থা কী?' : 'E. Act & Feedback — How Did It Go?'}
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ছোট নোট (ঐচ্ছিক):' : 'Short note (optional):'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isBn ? 'যেমন: সকালে ফুটবাথ পরিষ্কার করে নতুন পানি দিয়েছি।' : 'e.g. Refreshed footbath solution this morning.'}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50"
                />
              </div>

              {/* Help Needed Support Router */}
              {feedbackPanel === 'help' && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-amber-950">
                        {isBn ? 'কী ধরনের সহায়তা প্রয়োজন?' : 'What kind of help do you need?'}
                      </p>
                      <p className="text-[11px] text-amber-900 mt-0.5">
                        {isBn
                          ? 'এখান থেকেই খামার বন্ধু, পশুচিকিৎসক বা খামার সুরক্ষা সহায়তা কেন্দ্রে যোগাযোগ করতে পারবেন।'
                          : 'Connect directly to Khamar Bondhu guide, Vet consultation, or Khamar Shurokkha support.'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={helpReason}
                    onChange={(e) => setHelpReason(e.target.value)}
                    placeholder={isBn ? 'কী বুঝতে বা করতে সমস্যা হচ্ছে লিখুন (ঐচ্ছিক)...' : 'Briefly mention what help you need...'}
                    className="w-full p-2.5 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveHelpNeeded('ai_assistant')}
                      className="min-h-[44px] px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>{isBn ? 'খামার বন্ধুকে জিজ্ঞাসা করুন' : 'Ask Khamar Bondhu'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveHelpNeeded('vet_services')}
                      className="min-h-[44px] px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Stethoscope className="w-4 h-4 shrink-0" />
                      <span>{isBn ? 'পশুচিকিৎসকের পরামর্শ নিন' : 'Consult Veterinarian'}</span>
                    </button>
                    <KhamarContactCallAction
                      lang={lang}
                      labelBn={`খামার সুরক্ষা কল: ${getKhamarPhoneShortLabel(lang)}`}
                      labelEn={`Call Khamar Shurokkha: ${getKhamarPhoneShortLabel(lang)}`}
                      onBeforeAction={() => {
                        if (action && onUpdateActionStatus) {
                          onUpdateActionStatus(action.id, 'help_needed', {
                            helpReason: helpReason.trim() || (isBn ? 'কাজটি করতে সহায়তা প্রয়োজন' : 'Need guidance on this task'),
                            notes,
                            assignedTo,
                            assignedCategory,
                            completedSteps,
                          });
                        }
                      }}
                      className="min-h-[44px] w-full px-3 py-2 bg-[#166534] hover:bg-emerald-900 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveHelpNeeded()}
                      className="min-h-[44px] px-3 py-2 bg-white border border-amber-400 text-amber-950 rounded-xl text-xs font-extrabold cursor-pointer hover:bg-amber-100"
                    >
                      {isBn ? 'শুধু “সহায়তা প্রয়োজন” সংরক্ষণ করুন' : 'Save “Help Needed”'}
                    </button>
                  </div>
                </div>
              )}

              {/* Unable Now Panel */}
              {feedbackPanel === 'unable' && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-300 space-y-2.5">
                  <p className="text-xs font-black text-slate-900">
                    {isBn ? 'এখন করতে না পারার কারণ বেছে নিন বা লিখুন:' : 'Select or write why you cannot do it now:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(isBn ? UNABLE_REASONS_BN : UNABLE_REASONS_EN).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setUnableReason(r)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer ${
                          unableReason === r
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={unableReason}
                    onChange={(e) => setUnableReason(e.target.value)}
                    placeholder={isBn ? 'অন্য কোনো কারণ থাকলে লিখুন...' : 'Optional custom reason...'}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUnableSubmit}
                    className="w-full min-h-[44px] py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs cursor-pointer"
                  >
                    {isBn ? '“এখন করতে পারছি না” হিসেবে সংরক্ষণ করুন' : 'Save as Deferred'}
                  </button>
                </div>
              )}

              {/* Not Applicable Confirmation */}
              {feedbackPanel === 'not_applicable' && (
                <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-300 space-y-2.5">
                  <p className="text-xs font-bold text-slate-800">
                    {isBn
                      ? 'এই কাজটি আপনার খামারের ধরন বা প্রাণীর সাথে না মিললে “প্রযোজ্য নয়” চিহ্নিত করতে পারেন। এতে আপনার প্রতিদিনের কাজের হিসাব নির্ভুল থাকবে।'
                      : 'If this does not apply to your farm species or setup, mark it Not Applicable so your progress remains accurate.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleNotApplicable}
                    className="w-full min-h-[44px] py-2 bg-slate-700 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs cursor-pointer"
                  >
                    {isBn ? 'নিশ্চিত: আমার খামারে প্রযোজ্য নয়' : 'Confirm Not Applicable'}
                  </button>
                </div>
              )}

              {/* 4 Response Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCompleteBiosecurity}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isBn ? 'কাজটি সম্পন্ন করেছি' : 'Completed This Task'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackPanel(feedbackPanel === 'help' ? 'none' : 'help')}
                  className="min-h-[48px] px-4 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 shrink-0 text-amber-800" />
                  <span>{isBn ? 'সহায়তা প্রয়োজন' : 'Need Help'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackPanel(feedbackPanel === 'unable' ? 'none' : 'unable')}
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PauseCircle className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{isBn ? 'এখন করতে পারছি না' : 'Cannot Do Right Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFeedbackPanel(feedbackPanel === 'not_applicable' ? 'none' : 'not_applicable')
                  }
                  className="min-h-[46px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MinusCircle className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{isBn ? 'আমার খামারে প্রযোজ্য নয়' : 'Not Applicable'}</span>
                </button>
              </div>
            </section>
          )}

          {/* Preventive Care Task Footer Action */}
          {!isBiosecurity && careTask && (
            <section className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCareRecord) {
                    const careTypeToPass = careTask.careType === 'deworming' ? 'deworming' : 'vaccination';
                    onOpenCareRecord(careTask.targetId, careTypeToPass);
                  }
                }}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Syringe className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'টিকা/কৃমিনাশক প্রয়োগ রেকর্ড করুন' : 'Log Vaccine/Deworming Record'}</span>
              </button>

              {onNavigate && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('health_support');
                    }}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>{isBn ? 'সহায়তা প্রয়োজন' : 'Need Help'}</span>
                  </button>
                  <KhamarContactCallAction
                    lang={lang}
                    labelBn={`খামার সুরক্ষা: ${getKhamarPhoneShortLabel(lang)}`}
                    labelEn={`Call: ${getKhamarPhoneShortLabel(lang)}`}
                    className="min-h-[44px] w-full px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
