import React, { useState } from 'react';
import {
  RegionalAlert,
  WeatherInfo,
  HealthEventReport,
  AnimalProfile,
  FlockProfile,
  FarmProfile,
  Language,
  ActionPlanItem,
  NavScreen,
} from '../types';
import { toBanglaNum } from '../translations';
import { protectionSignalService } from '../services/protectionSignalService';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  Radio,
  CloudSun,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  MapPin,
  Clock,
  Thermometer,
  Droplets,
  HelpCircle,
  X,
  FileText,
  Filter,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles,
  Info,
  HeartPulse,
} from 'lucide-react';

interface RegionalAlertsScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  alerts: RegionalAlert[];
  weather: WeatherInfo;
  healthEvents: HealthEventReport[];
  existingActions?: ActionPlanItem[];
  lang: Language;
  onSubmitHealthEvent: (event: HealthEventReport) => void;
  onConvertAlertToAction?: (action: ActionPlanItem) => void;
  onNavigate?: (screen: NavScreen) => void;
}

interface DLSGuidelineItem {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  sourceAuthority: string;
  refDocNo: string;
  effectiveYear: string;
  speciesList: string;
  summaryBn: string;
  summaryEn: string;
  directivesBn: string[];
  directivesEn: string[];
}

const CURATED_DLS_GUIDELINES: DLSGuidelineItem[] = [
  {
    id: 'dls_fmd_lsd_protocol_2026',
    titleBn: 'লাম্পি স্কিন ডিজিজ (LSD) ও খুরারোগ (FMD) নিয়ন্ত্রণ প্রটোকল',
    titleEn: 'LSD & FMD National Control & Biosecurity Protocol',
    categoryBn: 'রোগ নিয়ন্ত্রণ ও জীবনিরাপত্তা',
    categoryEn: 'Disease Control & Biosecurity',
    sourceAuthority: 'প্রাণিসম্পদ অধিদপ্তর (DLS), প্রাণিসম্পদ ও ডেইরি উন্নয়ন প্রকল্প (LDDP)',
    refDocNo: 'DLS/VPH/PROT-2026/04',
    effectiveYear: '২০২৬-২০২৭',
    speciesList: 'গরু, মহিষ, ছাগল, ভেড়া',
    summaryBn: 'মৌসুমী খুরারোগ ও লাম্পি স্কিন ডিজিজের প্রাদুর্ভাব প্রতিরোধে খামারীদের করণীয় বায়ো-এক্সক্লুশন ও প্রাথমিক লক্ষণ নজরদারির সরকারি কারিগরি প্রটোকল।',
    summaryEn: 'Official technical protocol for dairy and beef farmers regarding bio-exclusion and symptom surveillance.',
    directivesBn: [
      'নতুন পশু ক্রয়ের পর বাধ্যতামূলক ২১ দিন পৃথক কোয়ারেন্টাইন শেডে পালন করতে হবে।',
      'শেডের মূল প্রবেশদ্বারে তাজা পটাশিয়াম পারম্যাঙ্গানেট বা ৪% সোডা দ্রবণের ফুটবাথ নিয়মিত রিফ্রেশ করতে হবে।',
      'মশা-মাছি ও আটালি (ভেক্টর) নিয়ন্ত্রণে শেডের চারপাশ পরিষ্কার রাখা ও অনুমোদিত রিপেলেন্ট ব্যবহার আবশ্যক।',
      'রোগাক্রান্ত প্রাণীকে সুস্থ প্রাণী থেকে অবিলম্বে পৃথক করে উপজেলা ভেটেরিনারি সার্জনকে অবহিত করতে হবে।',
    ],
    directivesEn: [
      'Mandatory 21-day quarantine for all newly purchased ruminants.',
      'Maintain fresh disinfectant footbaths (potash or soda solution) at barn entrances.',
      'Vector control: eliminate standing puddles and apply approved fly repellents.',
      'Immediately isolate symptomatic stock and notify Upazila Livestock Officer.',
    ],
  },
  {
    id: 'dls_poultry_vaccine_coldchain',
    titleBn: 'বাণিজ্যিক ও পারিবারিক পোল্ট্রির কোল্ড-চেইন ও টিকাদান গাইডলাইন',
    titleEn: 'Poultry Cold-Chain & Vaccination Standard Operating Procedure',
    categoryBn: 'ভ্যাকসিন ব্যবস্থাপনা',
    categoryEn: 'Vaccine Management',
    sourceAuthority: 'প্রাণিসম্পদ গবেষণা প্রতিষ্ঠান (LRI), মহাখালী, ঢাকা ও DLS',
    refDocNo: 'LRI/BIO/SOP-11/2025',
    effectiveYear: '২০২৫-২০২৬',
    speciesList: 'ব্রয়লার, লেয়ার, সোনালী, দেশি মুরগি, হাঁস',
    summaryBn: 'রানীক্ষেত (ND), গামবোরো (IBD) ও ডাক প্লেগ ভ্যাকসিনের কার্যকারিতা বজায় রাখতে ২-৮° সেলসিয়াস তাপমাত্রা সংরক্ষণ ও সঠিক পানি মিশিয়ে পান করানোর নিয়ম।',
    summaryEn: 'Guidelines on maintaining 2-8°C vaccine cold chain and proper diluent mixing for ND and IBD vaccines.',
    directivesBn: [
      'ভ্যাকসিন ফ্লাস্ক বা বরফ ভর্তি থার্মোফ্লাস্কে ২° থেকে ৮°C তাপমাত্রায় দ্রুত খামারে পরিবহন করতে হবে।',
      'ক্লোরিনমুক্ত ঠান্ডা টিউবওয়েল বা ফিল্টার পানিতে ভ্যাকসিনের সাথে স্কিমড মিল্ক পাউডার (২.৫ গ্রাম/লিটার) মিশিয়ে দিতে হবে।',
      'ভ্যাকসিন মিশ্রিত পানি তৈরির সর্বোচ্চ ২ ঘণ্টার মধ্যে পাখিকে সম্পূর্ণ পান করাতে হবে।',
      'অসুস্থ বা তীব্র স্ট্রেসগ্রস্ত ঝাঁকে কোনো অবস্থাতেই জীবন্ত লাইভ ভ্যাকসিন প্রয়োগ নিষেধ।',
    ],
    directivesEn: [
      'Transport vaccines in ice-packed coolers at 2° to 8°C.',
      'Use chlorine-free cool water with skimmed milk powder (2.5 g/L) as stabilizer.',
      'Administer reconstituted vaccine water within maximum 2 hours.',
      'Never vaccinate diseased or heavily stressed poultry batches.',
    ],
  },
  {
    id: 'dls_flood_feed_silage',
    titleBn: 'বন্যা ও বর্ষাকালীন নিরাপদ পশুখাদ্য ও সাইলেজ সংরক্ষণ নির্দেশিকা',
    titleEn: 'Disaster & Rainy Season Feed Safety & Silage Preservation',
    categoryBn: 'খাদ্য ও পুষ্টি নিরাপত্তা',
    categoryEn: 'Feed & Nutrition Safety',
    sourceAuthority: 'বাংলাদেশ প্রাণিসম্পদ গবেষণা ইনস্টিটিউট (BLRI) ও DLS',
    refDocNo: 'BLRI/FEED-SURV/2025',
    effectiveYear: '২০২৫-২০২৬',
    speciesList: 'গবাদিপশু',
    summaryBn: 'স্যাঁতসেঁতে আবহাওয়ায় কাঁচা ঘাস ও দানাদার খাবারে আফলাটক্সিন ছত্রাক আক্রমণ প্রতিরোধ এবং জরুরি সময়ে সবুজ ঘাসের ঘাটতি পূরণে ব্যাগ সাইলেজের ব্যবহার।',
    summaryEn: 'Management of aflatoxin molds in stored feed and utilization of bunker or bag silage during wet months.',
    directivesBn: [
      'ছত্রাক ও মাইকোটক্সিনযুক্ত পচা খড় বা ভেজা দানাদার খাদ্য কখনো পশু বা পাখিকে খাওয়ানো যাবে না।',
      'বর্ষা মৌসুমের আগে উঁচু মাচায় শুকনো খড় সংরক্ষণ এবং প্লাস্টিক ড্রামে বা ব্যাগে সাইলেজ প্রস্তুত রাখুন।',
      'খাবারের পাত্র দৈনিক পরিষ্কার করে রোদে শুকাতে হবে যাতে ছত্রাকের বিস্তার না ঘটে।',
    ],
    directivesEn: [
      'Never feed mold-contaminated or wet grain to cattle or poultry.',
      'Store dry straw on elevated platforms and prepare silage bags before rainy season.',
      'Clean and dry feeding troughs daily to prevent fungal colonization.',
    ],
  },
];

