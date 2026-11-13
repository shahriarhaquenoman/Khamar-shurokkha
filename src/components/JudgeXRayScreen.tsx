import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  Scale,
  ShieldAlert,
  ArrowRight,
  Info,
  DollarSign,
  Layers,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import {
  Language,
  FarmProfile,
  ActionPlanItem,
  JudgeXRayExplanation,
  BudgetCategory,
  AuditResponse,
} from '../types';
import { BIOSECURITY_DOMAINS } from '../data/biosecurityQuestions';
import { generateAdaptiveActionPlan } from '../utils/engine';

interface JudgeXRayScreenProps {
  lang: Language;
  farm: FarmProfile;
  activeActions: ActionPlanItem[];
  xRayExplanations: JudgeXRayExplanation[];
  onApplySimulatedPlan?: (newActions: ActionPlanItem[], newExpls: JudgeXRayExplanation[]) => void;
}

export const JudgeXRayScreen: React.FC<JudgeXRayScreenProps> = ({
  lang,
  farm,
  activeActions,
  xRayExplanations,
  onApplySimulatedPlan,
}) => {
  const isBn = lang === 'bn';

  // Simulator State
  const [simBudget, setSimBudget] = useState<BudgetCategory>(farm.budgetCategory || 'low');
  const [simAnswers, setSimAnswers] = useState<Record<string, AuditResponse>>({
    bio_01_visitor: 'partial',
    bio_02_footbath: 'missing',
    bio_03_sick_bird: 'missing',
    bio_04_water: 'partial',
    bio_05_rodent: 'missing',
    bio_06_dead_bird: 'good',
    bio_07_equipment: 'good',
    bio_08_all_in_all_out: 'partial',
    bio_09_feed_store: 'good',
    bio_10_wild_bird: 'partial',
  });

  const [activeTab, setActiveTab] = useState<'decision_trail' | 'simulator' | 'system_architecture'>('decision_trail');

  // Run simulation
  const simulationResult = useMemo(() => {
    const tempFarm: FarmProfile = {
      ...farm,
      budgetCategory: simBudget,
    };
    const formattedAnswers: Record<string, { domainId: string; response: AuditResponse }> = {};
    Object.entries(simAnswers).forEach(([dId, resp]) => {
      formattedAnswers[dId] = { domainId: dId, response: resp };
    });

    return generateAdaptiveActionPlan(tempFarm, formattedAnswers, 'sim_session_001');
  }, [farm, simBudget, simAnswers]);

  const handleSimResponseToggle = (domainId: string, resp: AuditResponse) => {
    setSimAnswers((prev) => ({
      ...prev,
      [domainId]: resp,
    }));
  };

  const handleApplyToActivePlan = () => {
    if (onApplySimulatedPlan) {
      onApplySimulatedPlan(simulationResult.actions, simulationResult.xRayExplanations);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'স্বচ্ছ সিদ্ধান্ত ইঞ্জিন • বিচারক এক্স-রে' : 'Transparent Decision Engine • Judge X-Ray'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isBn ? 'সিস্টেম লজিক ও সিদ্ধান্ত ট্র্যাকিং' : 'System Logic & Heuristic Audit Trail'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isBn
                ? 'খামার সুরক্ষা কোনো গোপন "ব্ল্যাক-বক্স" এআই বা মিথ্যা প্রব্যাবিলিটি দাবি করে না। এটি একটি রুল-ভিত্তিক এক্সপার্ট হিউরিস্টিক ইঞ্জিন যা খামারির বাজেট, বাস্তব দুর্বলতা ও সম্পদ বিবেচনায় নিয়ে সবচেয়ে কার্যকরী ৩টি সাপ্তাহিক পদক্ষেপ নির্ধারণ করে।'
                : 'Khamar Shurokkha explicitly avoids black-box generative hallucinations or fabricated probability claims. It is an auditable rule-based expert heuristic engine that tailors the top-3 weekly actions based on empirical veterinary biosecurity standards and low-resource constraints.'}
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700/80 flex flex-col items-center justify-center min-w-[200px] text-center shrink-0">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-1">
              <Award className="w-5 h-5" />
              <span>{isBn ? 'অ্যাডভাইজর মোড' : 'Advisor Mode'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-tight">
              {isBn
                ? 'নিয়মাবলি ও অগ্রাধিকার ভেটেরিনারি এপিডেমিওলজিস্টদের যুক্তি অনুযায়ী গঠিত'
                : 'Priorities structured according to empirical veterinary biosecurity guidelines'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('decision_trail')}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'decision_trail'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isBn ? 'সক্রিয় সিদ্ধান্তের কারণ (Decision Trail)' : 'Active Decision Trail'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-slate-900/60 text-emerald-300">
              {xRayExplanations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isBn ? 'ইন্টারেক্টিভ সিমুলেটর (Live Sandbox)' : 'Interactive Simulator'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {isBn ? 'পরীক্ষা করুন' : 'Live'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('system_architecture')}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'system_architecture'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isBn ? 'সিস্টেম আর্কিটেকচার ও সীমাবদ্ধতা' : 'Architecture & Boundaries'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DECISION TRAIL */}
      {activeTab === 'decision_trail' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-900 leading-relaxed">
              <p className="font-semibold mb-1">
                {isBn
                  ? 'কেন এই ৩টি কাজ নির্বাচিত হলো? (Decision Trail for Active Farm Plan)'
                  : 'Why were these specific actions selected?'}
              </p>
              <p className="text-emerald-800">
                {isBn
                  ? `নিচের কার্ডগুলোতে খামারের বর্তমান বাজেট স্তর (${farm.budgetCategory}) এবং পর্যবেক্ষণ করা ঘাটতির ওপর ভিত্তি করে সিস্টেমের প্রতিটি সিদ্ধান্তের পুঙ্খানুপুঙ্খ যুক্তি দেখানো হয়েছে।`
                  : `Each card below documents the exact rule, resource constraint, deferred alternative, and unvalidated assumption behind the current action plan for ${farm.farmName}.`}
              </p>
            </div>
          </div>

          {xRayExplanations.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">
                {isBn ? 'কোনো জরুরি ত্রুটি বা ঘাটতি পাওয়া যায়নি' : 'No Critical Weaknesses Detected'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {isBn
                  ? 'খামারের সমস্ত জীব-নিরাপত্তা অভ্যাস সন্তোষজনক অবস্থায় রয়েছে অথবা এখনো নতুন অডিট সম্পন্ন করা হয়নি।'
                  : 'All biosecurity practices are currently marked good, or an audit has not yet identified missing practices.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {xRayExplanations.map((expl, idx) => {
                const linkedAction = activeActions.find((a) => a.id === expl.actionId);
                const linkedDomain = BIOSECURITY_DOMAINS.find((d) => d.id === expl.triggeredByDomainId);

                return (
                  <div
                    key={expl.actionId}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Header bar */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-sm">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">
                            {isBn ? expl.actionTitleBn : expl.actionTitleEn}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span>{isBn ? 'উৎস ডোমেন:' : 'Trigger Domain:'}</span>
                            <span className="font-semibold text-slate-700">
                              {isBn ? linkedDomain?.titleBn : linkedDomain?.titleEn}
                            </span>
                            <span>•</span>
                            <span
                              className={`px-2 py-0.5 rounded font-medium ${
                                expl.auditResponse === 'missing'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {isBn
                                ? expl.auditResponse === 'missing'
                                  ? 'ঘাটতি (Missing)'
                                  : 'উন্নতি প্রয়োজন (Partial)'
                                : expl.auditResponse.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {linkedAction && (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              linkedAction.costCategory === 'free'
                                ? 'bg-emerald-100 text-emerald-800'
                                : linkedAction.costCategory === 'low'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {isBn ? `খরচ: ${linkedAction.costCategory}` : `Cost: ${linkedAction.costCategory}`}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {isBn ? `পরিশ্রম: ${linkedAction.estimatedEffort}` : `Effort: ${linkedAction.estimatedEffort}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Breakdown Grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      {/* Column 1: Rules & Constraints */}
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                          <div className="flex items-center gap-2 text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isBn ? 'সক্রিয়করণ নিয়ম (Rule Triggered)' : 'Rule Triggered'}</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed">
                            {isBn ? expl.ruleTriggeredBn : expl.ruleTriggeredEn}
                          </p>
                        </div>

                        <div className="bg-emerald-50/70 rounded-lg p-3.5 border border-emerald-200">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1.5 text-xs uppercase tracking-wider">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{isBn ? 'সম্পদ ও বাজেট বিবেচনা (Budget Filter)' : 'Resource & Budget Consideration'}</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed">
                            {isBn ? expl.resourceConstraintAppliedBn : expl.resourceConstraintAppliedEn}
                          </p>
                        </div>

                        <div className="bg-blue-50/70 rounded-lg p-3.5 border border-blue-200">
                          <div className="flex items-center gap-2 text-blue-800 font-bold mb-1.5 text-xs uppercase tracking-wider">
                            <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                            <span>{isBn ? 'স্থগিত কাঠামোগত বিকল্প (Deferred Alternative)' : 'Deferred Structural Alternative'}</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed">
                            {isBn ? expl.deferredAlternativeBn : expl.deferredAlternativeEn}
                          </p>
                        </div>
                      </div>

                      {/* Column 2: Assumptions & Unvalidated Caveat */}
                      <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                          <div className="flex items-center gap-2 text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{isBn ? 'সিস্টেমের প্রাথমিক অনুমান (Heuristic Assumptions)' : 'Heuristic Assumptions'}</span>
                          </div>
                          <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                            {(isBn ? expl.assumptionsMadeBn : expl.assumptionsMadeEn).map((asmp: string, aIdx: number) => (
                              <li key={aIdx} className="leading-relaxed">
                                {asmp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-3.5 border border-amber-300">
                          <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5 text-xs uppercase tracking-wider">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                            <span>{isBn ? 'গবেষণা যাচাইকরণ সতর্কবার্তা (Unvalidated Research Caveat)' : 'Unvalidated Research Caveat'}</span>
                          </div>
                          <p className="text-amber-950 font-medium leading-relaxed">
                            {isBn ? expl.unvalidatedCaveatBn : expl.unvalidatedCaveatEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <span>{isBn ? 'লাইভ সিদ্ধান্ত সিমুলেটর (Judge Sandbox)' : 'Live Decision Simulator (Judge Sandbox)'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {isBn
                    ? 'বাজেটের স্তর এবং বিভিন্ন ডোমেনের দুর্বলতা পরিবর্তন করে দেখুন কীভাবে সাপ্তাহিক করণীয় ও যুক্তি স্বয়ংক্রিয়ভাবে খাপ খায়।'
                    : 'Tweak budget tiers and domain audit statuses to observe how the engine dynamically adapts between bamboo low-cost solutions and commercial alternatives.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleApplyToActivePlan}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? 'খামারে প্রয়োগ করুন' : 'Apply to Farm Plan'}</span>
                </button>
              </div>
            </div>

            {/* Budget Selector */}
            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
              {(
                [
                  { id: 'very_limited', bn: 'অত্যন্ত সীমিত (Very Limited)', en: 'Very Limited ($0 - Low)' },
                  { id: 'low', bn: 'স্বল্প বাজেট (Low)', en: 'Low ($10 - $30)' },
                  { id: 'moderate', bn: 'মাঝারি (Moderate)', en: 'Moderate ($30 - $100)' },
                  { id: 'flexible', bn: 'নমনীয় (Flexible)', en: 'Flexible (Commercial)' },
                ] as const
              ).map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSimBudget(tier.id)}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    simBudget === tier.id
                      ? 'bg-emerald-700/40 border-emerald-400 text-white font-bold ring-2 ring-emerald-500/50'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                    {tier.id.replace('_', ' ')}
                  </div>
                  <div className="text-xs sm:text-sm">{isBn ? tier.bn : tier.en}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Domain Status Interactive Toggles */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>{isBn ? '১০টি ডোমেনের অবস্থা পরিবর্তন করুন:' : 'Adjust 10 Biosecurity Domain Responses:'}</span>
              <span className="text-xs font-normal text-slate-500">
                {isBn ? 'ক্লিক করে তাৎক্ষণিক পরিবর্তন দেখুন' : 'Click to toggle response and re-evaluate'}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BIOSECURITY_DOMAINS.map((dom) => {
                const currentResp = simAnswers[dom.id] || 'good';
                return (
                  <div
                    key={dom.id}
                    className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">#{dom.order}</span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                          {isBn ? dom.titleBn : dom.titleEn}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium uppercase ${
                          dom.riskSeverity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : dom.riskSeverity === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {dom.riskSeverity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSimResponseToggle(dom.id, 'good')}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          currentResp === 'good'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isBn ? 'ভালো' : 'Good'}
                      </button>
                      <button
                        onClick={() => handleSimResponseToggle(dom.id, 'partial')}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          currentResp === 'partial'
                            ? 'bg-amber-500 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isBn ? 'আংশিক' : 'Partial'}
                      </button>
                      <button
                        onClick={() => handleSimResponseToggle(dom.id, 'missing')}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          currentResp === 'missing'
                            ? 'bg-red-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isBn ? 'ঘাটতি' : 'Missing'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulation Output */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>
                    {isBn
                      ? `সিমুলেশন ফলাফল: শীর্ষ ৩টি করণীয় (${simBudget} বাজেট)`
                      : `Simulation Output: Top-3 Actions (${simBudget.toUpperCase()} Budget)`}
                  </span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isBn
                    ? 'হিউরিস্টিক ইঞ্জিন দ্বারা নির্বাচিত সর্বোচ্চ অগ্রাধিকারের সমাধান'
                    : 'Prioritized according to severity score and farmer resource bounds'}
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                {simulationResult.actions.length} {isBn ? 'টি কাজ নির্ধারিত' : 'Actions Prioritized'}
              </span>
            </div>

            {simulationResult.actions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                {isBn ? 'কোনো দুর্বলতা চিহ্নিত করা হয়নি।' : 'No weaknesses selected to generate actions.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simulationResult.actions.map((act, i) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                          #{i + 1}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            act.riskCategory === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {act.riskCategory}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mb-1.5">
                        {isBn ? act.titleBn : act.titleEn}
                      </h5>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                        {isBn ? act.whyRecommendedBn : act.whyRecommendedEn}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>{isBn ? 'খরচ:' : 'Cost:'}</span>
                        <span className="font-semibold text-slate-700 capitalize">{act.costCategory}</span>
                      </div>
                      {act.deferredAlternativeBn && (
                        <div className="text-[11px] text-indigo-700 bg-indigo-50 p-1.5 rounded mt-1.5">
                          <strong>{isBn ? 'বিকল্প স্থগিত:' : 'Deferred:'} </strong>
                          {isBn ? act.deferredAlternativeBn : act.deferredAlternativeEn}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM ARCHITECTURE & SCIENTIFIC BOUNDARIES */}
      {activeTab === 'system_architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Why Rule-Based Heuristic Engine? */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'কেন রুল-ভিত্তিক হিউরিস্টিক ইঞ্জিন? (Why Deterministic Rules?)' : 'Why a Deterministic Heuristic Engine?'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isBn
                  ? 'কৃষি ও প্রাণী স্বাস্থ্যের ক্ষেত্রে এআই মডেলের "হ্যালুসিনেশন" বা ভুল ওষুধ নির্দেশ মারাত্মক ক্ষতির কারণ হতে পারে। খামার সুরক্ষা সচেতনভাবে একটি স্বচ্ছ, অডিটেবল নিয়ম-ভিত্তিক আর্কিটেকচার গ্রহণ করেছে:'
                  : 'In livestock health, generative AI hallucinations or drug dosing errors can decimate smallholder livelihoods. Khamar Shurokkha deliberately uses an auditable, deterministic expert heuristic pipeline:'}
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{isBn ? 'ভেটেরিনারি দায়বদ্ধতা:' : 'Veterinary Accountability:'}</strong>{' '}
                    {isBn
                      ? 'প্রতিটি নিয়ম প্রাণিসম্পদ অধিদপ্তর (DLS) ও বিশ্ব প্রাণী স্বাস্থ্য সংস্থা (WOAH)-এর নির্দেশিকা অনুসরণ করে।'
                      : 'Rules align with official DLS and WOAH biosecurity benchmarks.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{isBn ? 'অফলাইন ও লো-ব্যান্ডউইথ:' : 'Offline Execution:'}</strong>{' '}
                    {isBn
                      ? 'কোনো ক্লাউড এপিআই বা জিপিইউ ছাড়া সাধারণ স্মার্টফোনে তাৎক্ষণিক ফলাফল প্রদর্শন।'
                      : 'Executes locally on low-cost smartphones without internet latency.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{isBn ? 'জিরো অ্যান্টিবায়োটিক প্রেসক্রিপশন:' : 'Zero Antibiotic Prescriptions:'}</strong>{' '}
                    {isBn
                      ? 'চিকিৎসা নয়, শুধুমাত্র পরিবেশগত ও কাঠামোগত জীব-নিরাপত্তা প্রতিরোধমূলক সহায়তা।'
                      : 'Exclusively focuses on non-medicinal biosecurity and environmental hygiene.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Box 2: Rigorous Boundaries & Research Disclaimers */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {isBn ? 'বৈজ্ঞানিক সততা ও প্রোটোটাইপের সীমাবদ্ধতা' : 'Scientific Rigor & Prototype Boundaries'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isBn
                  ? 'প্রতিযোগিতা বিচারক এবং বিশেষজ্ঞদের কাছে সততার সাথে তুলে ধরা জরুরি যে কোন বিষয়গুলো এখনো প্রোটোটাইপ বা সিমুলেশন পর্যায়ে রয়েছে:'
                  : 'For academic advisors and competition judges, we transparently state current implementation boundaries:'}
              </p>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <strong className="text-amber-900 block mb-0.5">
                    {isBn ? '১. কোনো লাইভ সরকারি DLS সংযোগ নেই:' : '1. No Live Government DLS Integration:'}
                  </strong>
                  <span>
                    {isBn
                      ? 'বর্তমান ডেমোতে প্রদর্শিত সরকারি এলার্ট ও নোটিফিকেশন গবেষণা আর্কিটেকচার প্রদর্শনের জন্য সিমুলেটেড।'
                      : 'DLS automated escalation is currently simulated for UX validation; live API endpoints require government MoFL memorandum.'}
                  </span>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <strong className="text-amber-900 block mb-0.5">
                    {isBn ? '২. কোনো স্বয়ংক্রিয় ক্লিনিকাল রোগ নির্ণয় নয়:' : '2. No Autonomous Disease Diagnosis:'}
                  </strong>
                  <span>
                    {isBn
                      ? 'অসুস্থ পাখি দেখলে তৎক্ষণাৎ স্থানীয় রেজিস্টার্ড পশু চিকিৎসকের শরণাপন্ন হতে বলা হয়; কোনো ডিজিটাল ডায়াগনসিস দাবি করা হয়নি।'
                      : 'The app never diagnoses Newcastle disease, Bird Flu, or Gumboro from symptoms. It mandates human veterinarian consultation.'}
                  </span>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <strong className="text-amber-900 block mb-0.5">
                    {isBn ? '৩. স্থানীয় উপাদান কার্যকারিতা গবেষণা প্রয়োজন:' : '3. Field Trial Validation Pending:'}
                  </strong>
                  <span>
                    {isBn
                      ? 'ব্লিচিং ও চুনের সঠিক কার্যকারিতা তাপমাত্রা ও আর্দ্রতার ওপর নির্ভর করে যা উপজেলাভিত্তিক ফিল্ড ট্রায়ালে পরিমাপযোগ্য।'
                      : 'Efficacy metrics for local lime footbaths under high humidity require localized controlled microbiological trial validation.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
