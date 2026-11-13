import React, { useState, useEffect } from 'react';
import { ActionPlanItem, ActionStatus, Language, NavScreen } from '../types';
import { toBanglaNum } from '../translations';
import { BIOSECURITY_DOMAINS } from '../data/biosecurityQuestions';
import { StatusBadge } from './ui/StatusBadge';
import { TopicIllustration } from './BiosecurityIllustrations';
import {
  X,
  CheckCircle2,
  User,
  BookOpen,
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
import { ActionUpdatePayload } from './BioShieldTaskDetailModal';

interface ActionDetailModalProps {
  action: ActionPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    actionId: string,
    newStatus: ActionStatus,
    data?: ActionUpdatePayload
  ) => void;
  lang: Language;
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

export const ActionDetailModal: React.FC<ActionDetailModalProps> = ({
  action,
  isOpen,
  onClose,
  onUpdateStatus,
  lang,
  onNavigate,
}) => {
  const isBn = lang === 'bn';

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
      setAssignedTo(action.assignedTo || (isBn ? 'আমি নিজে করব' : 'Self'));
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
  }, [action, isBn]);

  if (!isOpen || !action) return null;

  const matchedDomain = BIOSECURITY_DOMAINS.find((d) => d.id === action.domainId);
  const topicOrder = matchedDomain?.order || 3;
  const knowledgeTopic = action.knowledgeTopicId || matchedDomain?.knowledgeTopicId || 'topic_daily_hygiene';

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const handleAssignPreset = (presetId: 'self' | 'family' | 'worker', label: string) => {
    setAssignedCategory(presetId);
    setAssignedTo(label);
    onUpdateStatus(action.id, action.status, {
      assignedCategory: presetId,
      assignedTo: label,
      completedSteps,
      notes,
    });
  };

  const handleComplete = () => {
    onUpdateStatus(action.id, 'completed', {
      notes,
      assignedTo,
      assignedCategory,
      completedSteps,
    });
    onClose();
  };

  const handleSaveHelpNeeded = (routeTarget?: NavScreen) => {
    onUpdateStatus(action.id, 'help_needed', {
      helpReason: helpReason.trim() || (isBn ? 'কাজটি করতে সহায়তা প্রয়োজন' : 'Need guidance on this task'),
      notes,
      assignedTo,
      assignedCategory,
      completedSteps,
    });
    if (routeTarget && onNavigate) {
      onClose();
      onNavigate(routeTarget);
    } else if (!routeTarget) {
      onClose();
    }
  };

  const handleUnableSubmit = () => {
    onUpdateStatus(action.id, 'unable_to_complete', {
      unableReason: unableReason.trim() || (isBn ? 'এই মুহূর্তে করা সম্ভব নয়' : 'Cannot complete right now'),
      notes,
      assignedTo,
      assignedCategory,
      completedSteps,
    });
    onClose();
  };

  const handleNotApplicable = () => {
    onUpdateStatus(action.id, 'not_applicable', {
      notes: notes.trim() || (isBn ? 'আমার খামারের জন্য প্রযোজ্য নয়' : 'Not applicable to my farm'),
      assignedTo,
      assignedCategory,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-emerald-900/20 bg-emerald-950 text-white flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <StatusBadge
                variant={
                  action.status === 'completed'
                    ? 'completed'
                    : action.status === 'help_needed'
                    ? 'help_needed'
                    : action.status === 'not_applicable'
                    ? 'not_applicable'
                    : action.riskCategory === 'critical'
                    ? 'overdue'
                    : 'due_soon'
                }
                size="sm"
                lang={lang}
              />
              <span className="text-[11px] font-mono text-emerald-200">
                {toBanglaNum(action.deadlineDate, lang)}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white leading-snug">
              {isBn ? action.titleBn : action.titleEn}
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

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <TopicIllustration topicOrder={topicOrder} className="w-full h-36" />
          </div>

          <section className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="text-xs font-black text-slate-900">
              {isBn ? 'ক. কী করতে হবে?' : 'A. What To Do'}
            </h4>
            <p className="text-sm font-bold text-slate-800">
              {action.targetDescriptionBn || (isBn ? 'সমগ্র খামার' : 'Whole Farm')}
            </p>
          </section>

          <section className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
            <h4 className="text-xs font-black text-amber-950">
              {isBn ? 'খ. কেন এটি খামারের জন্য জরুরি?' : 'B. Why Needed'}
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
              {isBn ? action.whyRecommendedBn : action.whyRecommendedEn}
            </p>
          </section>

          <section className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black text-emerald-950">
                {isBn ? 'গ. কীভাবে করবেন?' : 'C. How To Do It'}
              </h4>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('knowledge_library', knowledgeTopic);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আরও জানুন' : 'Learn More'}</span>
                </button>
              )}
            </div>

            {action.requiredMaterialsBn && (
              <div className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-start gap-2 text-xs text-slate-700">
                <Package className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">{isBn ? 'কী কী লাগবে: ' : 'Materials: '}</strong>
                  {isBn ? action.requiredMaterialsBn : action.requiredMaterialsEn}
                </span>
              </div>
            )}

            <div className="space-y-2">
              {(isBn ? action.stepsBn : action.stepsEn).map((step, idx) => {
                const checked = completedSteps.includes(idx);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      checked ? 'bg-emerald-100/80 border-emerald-300' : 'bg-white border-emerald-100 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {checked ? <Check className="w-3.5 h-3.5" /> : toBanglaNum(idx + 1, lang)}
                    </span>
                    <span className={`text-xs sm:text-sm leading-snug ${checked ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}`}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
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
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
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

          <section className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-900">
              {isBn ? 'ঙ. কাজ করি ও জানাই' : 'E. Act & Feedback'}
            </h4>

            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isBn ? 'ছোট নোট লিখুন (ঐচ্ছিক)...' : 'Optional note...'}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />

            {feedbackPanel === 'help' && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-2.5">
                <p className="text-xs font-black text-amber-950">
                  {isBn ? 'সহায়তা পেতে নিচের যেকোনো পথ বেছে নিন:' : 'Choose a support option:'}
                </p>
                <input
                  type="text"
                  value={helpReason}
                  onChange={(e) => setHelpReason(e.target.value)}
                  placeholder={isBn ? 'কী বুঝতে সমস্যা হচ্ছে লিখুন (ঐচ্ছিক)...' : 'Briefly write what you need help with...'}
                  className="w-full p-2.5 text-xs rounded-xl border border-amber-300 bg-white"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveHelpNeeded('ai_assistant')}
                    className="min-h-[44px] px-3 py-2 bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isBn ? 'খামার বন্ধুকে জিজ্ঞাসা করুন' : 'Ask Khamar Bondhu'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveHelpNeeded('vet_services')}
                    className="min-h-[44px] px-3 py-2 bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{isBn ? 'পশুচিকিৎসকের পরামর্শ' : 'Consult Vet'}</span>
                  </button>
                  <KhamarContactCallAction
                    lang={lang}
                    labelBn={`খামার সুরক্ষা কল: ${getKhamarPhoneShortLabel(lang)}`}
                    labelEn={`Call Khamar Shurokkha: ${getKhamarPhoneShortLabel(lang)}`}
                    onBeforeAction={() => {
                      onUpdateStatus(action.id, 'help_needed', {
                        helpReason: helpReason.trim() || (isBn ? 'কাজটি করতে সহায়তা প্রয়োজন' : 'Need guidance on this task'),
                        notes,
                        assignedTo,
                        assignedCategory,
                        completedSteps,
                      });
                    }}
                    className="min-h-[44px] w-full px-3 py-2 bg-[#166534] hover:bg-emerald-900 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveHelpNeeded()}
                    className="min-h-[44px] px-3 py-2 bg-white border border-amber-400 text-amber-950 rounded-xl text-xs font-extrabold cursor-pointer"
                  >
                    {isBn ? 'শুধু “সহায়তা প্রয়োজন” সংরক্ষণ করুন' : 'Save “Help Needed”'}
                  </button>
                </div>
              </div>
            )}

            {feedbackPanel === 'unable' && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-300 space-y-2">
                <textarea
                  rows={2}
                  value={unableReason}
                  onChange={(e) => setUnableReason(e.target.value)}
                  placeholder={isBn ? 'এখন করতে না পারার কারণ লিখুন (ঐচ্ছিক)...' : 'Optional reason...'}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleUnableSubmit}
                  className="w-full min-h-[44px] py-2 bg-slate-800 text-white font-extrabold rounded-xl text-xs cursor-pointer"
                >
                  {isBn ? '“এখন করতে পারছি না” সংরক্ষণ করুন' : 'Confirm Deferred'}
                </button>
              </div>
            )}

            {feedbackPanel === 'not_applicable' && (
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-300 space-y-2">
                <p className="text-xs font-bold text-slate-800">
                  {isBn
                    ? 'এই কাজটি আপনার খামারের জন্য প্রযোজ্য না হলে হিসাব থেকে বাদ রাখতে নিশ্চিত করুন।'
                    : 'Confirm marking this task not applicable to exclude it from completion metrics.'}
                </p>
                <button
                  type="button"
                  onClick={handleNotApplicable}
                  className="w-full min-h-[44px] py-2 bg-slate-700 text-white font-extrabold rounded-xl text-xs cursor-pointer"
                >
                  {isBn ? 'নিশ্চিত: আমার খামারে প্রযোজ্য নয়' : 'Confirm Not Applicable'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleComplete}
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
        </div>
      </div>
    </div>
  );
};
