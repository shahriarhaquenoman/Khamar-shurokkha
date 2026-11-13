import React, { useState, useMemo } from 'react';
import {
  FarmProfile,
  AnimalProfile,
  FlockProfile,
  ScheduledCareTask,
  RegionalAlert,
  WeatherInfo,
  Language,
  NavScreen,
  ActionPlanItem,
  ActionStatus,
  AuditItemAnswer,
} from '../types';
import { toBanglaNum } from '../translations';
import { FarmerAccount } from '../services/authService';
import { BioShieldTaskDetailModal, TaskDetailModalTarget, ActionUpdatePayload } from './BioShieldTaskDetailModal';
import { StatusBadge } from './ui/StatusBadge';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  TopicIllustration,
  VaccinationIllustration,
  DewormingIllustration,
} from './BiosecurityIllustrations';
import { BIOSECURITY_DOMAINS, getFarmAnimalGroups } from '../data/biosecurityQuestions';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CloudSun,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Stethoscope,
  PlusCircle,
  Syringe,
  HelpCircle,
  User,
  MapPin,
} from 'lucide-react';

interface DashboardScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  tasks: ScheduledCareTask[];
  alerts: RegionalAlert[];
  weather: WeatherInfo;
  lang: Language;
  currentUser?: FarmerAccount | null;
  actions?: ActionPlanItem[];
  onUpdateActionStatus?: (
    actionId: string,
    newStatus: ActionStatus,
    data?: ActionUpdatePayload
  ) => void;
  auditAnswers?: Record<string, AuditItemAnswer>;
  onOpenAuth?: () => void;
  onNavigate: (screen: NavScreen, topicKey?: string) => void;
  onCompleteTask: (taskId: string) => void;
  onQuickAddAnimal: () => void;
  onQuickAddFlock: () => void;
  onQuickRecordVaccine: (targetId?: string) => void;
  onQuickRecordDeworm: (targetId?: string) => void;
  onQuickReportProblem: () => void;
}