export const RegionalAlertsScreen: React.FC<RegionalAlertsScreenProps> = ({
  farm,
  animals,
  flocks,
  alerts,
  weather,
  healthEvents,
  existingActions = [],
  lang,
  onSubmitHealthEvent,
  onConvertAlertToAction,
  onNavigate,
}) => {
  const isBn = lang === 'bn';

  // 4 Master Tabs
  const [activeTab, setActiveTab] = useState<'alerts' | 'dls_guidance' | 'weather' | 'farm_reports'>('alerts');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [actionAddedToast, setActionAddedToast] = useState<string | null>(null);

  // Health report form state
  const [reportTargetId, setReportTargetId] = useState<string>(animals[0]?.id || flocks[0]?.id || '');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [reportDescription, setReportDescription] = useState('');
  const [reportSeverity, setReportSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');

  // Filter farm health reports: strictly private to current farm
  const farmHealthReports = healthEvents.filter((e) => e.farmId === farm.id);

  const commonSymptomOptions = [
    { bn: 'ক্ষুধামন্দা / খাবার কম খাওয়া', en: 'Loss of appetite' },
    { bn: 'জাবর কাটার গতি ধীর', en: 'Slow rumination' },
    { bn: 'পাতলা পায়খানা / ডায়রিয়া', en: 'Diarrhea' },
    { bn: 'মুখ দিয়ে অতিরিক্ত লালা পড়া', en: 'Excessive salivation' },
    { bn: 'গায়ে জ্বর বা অতিরিক্ত গরম ভাব', en: 'Fever' },
    { bn: 'খোঁড়ানো বা পায়ে ব্যথা', en: 'Lameness' },
    { bn: 'শ্বাসকষ্ট বা হাঁচি-কাশি', en: 'Respiratory distress' },
    { bn: 'দুধ উৎপাদন অস্বাভাবিক কমে যাওয়া', en: 'Sudden drop in milk' },
  ];

  const handleToggleSymptom = (symBn: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symBn) ? prev.filter((s) => s !== symBn) : [...prev, symBn]
    );
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAnimal = animals.find((a) => a.id === reportTargetId);
    const targetFlock = flocks.find((f) => f.id === reportTargetId);

    const newEvent: HealthEventReport = {
      id: `evt_${Date.now()}`,
      farmId: farm.id,
      targetType: targetAnimal ? 'animal' : 'flock',
      targetId: reportTargetId,
      species: targetAnimal ? targetAnimal.species : targetFlock ? targetFlock.poultryType : 'cattle',
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['অস্বাভাবিক লক্ষণ'],
      description: reportDescription || 'খামারি কর্তৃক প্রাথমিক উপসর্গ পর্যবেক্ষণ।',
      severity: reportSeverity,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'reported',
    };

    onSubmitHealthEvent(newEvent);
    setIsReportModalOpen(false);
    setSelectedSymptoms([]);
    setReportDescription('');
  };

  const handleConvertAlert = (alert: RegionalAlert) => {
    const signal = protectionSignalService.evaluateDiseaseAlert(alert, farm, animals, flocks);
    if (!signal) return;

    if (signal.eligibilityStatus === 'eligible_action') {
      const action = protectionSignalService.convertSignalToBioShieldAction(signal);
      if (onConvertAlertToAction) {
        onConvertAlertToAction(action);
        setActionAddedToast(
          isBn
            ? `সতর্কবার্তা থেকে বায়োশিল্ড অ্যাকশন যুক্ত হয়েছে: "${action.titleBn}"`
            : `Added to BioShield Action Planner: "${action.titleEn}"`
        );
        setTimeout(() => setActionAddedToast(null), 4000);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {actionAddedToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-2xl flex items-center gap-3 border border-emerald-400/40 text-xs font-bold animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionAddedToast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 1: UNIFIED HEADER BANNER                          */}
      {/* ========================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-blue-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="hidden sm:block w-24 h-20 rounded-2xl overflow-hidden border border-blue-200 shrink-0 bg-blue-50">
            <ResilientImage
              src={FARM_VISUAL_ASSETS.waterFeedCare}
              alt={isBn ? 'পরিচ্ছন্ন পানি ও নিরাপদ খামার ব্যবস্থা' : 'Clean farm water and feed management'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>{isBn ? 'সমন্বিত খামার তথ্য ও রোগ নজরদারি কেন্দ্র' : 'Integrated Farm Information Hub'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {isBn ? 'খামারের সতর্কতা ও তথ্য' : 'Farm Alerts & Information'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {isBn
                ? `${farm.upazila}, ${farm.district} ও জাতীয় পর্যায়ের অনুমোদিত ভেটেরিনারি পরামর্শ, সরকারি নোটিশ, আবহাওয়া প্রস্তুতি ও খামার স্বাস্থ্য পর্যবেক্ষণ।`
                : `Official veterinary notices, curated DLS protocols, weather preparedness, and farm observations for ${farm.upazila}, ${farm.district}.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="min-h-[46px] px-4 py-2.5 rounded-2xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-extrabold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-red-100" />
            <span>{isBn ? 'স্বাস্থ্য সমস্যা জানান' : 'Report Health Event'}</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: CONSOLIDATED 4-TAB NAVIGATION                   */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {/* Tab 1: Disease Alerts */}
        <button
          onClick={() => setActiveTab('alerts')}
          className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-400" />
          <span>{isBn ? 'রোগের সতর্কতা (Disease Alerts)' : 'Disease Alerts'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono tabular-nums">
            {toBanglaNum(alerts.length, lang)}
          </span>
        </button>

        {/* Tab 2: DLS Guidance */}
        <button
          onClick={() => setActiveTab('dls_guidance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'dls_guidance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>{isBn ? 'ডিএলএস দিকনির্দেশনা (DLS Guidance)' : 'DLS Guidance'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
            {toBanglaNum(CURATED_DLS_GUIDELINES.length, lang)}
          </span>
        </button>

        {/* Tab 3: Weather */}
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'weather'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CloudSun className="w-4 h-4 text-sky-400" />
          <span>{isBn ? 'আবহাওয়া ও ঋতুভিত্তিক প্রস্তুতি (Weather)' : 'Weather & Seasonal'}</span>
        </button>

        {/* Tab 4: Farm Health Reports */}
        <button
          onClick={() => setActiveTab('farm_reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'farm_reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>{isBn ? 'খামার স্বাস্থ্য রিপোর্ট (Farm Reports)' : 'Farm Health Reports'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
            {toBanglaNum(farmHealthReports.length, lang)}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: REGIONAL DISEASE ALERTS                            */}
      {/* ========================================================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Honest Alert Verification Legend */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-bold text-slate-800">
                {isBn ? 'স্বচ্ছ ভেরিফিকেশন মানদণ্ড:' : 'Verification Standard:'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px] border border-rose-200">
                {isBn ? 'সরকারি DLS নোটিশ' : 'Official DLS'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] border border-teal-200">
                {isBn ? 'ভেটেরিনারি যাচাইকৃত' : 'Vet Verified'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                {isBn ? 'পর্যালোচনাধীন (অপ্রমাণিত)' : 'Under Review'}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {isBn
                  ? 'অযাচাইকৃত রিপোর্ট কখনোই স্বয়ংক্রিয় প্রাদুর্ভাব হিসেবে দেখানো হয় না।'
                  : 'Unverified observations are never shown as confirmed outbreaks.'}
              </span>
            </div>
          </div>

          {/* Alert Cards */}
          <div className="space-y-4">
            {alerts.map((alert) => {
              const signal = protectionSignalService.evaluateDiseaseAlert(alert, farm, animals, flocks);
              const isEligibleForBioShield = signal?.eligibilityStatus === 'eligible_action';
              const isUnderReview = alert.verificationStatus === 'under_review';

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs space-y-4 transition-all ${
                    alert.severity === 'emergency' || alert.severity === 'warning'
                      ? 'border-rose-200 ring-2 ring-rose-500/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] px-3 py-0.5 rounded-full font-bold uppercase ${
                          alert.verificationStatus === 'official_dls'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : alert.verificationStatus === 'verified'
                            ? 'bg-teal-100 text-teal-800 border border-teal-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {alert.verificationStatus === 'official_dls'
                          ? isBn ? 'সরকারি DLS নোটিশ' : 'Official Notice'
                          : alert.verificationStatus === 'verified'
                          ? isBn ? 'ভেটেরিনারি যাচাইকৃত' : 'Vet Verified'
                          : isBn ? 'পর্যালোচনাধীন রিপোর্ট' : 'Under Review'}
                      </span>

                      <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{alert.upazila}, {alert.district}</span>
                      </span>

                      <span className="text-xs text-slate-400">·</span>

                      <span className="text-xs text-slate-600">
                        {isBn ? 'আক্রান্ত প্রজাতি:' : 'Species:'} {alert.species.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alert.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {isBn ? alert.titleBn : alert.titleEn}
                    </h3>
                    <div className="text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                      <span>{isBn ? 'কর্তৃপক্ষ / তথ্যসূত্র: ' : 'Source Authority: '}</span>
                      <span className="text-slate-700 font-semibold">{alert.source}</span>
                    </div>
                  </div>

                  {/* Precautions Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>{isBn ? 'অনুমোদিত সুরক্ষামূলক করণীয় পদক্ষেপ:' : 'Recommended Protective Measures:'}</span>
                    </h4>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      {(isBn ? alert.recommendedPrecautionsBn : alert.recommendedPrecautionsEn).map((p, i) => (
                        <li key={i} className="leading-relaxed">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alert-to-BioShield Action Integration CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      {isUnderReview ? (
                        <span className="text-amber-800 font-medium">
                          {isBn
                            ? '⚠️ এটি প্রাথমিক পর্যবেক্ষণ রিপোর্ট; সরকারি ভেটেরিনারি নিশ্চিতকরণ না হওয়া পর্যন্ত বাধ্যতামূলক নির্দেশনা প্রযোজ্য নয়।'
                            : '⚠️ Preliminary report under investigation; clinical action is deferred pending official verification.'}
                        </span>
                      ) : (
                        <span className="text-slate-600">
                          {isBn
                            ? 'যাচাইকৃত রোগ সতর্কবার্তা আপনার খামারের প্রটেকশন প্ল্যানারে স্বয়ংক্রিয়ভাবে সুরক্ষামূলক কাজ তৈরি করতে পারে।'
                            : 'This verified advisory can generate protective biosecurity tasks in your Action Planner.'}
                        </span>
                      )}
                    </div>

                    {isEligibleForBioShield && onConvertAlertToAction && (() => {
                      const expectedId = `act_sig_alert_${alert.id}_${farm.id}`;
                      const alreadyAdded = existingActions.some(
                        (a) => a.id === expectedId || a.sourceAdvisoryId === alert.id
                      );
                      return alreadyAdded ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>{isBn ? 'করণীয় তালিকায় যুক্ত আছে' : 'Already in Action Plan'}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConvertAlert(alert)}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isBn ? 'BioShield করণীয় তালিকায় যোগ করুন' : 'Add to BioShield Action Plan'}</span>
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DLS OFFICIAL GUIDANCE                              */}
      {/* ========================================================= */}
      {activeTab === 'dls_guidance' && (
        <div className="space-y-4">
          {/* Institutional & NLAS Transparency Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
            <BookOpen className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-emerald-900">
                {isBn ? 'প্রাণিসম্পদ অধিদপ্তর (DLS) ও জাতীয় প্রাণিসম্পদ উপদেষ্টা ব্যবস্থা (NLAS) তথ্যসূত্র' : 'DLS & National Livestock Advisory System (NLAS) Context'}
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {isBn
                  ? 'এই নির্দেশনাবলী প্রাণিসম্পদ অধিদপ্তর (DLS) ও NLAS মানদণ্ডের আলোকে সংকলিত উদাহরণ। এখানে কোনো সরকারি লাইভ এপিআই সংযোগ দাবি করা হয়নি; ভবিষ্যৎ সরকারি সমন্বয়ের জন্য কাঠামো প্রস্তুত রাখা হয়েছে।'
                  : 'Curated guidance reflecting DLS & NLAS advisory standards. No live government API connection is claimed; the integration structure is ready for institutional linkage.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {CURATED_DLS_GUIDELINES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                      {isBn ? item.categoryBn : item.categoryEn}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {isBn ? 'ডকুমেন্ট নং:' : 'Ref:'} {item.refDocNo}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    {isBn ? 'কার্যকরী বর্ষ:' : 'Validity:'} {item.effectiveYear}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {isBn ? item.titleBn : item.titleEn}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-800">
                    {isBn ? 'প্রকাশক কর্তৃপক্ষ: ' : 'Publishing Authority: '}
                    <span className="text-slate-700 font-normal">{item.sourceAuthority}</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    {isBn ? item.summaryBn : item.summaryEn}
                  </p>
                </div>

                {/* Directives List */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">
                    {isBn ? 'বাধ্যতামূলক মাঠপর্যায়ের নির্দেশনাসমূহ:' : 'Core Field Directives:'}
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                    {(isBn ? item.directivesBn : item.directivesEn).map((d, i) => (
                      <li key={i} className="leading-relaxed">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                  <span>{isBn ? 'প্রযোজ্য প্রজাতি:' : 'Applicable for:'} {item.speciesList}</span>
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'যাচাইকৃত নথি' : 'Verified Document'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: WEATHER & SEASONAL PREPAREDNESS                    */}
      {/* ========================================================= */}
      {activeTab === 'weather' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Demo Data Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">
                {isBn ? 'নমুনা / ডেমো আবহাওয়া ডাটা লেবেল:' : 'Sample Demonstration Weather Data:'}
              </strong>{' '}
              {isBn
                ? 'এটি পরীক্ষামূলক নমুনা আবহাওয়া তথ্য; কোনো লাইভ আবহাওয়া স্টেশন সংযোগ ছাড়াই প্রদর্শিত হচ্ছে। এর ওপর ভিত্তি করে কোনো স্বয়ংক্রিয় চিকিৎসা কর্ম সৃষ্টি হয় না।'
                : 'This is demonstration weather data presented without a live weather API integration. No automated veterinary treatments are triggered.'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <CloudSun className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {weather.district}
                </h3>
                <p className="text-xs text-slate-600">{weather.condition}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-black text-slate-900 font-mono">
                {toBanglaNum(weather.temp, lang)}°C
              </div>
              <div className="text-xs text-slate-500">
                {isBn ? 'সর্বশেষ আপডেট:' : 'Updated:'} {weather.lastUpdated}
              </div>
            </div>
          </div>

          {/* Environmental Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <span className="text-xs font-semibold text-sky-800">
                {isBn ? 'বাতাসের আর্দ্রতা' : 'Relative Humidity'}
              </span>
              <div className="text-2xl font-black text-sky-950 mt-1 font-mono">
                {toBanglaNum(weather.humidity, lang)}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-xs font-semibold text-blue-800">
                {isBn ? 'বৃষ্টিপাতের সম্ভাবনা' : 'Rain Probability'}
              </span>
              <div className="text-2xl font-black text-blue-950 mt-1 font-mono">
                {toBanglaNum(weather.rainProbability, lang)}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs font-semibold text-amber-800">
                {isBn ? 'হিট-স্ট্রেস ঝুঁকি' : 'Heat Stress Index'}
              </span>
              <div className="text-2xl font-black text-amber-950 mt-1 capitalize">
                {isBn ? 'মাঝারি ঝুঁকি' : weather.heatStressIndex}
              </div>
            </div>
          </div>

          {/* Farm-Management Precautions */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isBn ? 'অনুমোদিত খামার ব্যবস্থাপনা ও পশু পরিচর্যা টিপস:' : 'Weather-Driven Management Guidance:'}</span>
            </h4>
            <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
              {(isBn ? weather.managementTipsBn : weather.managementTipsEn).map((t, idx) => (
                <li key={idx} className="leading-relaxed">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FARM HEALTH REPORTS (PRIVATE OBSERVATIONS)         */}
      {/* ========================================================= */}
      {activeTab === 'farm_reports' && (
        <div className="space-y-4">
          {/* Privacy & Professional Care Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3 shadow-xs">
            <HelpCircle className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">
                {isBn ? 'খামার স্বাস্থ্য রিপোর্ট ও তথ্য সুরক্ষা' : 'Farm Health Observations & Privacy Policy'}
              </h4>
              <p className="leading-relaxed text-slate-600">
                {isBn
                  ? 'আপনার দাখিলকৃত রিপোর্ট শুধুমাত্র আপনার খামারের স্বাস্থ্য ইতিহাস ও সংশ্লিষ্ট চিকিৎসকের কাছে সংরক্ষিত থাকে। কোনো অবস্থাতেই অপর খামারির কাছে আপনার ব্যক্তিগত তথ্য বা খামারের অবস্থান প্রকাশ করা হয় না।'
                  : 'Your reports are securely kept for your farm records and authorized veterinary referral. Identifiable farm information is never broadcast to the public.'}
              </p>
            </div>
          </div>

          {farmHealthReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                {isBn ? 'আপনার খামারে বর্তমানে কোনো সক্রিয় অসুস্থতার রিপোর্ট নেই।' : 'No active sickness reports for this farm.'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {isBn
                  ? 'পশুর অস্বাভাবিক লক্ষণ বা রোগলক্ষণ দেখা দিলে উপরে "স্বাস্থ্য সমস্যা জানান" বাটনে ক্লিক করে রিপোর্ট করুন।'
                  : 'If you notice signs of illness or unusual symptoms in any animal, report them here for record-keeping and consultation.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {farmHealthReports.map((evt) => {
                const isVerified = evt.status === 'verified';

                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {evt.targetId} ({evt.species})
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isVerified
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isVerified
                            ? isBn ? 'ভেটেরিনারি সার্জন কর্তৃক পরীক্ষিত' : 'Vet Verified'
                            : isBn ? 'পর্যালোচনাধীন (স্ব-প্রতিবেদন)' : 'Farmer Reported (Under Review)'}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500 font-mono">
                        {evt.reportedDate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800">
                      <strong className="text-slate-900">{isBn ? 'শনাক্তকৃত লক্ষণ:' : 'Observed Symptoms:'}</strong>{' '}
                      {evt.symptoms.join(', ')}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {evt.description}
                    </p>

                    {evt.vetNotes && (
                      <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-teal-900">
                          <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
                          <span>
                            {isBn ? 'ভেটেরিনারি সার্জন পর্যালোচনা নোট:' : 'Veterinary Surgeon Notes:'}{' '}
                            <span className="font-semibold text-slate-700">({evt.reviewedByVet})</span>
                          </span>
                        </div>
                        <p className="leading-relaxed">{evt.vetNotes}</p>
                      </div>
                    )}

                    {onNavigate && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onNavigate('vet_services')}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                          <span>{isBn ? 'পশু চিকিৎসকের পরামর্শ অনুরোধ করুন' : 'Request Vet Referral'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUBMIT HEALTH EVENT REPORT                         */}
      {/* ========================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                <span>{isBn ? 'স্বাস্থ্য সমস্যা বা লক্ষণ রিপোর্ট করুন' : 'Report Farm Health Observation'}</span>
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'আক্রান্ত প্রাণী বা ফ্লক *' : 'Affected Stock *'}
                </label>
                <select
                  value={reportTargetId}
                  onChange={(e) => setReportTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <optgroup label={isBn ? 'গবাদি প্রাণীসমূহ' : 'Animals'}>
                    {animals.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nameOrTag} ({a.id}) - {a.species}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={isBn ? 'পোল্ট্রি ঝাঁক' : 'Flocks'}>
                    {flocks.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.batchName} ({f.id}) - {f.poultryType}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Symptom Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {isBn ? 'প্রধান দৃশ্যমান লক্ষণসমূহ নির্বাচন করুন:' : 'Observed Symptoms:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptomOptions.map((sym, idx) => {
                    const isChecked = selectedSymptoms.includes(sym.bn);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleToggleSymptom(sym.bn)}
                        className={`p-2 rounded-xl border text-left text-xs transition-colors flex items-center gap-2 ${
                          isChecked
                            ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </span>
                        <span className="text-[11px] leading-tight">{isBn ? sym.bn : sym.en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'তীব্রতার মাত্রা' : 'Severity'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setReportSeverity(sev)}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                        reportSeverity === sev
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isBn
                        ? sev === 'mild'
                          ? 'মৃদু'
                          : sev === 'moderate'
                          ? 'মাঝারি'
                          : 'তীব্র / জরুরি'
                        : sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'বিস্তারিত বর্ণনা (Description)' : 'Details'}
                </label>
                <textarea
                  rows={3}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder={isBn ? 'লক্ষণ শুরুর সময় ও বিবরণ লিখুন...' : 'Describe when symptoms started...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {isBn ? 'রিপোর্ট দাখিল করুন' : 'Submit Event Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