type UnifiedPriorityItem = {
  id: string;
  kind: 'biosecurity_action' | 'care_task';
  rank: number;
  titleBn: string;
  titleEn: string;
  whyBn: string;
  whyEn: string;
  dueDate: string;
  statusLabelBn: string;
  statusLabelEn: string;
  badgeVariant: 'overdue' | 'due_soon' | 'upcoming' | 'completed' | 'help_needed' | 'in_progress';
  targetLabelBn: string;
  targetLabelEn: string;
  assignee?: string;
  topicOrder?: number;
  careType?: 'vaccination' | 'deworming' | 'routine_hygiene';
  action?: ActionPlanItem;
  careTask?: ScheduledCareTask;
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  farm,
  animals,
  flocks,
  tasks,
  alerts,
  weather,
  lang,
  currentUser,
  actions = [],
  onUpdateActionStatus,
  onNavigate,
  onQuickAddAnimal,
  onQuickAddFlock,
  onQuickRecordVaccine,
  onQuickRecordDeworm,
}) => {
  const isBn = lang === 'bn';
  const [modalTarget, setModalTarget] = useState<TaskDetailModalTarget | null>(null);
  const [progressPeriod, setProgressPeriod] = useState<'today' | 'week'>('today');

  const { hasPoultry, hasRuminant } = useMemo(() => getFarmAnimalGroups(farm), [farm]);
  const totalLivestock = animals.filter((a) => !a.isArchived).length;
  const totalBirds = flocks
    .filter((f) => f.status === 'active')
    .reduce((acc, f) => acc + f.currentBirdCount, 0);

  // Filter actions belonging to this farm and matching farm species
  const farmActions = useMemo(() => {
    const poultryOnlyDomains = ['bio_07_wild_birds_pests', 'bio_09_other_animals_separation'];
    return actions.filter((act) => {
      if (act.farmId && act.farmId !== farm.id) return false;
      if (hasRuminant && !hasPoultry) {
        if (poultryOnlyDomains.includes(act.domainId)) return false;
        if (
          act.applicableSpecies &&
          act.applicableSpecies.length > 0 &&
          !act.applicableSpecies.some((s) => ['cattle', 'buffalo', 'goat', 'sheep'].includes(s))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [actions, farm.id, hasPoultry, hasRuminant]);

  // Build deterministic priority queue (excluding completed, unable_to_complete, and not_applicable for actionable next tasks)
  const { primaryAction, nextTwoActions, completedCount, remainingCount, helpNeededCount, completionPercent } =
    useMemo(() => {
      const openItems: UnifiedPriorityItem[] = [];
      let completed = 0;
      let helpNeeded = 0;
      let totalEligible = 0;

      const todayStr = new Date().toISOString().split('T')[0];
      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      const nextWeekStr = nextWeekDate.toISOString().split('T')[0];

      farmActions.forEach((act) => {
        if (act.status === 'not_applicable') return; // Exclude N/A from completion denominator
        totalEligible += 1;

        if (act.status === 'completed') {
          completed += 1;
          return;
        }
        if (act.status === 'help_needed') {
          helpNeeded += 1;
          return;
        }
        if (act.status === 'unable_to_complete') {
          return;
        }

        const domain = BIOSECURITY_DOMAINS.find((d) => d.id === act.domainId);
        let rank = 6;
        if (act.riskCategory === 'critical' || act.priority === 'urgent') rank = 1;
        else if (act.sourceModule === 'disease_advisory' || act.sourceModule === 'environmental') rank = 2;
        else if (act.riskCategory === 'high' || act.priority === 'high') rank = 5;

        openItems.push({
          id: act.id,
          kind: 'biosecurity_action',
          rank,
          titleBn: act.titleBn,
          titleEn: act.titleEn,
          whyBn: act.whyRecommendedBn,
          whyEn: act.whyRecommendedEn,
          dueDate: act.deadlineDate,
          statusLabelBn: act.status === 'in_progress' ? 'চলমান কাজ' : act.riskCategory === 'critical' ? 'আজই জরুরি' : 'গুরুত্বপূর্ণ করণীয়',
          statusLabelEn: act.status === 'in_progress' ? 'In Progress' : act.riskCategory === 'critical' ? 'Urgent Today' : 'Recommended',
          badgeVariant: act.status === 'in_progress' ? 'in_progress' : act.riskCategory === 'critical' ? 'overdue' : 'due_soon',
          targetLabelBn: act.targetDescriptionBn || farm.name,
          targetLabelEn: act.targetDescriptionEn || farm.name,
          assignee: act.assignedTo,
          topicOrder: domain?.order || 3,
          action: act,
        });
      });

      const relevantCareTasks = tasks.filter((t) => {
        if (progressPeriod === 'today') {
          return t.status === 'overdue' || t.status === 'due_soon' || t.status === 'completed' || t.dueDate <= todayStr;
        }
        return t.dueDate <= nextWeekStr || t.status === 'overdue' || t.status === 'completed';
      });

      relevantCareTasks.forEach((task) => {
        totalEligible += 1;
        if (task.status === 'completed') {
          completed += 1;
          return;
        }
        if (task.status === 'missed') return;

        let rank = 6;
        if (task.careType === 'vaccination' && (task.status === 'overdue' || task.status === 'due_soon')) {
          rank = 3;
        } else if (task.careType === 'deworming' && (task.status === 'overdue' || task.status === 'due_soon')) {
          rank = 4;
        }

        openItems.push({
          id: task.id,
          kind: 'care_task',
          rank,
          titleBn: task.titleBn,
          titleEn: task.titleEn,
          whyBn: task.descriptionBn,
          whyEn: task.descriptionEn,
          dueDate: task.dueDate,
          statusLabelBn: task.status === 'overdue' ? 'সময় পেরিয়ে গেছে' : 'নির্ধারিত যত্ন',
          statusLabelEn: task.status === 'overdue' ? 'Overdue' : 'Due Care',
          badgeVariant: task.status === 'overdue' ? 'overdue' : 'due_soon',
          targetLabelBn: task.targetName,
          targetLabelEn: task.targetName,
          careType: task.careType,
          careTask: task,
        });
      });

      openItems.sort((a, b) => a.rank - b.rank || a.dueDate.localeCompare(b.dueDate));

      const pct = totalEligible > 0 ? Math.round((completed / totalEligible) * 100) : 0;

      return {
        primaryAction: openItems[0] || null,
        nextTwoActions: openItems.slice(1, 3),
        completedCount: completed,
        remainingCount: openItems.length,
        helpNeededCount: helpNeeded,
        completionPercent: pct,
      };
    }, [farmActions, tasks, farm.name, progressPeriod]);

  // Farm-relevant alerts ONLY (max 2)
  const relevantAlerts = useMemo(() => {
    const farmSpecies = farm.speciesPresent || [];
    return alerts
      .filter((a) => farmSpecies.length === 0 || a.species.some((s) => farmSpecies.includes(s)))
      .slice(0, 2);
  }, [alerts, farm.speciesPresent]);

  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return isBn ? 'শুভ সকাল' : 'Good Morning';
    if (hour < 17) return isBn ? 'শুভ দুপুর' : 'Good Afternoon';
    return isBn ? 'শুভ সন্ধ্যা' : 'Good Evening';
  }, [isBn]);

  const ownerDisplay = currentUser?.displayName || farm.ownerName.split('(')[0].trim();

  const handleOpenItemModal = (item: UnifiedPriorityItem) => {
    if (item.kind === 'biosecurity_action' && item.action) {
      setModalTarget({ type: 'biosecurity_action', action: item.action });
    } else if (item.kind === 'care_task' && item.careTask) {
      setModalTarget({ type: 'care_task', task: item.careTask });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">
      {/* Section A: Compact Welcome Card with Bangladesh Farm Photography */}
      <section className="bg-[#166534] text-white rounded-3xl p-5 sm:p-6 shadow-md overflow-hidden border border-emerald-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100 font-bold">
              <span>{greetingText}, {ownerDisplay}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{farm.id}</span>
              {farm.isDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-300">{isBn ? 'ডেমো খামার' : 'Demo Farm'}</span>
                </>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {isBn ? 'আজ আমার খামারে কী কী করণীয়?' : 'What Should I Do for My Farm Today?'}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-emerald-50 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>{farm.name.split('(')[0].trim()} · {farm.upazila.split('(')[0].trim()}</span>
              </span>
              <span className="tabular-nums font-bold text-white">
                {toBanglaNum(totalLivestock, lang)} {isBn ? 'টি গরু-ছাগল' : 'Livestock'} ·{' '}
                {toBanglaNum(totalBirds, lang)} {isBn ? 'টি হাঁস-মুরগি' : 'Poultry'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={hasRuminant && !hasPoultry ? onQuickAddAnimal : onQuickAddFlock}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                <span>
                  {hasRuminant && !hasPoultry
                    ? (isBn ? 'নতুন প্রাণী যোগ' : 'Add Animal')
                    : (isBn ? 'ফ্লক বা প্রাণী যোগ' : 'Add Flock / Animal')}
                </span>
              </button>
              <button
                onClick={() => onQuickRecordVaccine()}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Syringe className="w-4 h-4 text-pink-100" />
                <span>{isBn ? 'টিকা রেকর্ড' : 'Log Vaccine'}</span>
              </button>
              <button
                onClick={() => onNavigate('health_support')}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-cyan-100" />
                <span>{isBn ? 'স্বাস্থ্য সহায়তা' : 'Health Support'}</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden border border-white/20 shadow-sm">
              <ResilientImage
                src={
                  farm.photoUrl ||
                  (hasPoultry && !hasRuminant
                    ? FARM_VISUAL_ASSETS.poultryBiosecurity
                    : FARM_VISUAL_ASSETS.farmHero)
                }
                fallbackSrc={FARM_VISUAL_ASSETS.farmHero}
                alt={isBn ? 'বাংলাদেশের খামারে কৃষক ও সুস্থ গবাদিপশু' : 'Bangladeshi farmer tending healthy farm livestock'}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 py-2 text-[11px] font-bold text-white flex items-center justify-between">
                <span>{isBn ? 'নিরাপদ খামার, সুস্থ প্রাণিসম্পদ' : 'Safe Farm, Healthy Livestock'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Single Top Priority Action ("আজ প্রথমে এই কাজটি করুন") */}
      <section className="bg-white rounded-3xl border border-red-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-black text-red-700 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{isBn ? '১. আজ প্রথমে এই কাজটি করুন' : '1. Do This First Today'}</span>
          </span>
          {primaryAction && (
            <StatusBadge
              variant={primaryAction.badgeVariant}
              label={isBn ? primaryAction.statusLabelBn : primaryAction.statusLabelEn}
              size="sm"
              lang={lang}
            />
          )}
        </div>

        {primaryAction ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              {primaryAction.kind === 'biosecurity_action' ? (
                <TopicIllustration topicOrder={primaryAction.topicOrder || 3} className="w-full h-36" />
              ) : primaryAction.careType === 'deworming' ? (
                <DewormingIllustration className="w-full h-36" />
              ) : (
                <VaccinationIllustration className="w-full h-36" />
              )}
            </div>

            <div className="md:col-span-8 space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {isBn ? primaryAction.titleBn : primaryAction.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {isBn ? primaryAction.whyBn : primaryAction.whyEn}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-mono">{toBanglaNum(primaryAction.dueDate, lang)}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{isBn ? primaryAction.targetLabelBn : primaryAction.targetLabelEn}</span>
                {primaryAction.assignee && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-800">
                      <User className="w-3.5 h-3.5" />
                      <span>{primaryAction.assignee}</span>
                    </span>
                  </>
                )}
              </div>

              <div className="pt-1">
                <button
                  onClick={() => handleOpenItemModal(primaryAction)}
                  className="min-h-[48px] w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>{isBn ? 'কাজটি শুরু করুন' : 'Start This Task'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="text-base font-extrabold text-slate-900">
              {isBn
                ? 'অভিনন্দন! আজকের অগ্রাধিকারমূলক কোনো কাজ বাকি নেই।'
                : 'Great job! No urgent priority tasks remaining right now.'}
            </h2>
            <p className="text-xs text-slate-600">
              {isBn
                ? 'আপনি নিচের দৈনিক সুরক্ষা পরীক্ষা বা জ্ঞানভান্ডার দেখতে পারেন।'
                : 'You can review your daily checklist or learning guides below.'}
            </p>
          </div>
        )}
      </section>

      {/* Section C & D Grid: Next 2 Recommended Activities + Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section C: Next 2 Recommended Activities */}
        <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-black text-slate-900">
              {isBn ? 'পরবর্তী ২টি করণীয়' : 'Next 2 Recommended Tasks'}
            </h2>
            <button
              onClick={() => onNavigate('biosecurity')}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isBn ? 'সব কাজ দেখুন' : 'View All Tasks'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {nextTwoActions.length === 0 ? (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-600 font-medium">
              {isBn
                ? 'আর কোনো পরবর্তী কাজ অপেক্ষায় নেই। সম্পূর্ণ তালিকা দেখতে BioShield পাতায় যান।'
                : 'No additional queued items. Visit BioShield Care for full checklist and assessment.'}
            </div>
          ) : (
            <div className="space-y-3">
              {nextTwoActions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        variant={item.badgeVariant}
                        label={isBn ? item.statusLabelBn : item.statusLabelEn}
                        size="sm"
                        lang={lang}
                      />
                      <span className="text-[11px] font-mono text-slate-500">
                        {toBanglaNum(item.dueDate, lang)}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {isBn ? item.targetLabelBn : item.targetLabelEn}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenItemModal(item)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 text-slate-800 text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isBn ? 'বিস্তারিত দেখুন' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigate('biosecurity')}
            className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{isBn ? 'সব কাজ ও দৈনিক চেকলিস্ট দেখুন' : 'Open Full Action Plan & Daily Checklist'}</span>
          </button>
        </section>

        {/* Section D: Honest Activity Completion Progress Summary */}
        <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-black text-slate-900">
                {isBn ? 'আজকের খামার সুরক্ষা কার্যক্রম' : 'Farm Care Progress'}
              </h2>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setProgressPeriod('today')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                    progressPeriod === 'today' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {isBn ? 'আজ' : 'Today'}
                </button>
                <button
                  onClick={() => setProgressPeriod('week')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                    progressPeriod === 'week' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {isBn ? 'সপ্তাহ' : 'Week'}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-emerald-900">
                  {isBn ? 'সম্পন্ন কাজের হার' : 'Task Completion Rate'}
                </span>
                <span className="text-2xl font-black text-emerald-900 tabular-nums font-mono">
                  {toBanglaNum(completionPercent, lang)}%
                </span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-emerald-200">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                <div className="bg-white rounded-xl p-2 border border-emerald-100">
                  <span className="block text-[11px] text-slate-500 font-bold">
                    {isBn ? 'সম্পন্ন' : 'Done'}
                  </span>
                  <span className="text-base font-black text-emerald-800 tabular-nums">
                    {toBanglaNum(completedCount, lang)}
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2 border border-emerald-100">
                  <span className="block text-[11px] text-slate-500 font-bold">
                    {isBn ? 'বাকি' : 'Left'}
                  </span>
                  <span className="text-base font-black text-slate-800 tabular-nums">
                    {toBanglaNum(remainingCount, lang)}
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2 border border-amber-200">
                  <span className="block text-[11px] text-amber-800 font-bold">
                    {isBn ? 'সহায়তা' : 'Help'}
                  </span>
                  <span className="text-base font-black text-amber-800 tabular-nums">
                    {toBanglaNum(helpNeededCount, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            {isBn
              ? 'স্বচ্ছতার তথ্য: এটি কেবল প্রযোজ্য করণীয় কাজের অগ্রগতি দেখায়; এটি খামারের রোগমুক্তি বা সুরক্ষার চিকিৎসাগত নিশ্চয়তা নয়।'
              : 'Transparency note: This reflects completed checklist tasks only, not clinical immunity or disease-free status.'}
          </p>
        </section>
      </div>

      {/* Section E: Compact Relevant Farm Alerts Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{isBn ? 'খামারের জন্য প্রাসঙ্গিক সতর্কতা ও আবহাওয়া' : 'Relevant Farm Alerts & Weather'}</span>
          </h2>
          <button
            onClick={() => onNavigate('regional_alerts')}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isBn ? 'সতর্কতার বিস্তারিত দেখুন' : 'View Alert Details'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Weather Stress Card */}
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
            <CloudSun className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-sky-950">
                <span>
                  {weather.district.split('(')[0].trim()} · {toBanglaNum(weather.temp, lang)}°C
                </span>
                <span className="text-[11px] font-bold text-amber-800">
                  ({isBn ? 'তাপমাত্রার চাপ:' : 'Heat stress:'} {weather.heatStressIndex})
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                {(isBn ? weather.managementTipsBn : weather.managementTipsEn)[0]}
              </p>
              <span className="inline-block text-[10px] font-bold text-slate-500">
                {isBn ? 'নমুনা আবহাওয়া তথ্য (ডেমো)' : 'Sample weather notice (Demo)'}
              </span>
            </div>
          </div>

          {/* Single top species-matched alert */}
          {relevantAlerts[0] ? (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-amber-950 leading-snug">
                  {isBn ? relevantAlerts[0].titleBn : relevantAlerts[0].titleEn}
                </p>
                <p className="text-xs text-amber-900 font-medium">
                  {(isBn
                    ? relevantAlerts[0].recommendedPrecautionsBn
                    : relevantAlerts[0].recommendedPrecautionsEn)[0]}
                </p>
                <span className="inline-block text-[10px] font-bold text-amber-800">
                  {relevantAlerts[0].isSimulated
                    ? (isBn ? 'ডেমো সতর্কতা উদাহরণ' : 'Simulated Advisory Demo')
                    : relevantAlerts[0].source}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                {isBn
                  ? 'আপনার খামারের প্রাণীদের জন্য বর্তমানে কোনো জরুরি আঞ্চলিক সতর্কতা নেই।'
                  : 'No active regional disease alerts matching your farm species.'}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Section F: Compact 4-Step BioShield Action Loop + Knowledge / Help Entry */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              {isBn ? 'আমাদের কাজের সহজ ৪টি ধাপ (BioShield Action Loop)' : 'Our Simple 4-Step Farm Action Loop'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'খামারের সমস্যা খুঁজে বের করা থেকে শুরু করে কাজ সম্পন্ন বা সহায়তা নেওয়া পর্যন্ত'
                : 'From identifying farm needs to completing tasks or getting support'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('knowledge_library')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>{isBn ? 'শিখি (জ্ঞানভান্ডার)' : 'Learn (Guides)'}</span>
            </button>
            <button
              onClick={() => onNavigate('health_support')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-700" />
              <span>{isBn ? 'স্বাস্থ্য সহায়তা' : 'Health Support'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              step: '১',
              badgeColor: 'bg-blue-600 text-white',
              titleBn: 'খুঁজে দেখি',
              titleEn: 'Identify',
              descBn: 'খামারে কোথায় সমস্যা বা ঘাটতি আছে?',
              descEn: 'Where are the gaps on the farm?',
              onClick: () => onNavigate('biosecurity'),
            },
            {
              step: '২',
              badgeColor: 'bg-pink-600 text-white',
              titleBn: 'আগে কোনটি?',
              titleEn: 'Prioritize',
              descBn: 'কোন কাজটি আগে করা জরুরি?',
              descEn: 'Which task should come first?',
              onClick: () => onNavigate('biosecurity'),
            },
            {
              step: '৩',
              badgeColor: 'bg-amber-600 text-white',
              titleBn: 'কাজ ঠিক করি',
              titleEn: 'Assign',
              descBn: 'কে কাজটি করবেন? (ঐচ্ছিক)',
              descEn: 'Who will do this task?',
              onClick: () => (primaryAction ? handleOpenItemModal(primaryAction) : onNavigate('biosecurity')),
            },
            {
              step: '৪',
              badgeColor: 'bg-emerald-700 text-white',
              titleBn: 'কাজ করি ও জানাই',
              titleEn: 'Act & Feedback',
              descBn: 'কাজটি করেছেন? নাকি সাহায্য প্রয়োজন?',
              descEn: 'Done, or do you need help?',
              onClick: () => (primaryAction ? handleOpenItemModal(primaryAction) : onNavigate('biosecurity')),
            },
          ].map((stage) => (
            <button
              key={stage.step}
              onClick={stage.onClick}
              className="text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${stage.badgeColor}`}>
                  {stage.step}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  {isBn ? stage.titleBn : stage.titleEn}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-snug">
                {isBn ? stage.descBn : stage.descEn}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Unified Farmer Task Guide Modal */}
      <BioShieldTaskDetailModal
        target={modalTarget}
        isOpen={!!modalTarget}
        onClose={() => setModalTarget(null)}
        farm={farm}
        lang={lang}
        onUpdateActionStatus={onUpdateActionStatus}
        onOpenCareRecord={(targetId, type) => {
          if (type === 'deworming') {
            onQuickRecordDeworm(targetId);
          } else {
            onQuickRecordVaccine(targetId);
          }
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};
