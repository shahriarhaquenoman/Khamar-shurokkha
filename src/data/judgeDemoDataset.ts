import {
  FarmProfile,
  AnimalProfile,
  FlockProfile,
  ScheduledCareTask,
  CareRecord,
  HealthEventReport,
  VetConsultationRequest,
  RegionalAlert,
  AppNotification,
  AuditItemAnswer,
  ActionPlanItem,
  KhamarBondhuMessage,
  NavScreen,
} from '../types';
import { FarmerAccount } from '../services/authService';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';

export interface JudgeWalkthroughStep {
  stepNumber: number;
  screen: NavScreen;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  talkingPointBn: string;
  talkingPointEn: string;
}

export const JUDGE_WALKTHROUGH_STEPS: JudgeWalkthroughStep[] = [
  {
    stepNumber: 1,
    screen: 'dashboard',
    titleBn: 'আজকের খামারের কাজ (হোম)',
    titleEn: "Today's Farm Activities (Home)",
    subtitleBn: 'এক নজরে খামারের সর্বোচ্চ জরুরি কাজ ও কাজের অগ্রগতি',
    subtitleEn: 'Priority daily actions, worker assignments, and task progress at a glance',
    talkingPointBn:
      'খামারি অ্যাপ খুললেই প্রথমে দেখেন: "আজ আমার খামারে কী কী করণীয়?" — একটি মূল জরুরি কাজ, পরবর্তী ২টি সুপারিশ, এবং সহজ বাংলা প্রোগ্রেস মিটার।',
    talkingPointEn:
      'Opens directly to "What should I do today?" with one primary priority action, two upcoming steps, and a completion meter that never implies false immunity.',
  },
  {
    stepNumber: 2,
    screen: 'animals',
    titleBn: 'আমার খামার (প্রাণী ও পোল্ট্রি)',
    titleEn: 'My Farm (Animals & Flocks)',
    subtitleBn: 'প্রতিটি গরু, ছাগল ও পোল্ট্রি ব্যাচের ডিজিটাল আইডি ও স্বাস্থ্য রেকর্ড',
    subtitleEn: 'Digital Farm ID, Animal IDs, poultry batches, and QR identity cards',
    talkingPointBn:
      'মিশ্র খামারের প্রতিটি গরু-ছাগলের আলাদা ID ও মুরগির ব্যাচের Flock ID রয়েছে; এখান থেকেই সরাসরি টিকা, খামার বন্ধু ও ভেট রেফারেল শুরু করা যায়।',
    talkingPointEn:
      'Every animal has a trackable Animal ID and poultry flocks have Flock IDs, linking directly to preventive care, Khamar Bondhu, and veterinary requests.',
  },
  {
    stepNumber: 3,
    screen: 'biosecurity',
    titleBn: 'BioShield সুরক্ষা চক্র',
    titleEn: 'BioShield Protection Loop',
    subtitleBn: 'খুঁজে দেখি → আগে কোনটি? → কাজ ঠিক করি → কাজ করি ও জানাই',
    subtitleEn: 'Identify -> Prioritize -> Assign Worker -> Act & Feedback',
    talkingPointBn:
      'জটিল অডিটের বদলে ৪ ধাপের সহজ সুরক্ষা চক্র। খামারি কাজটি কর্মীদের (আবদুল মালেক / সালমা আক্তার) ভাগ করে দিতে পারেন এবং সম্পন্ন/সহায়তা প্রয়োজন জানাতে পারেন।',
    talkingPointEn:
      '4-stage farmer loop tailored to Bangladesh species and low-resource budgets, supporting worker delegation and honest 4-option completion feedback.',
  },
  {
    stepNumber: 4,
    screen: 'calendar',
    titleBn: 'টিকা ও যত্ন ক্যালেন্ডার',
    titleEn: 'Preventive Care Calendar',
    subtitleBn: 'খুরারোগ (FMD), পিপিআর, গামবোরো টিকা ও কৃমিনাশক সময়সূচি',
    subtitleEn: 'DLS-aligned vaccination and deworming reminders & logs',
    talkingPointBn:
      'বয়স ও প্রজাতি অনুযায়ী স্বয়ংক্রিয় টিকা ও কৃমিনাশক ক্যালেন্ডার; সম্পন্ন করলে ইতিহাস তৈরি হয় এবং পরবর্তী বুস্টার তারিখ সেট হয়।',
    talkingPointEn:
      'Species-specific vaccination and deworming schedules that auto-record history and compute subsequent booster due dates.',
  },
  {
    stepNumber: 5,
    screen: 'health_support',
    titleBn: 'স্বাস্থ্য সহায়তা ও খামার বন্ধু',
    titleEn: 'Health Support & Khamar Bondhu',
    subtitleBn: 'পশুচিকিৎসা রেফারেল, খামার সুরক্ষা যোগাযোগ ও খামার বন্ধু চ্যাট',
    subtitleEn: 'Vet consultation workflow, Khamar Shurokkha support & Khamar Bondhu',
    talkingPointBn:
      'অ্যাপে নিবন্ধিত পশুচিকিৎসকের পরামর্শ অনুরোধ (ডেমো ডিরেক্টরি), খামার সুরক্ষার নিজস্ব যোগাযোগ ও USSD সহায়তা এবং নিচের ডানদিকে সব পেজ থেকে খোলাযোগ্য খামার বন্ধু সহায়িকা যুক্ত রয়েছে।',
    talkingPointEn:
      'Combines transparent demo vet referral requests, Khamar Shurokkha own contact & USSD support info, and persistent Khamar Bondhu educational Q&A.',
  },
  {
    stepNumber: 6,
    screen: 'ussd_simulator',
    titleBn: 'ইন্টারনেট ছাড়া USSD সেবা',
    titleEn: 'Offline Access & USSD Simulator',
    subtitleBn: 'বেসিক বাটন ফোনের জন্য নমুনা USSD মেনু প্রোটোটাইপ',
    subtitleEn: 'Feature-phone offline workflow prototype (simulated short code)',
    talkingPointBn:
      'স্মার্টফোন বা ইন্টারনেট না থাকলে প্রান্তিক খামারি কীভাবে বাটন ফোনে আজকের কাজ ও টিকার তথ্য পাবেন তা এই ইন-ব্রাউজার প্রোটোটাইপ দেখায় (প্রকৃত টেলিকম কোড এখনো বরাদ্দ হয়নি)।',
    talkingPointEn:
      'Demonstrates the planned rural 2G feature-phone menu journey honestly labeled as an in-browser prototype awaiting telecom short-code integration.',
  },
  {
    stepNumber: 7,
    screen: 'knowledge_library',
    titleBn: 'সতর্কতা ও জ্ঞানভান্ডার (শিখি)',
    titleEn: 'Regional Alerts & Knowledge Library',
    subtitleBn: 'ছবিসহ সহজ বাংলা খামার গাইড ও প্রাদুর্ভাব সতর্কতা',
    subtitleEn: 'Illustrated Bengali farmer guides and regional outbreak advisories',
    talkingPointBn:
      'কম শিক্ষিত খামারিরাও যেন সহজে বুঝতে পারেন সেজন্য ছবিসহ ৬টি বিষয়ের বাংলা নির্দেশিকা এবং আঞ্চলিক সতর্কতা থেকে সরাসরি করণীয় তৈরির ব্যবস্থা রয়েছে।',
    talkingPointEn:
      'Six illustrated Bengali learning modules paired with regional advisories that can be converted directly into BioShield tasks.',
  },
];

const todayIso = new Date().toISOString().split('T')[0];
const plusDaysIso = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const JUDGE_DEMO_ACCOUNT: FarmerAccount = {
  uid: 'judge_demo_karim_01',
  displayName: 'মোঃ করিম উদ্দিন (বিচারক ডেমো)',
  phoneNumber: '01700-000999',
  preferredLanguage: 'bn',
  createdAt: '2026-09-01',
  isDemo: true,
};

export const JUDGE_DEMO_FARM: FarmProfile = {
  id: 'KS-JUDGE-01',
  ownerUid: 'judge_demo_karim_01',
  name: 'রুপালী বাংলা সমন্বিত খামার (নমুনা বিচারক খামার)',
  farmName: 'রুপালী বাংলা সমন্বিত খামার (নমুনা বিচারক খামার)',
  ownerName: 'মোঃ করিম উদ্দিন (নমুনা খামারি)',
  ownerPhone: '01700-000999',
  district: 'হবিগঞ্জ (Habiganj)',
  upazila: 'চুনারুঘাট (Chunarughat)',
  union: 'দেওরগাছ (Deorgachh)',
  farmTypes: ['dairy', 'goat', 'broiler', 'mixed'],
  farmType: 'mixed',
  speciesPresent: ['cattle', 'goat', 'chicken_broiler'],
  approximateHeadCount: 825,
  flockSize: 800,
  housingSystem: 'semi_controlled',
  productionSystem: 'semi_controlled',
  budgetCategory: 'low',
  availableResources: ['water_source', 'disinfectant', 'handwashing_facility'],
  registeredDate: '2026-09-01',
  photoUrl: FARM_VISUAL_ASSETS.farmHero,
  isDemo: true,
};

export const JUDGE_DEMO_ANIMALS: AnimalProfile[] = [
  {
    id: 'KS-JDG-CAT-01',
    farmId: 'KS-JUDGE-01',
    species: 'cattle',
    nameOrTag: 'পদ্মা সুন্দরী (Padma Sundori)',
    tagNumber: 'JDG-HBJ-101',
    breed: 'হলস্টাইন ফ্রিজিয়ান ক্রস (Friesian Cross)',
    sex: 'female',
    estimatedAgeMonths: 30,
    healthStatus: 'needs_attention',
    productionStage: 'milking',
    photoUrl: FARM_VISUAL_ASSETS.farmHero,
    notes: 'নমুনা ডেমো গাভী: দৈনিক ১২ লিটার দুধ দেয়। আজকের খুরারোগ (FMD) বুস্টার পর্যালোচনায় রয়েছে।',
    createdAt: '2026-09-01',
  },
  {
    id: 'KS-JDG-CAT-02',
    farmId: 'KS-JUDGE-01',
    species: 'cattle',
    nameOrTag: 'রাজা (Raja)',
    tagNumber: 'JDG-HBJ-102',
    breed: 'দেশী শাহীওয়াল (Shahiwal)',
    sex: 'male',
    estimatedAgeMonths: 22,
    healthStatus: 'healthy',
    productionStage: 'fattening',
    photoUrl: FARM_VISUAL_ASSETS.cattleGoat,
    notes: 'নমুনা ডেমো ষাঁড়: সবুজ ঘাস ও ভুষি নিয়মিত খাচ্ছে।',
    createdAt: '2026-09-05',
  },
  {
    id: 'KS-JDG-GOT-01',
    farmId: 'KS-JUDGE-01',
    species: 'goat',
    nameOrTag: 'কাজলী (Kajoli)',
    tagNumber: 'JDG-GOT-201',
    breed: 'ব্ল্যাক বেঙ্গল ছাগল (Black Bengal)',
    sex: 'female',
    estimatedAgeMonths: 14,
    healthStatus: 'healthy',
    productionStage: 'breeding',
    photoUrl: FARM_VISUAL_ASSETS.cattleGoat,
    notes: 'নমুনা ডেমো ছাগল: মাচা ঘরে পালিত, পিপিআর টিকা সম্পন্ন।',
    createdAt: '2026-09-10',
  },
];

export const JUDGE_DEMO_FLOCKS: FlockProfile[] = [
  {
    id: 'KS-JDG-FLK-01',
    farmId: 'KS-JUDGE-01',
    poultryType: 'chicken_broiler',
    batchName: 'সুরক্ষা ব্রয়লার ব্যাচ ০৭ (নমুনা)',
    initialBirdCount: 800,
    currentBirdCount: 794,
    placementDate: plusDaysIso(-12),
    ageDays: 12,
    sourceSupplier: 'ডেমো হ্যাচারি (Demo Supplier)',
    purpose: 'meat',
    housingType: 'litter_floor',
    mortalityCount: 6,
    healthStatus: 'normal',
    status: 'active',
    notes: 'লিটার শুকনো রাখতে প্রতিদিন দুপুর ও সকালে পর্দা নিয়ন্ত্রণ করা হয়। দায়িত্বে: সালমা আক্তার।',
    createdAt: plusDaysIso(-12),
  },
];

export const JUDGE_DEMO_TASKS: ScheduledCareTask[] = [
  {
    id: 'jdg_task_01',
    farmId: 'KS-JUDGE-01',
    targetType: 'animal',
    targetId: 'KS-JDG-CAT-01',
    targetName: 'পদ্মা সুন্দরী (KS-JDG-CAT-01)',
    species: 'cattle',
    careType: 'vaccination',
    titleBn: 'খুরারোগ (FMD) ষাণ্মাসিক বুস্টার টিকা — দায়িত্বে: আবদুল মালেক',
    titleEn: 'FMD Booster Vaccination — Assigned: Abdul Malek',
    descriptionBn: 'দুগ্ধবতী গাভীর খুরারোগ প্রতিরোধে নির্ধারিত সরকারি টিকা প্রয়োগ।',
    descriptionEn: 'Scheduled preventive FMD booster for dairy cattle.',
    protocolId: 'proto_cattle_fmd',
    dueDate: plusDaysIso(1),
    status: 'due_soon',
    productName: 'DLS দ্বি-বার্ষিক FMD ভ্যাকসিন',
  },
  {
    id: 'jdg_task_02',
    farmId: 'KS-JUDGE-01',
    targetType: 'flock',
    targetId: 'KS-JDG-FLK-01',
    targetName: 'সুরক্ষা ব্রয়লার ব্যাচ ০৭ (KS-JDG-FLK-01)',
    species: 'chicken_broiler',
    careType: 'vaccination',
    titleBn: 'গামবোরো (IBD) প্রথম ডোজ — দায়িত্বে: সালমা আক্তার',
    titleEn: 'Gumboro (IBD) Day-12 Dose — Assigned: Salma Akter',
    descriptionBn: '১২ দিন বয়সী ব্রয়লার ফ্লকের জন্য পরিষ্কার পানিতে গামবোরো টিকা প্রয়োগ।',
    descriptionEn: 'Administer IBD vaccine via clean chlorine-free drinking water.',
    protocolId: 'proto_broiler_ibd',
    dueDate: todayIso,
    status: 'overdue',
    productName: 'লাইভ IBD ভ্যাকসিন (নমুনা)',
  },
  {
    id: 'jdg_task_03',
    farmId: 'KS-JUDGE-01',
    targetType: 'animal',
    targetId: 'KS-JDG-GOT-01',
    targetName: 'কাজলী (KS-JDG-GOT-01)',
    species: 'goat',
    careType: 'deworming',
    titleBn: 'ছাগলের ৩ মাস পরপর কৃমিনাশক',
    titleEn: 'Quarterly Goat Deworming',
    descriptionBn: 'লিভার ফ্লুক ও গোলকৃমি প্রতিরোধে অনুমোদিত কৃমিনাশক প্রদান।',
    descriptionEn: 'Routine quarterly deworming check for Black Bengal goat.',
    protocolId: 'proto_goat_deworm',
    dueDate: plusDaysIso(7),
    status: 'upcoming',
  },
];

export const JUDGE_DEMO_CARE_RECORDS: CareRecord[] = [
  {
    id: 'jdg_rec_01',
    farmId: 'KS-JUDGE-01',
    targetType: 'animal',
    targetId: 'KS-JDG-GOT-01',
    species: 'goat',
    careType: 'vaccination',
    diseaseOrTarget: 'পিপিআর (PPR) রোগ প্রতিরোধক টিকা',
    productName: 'DLS PPR ভ্যাকসিন (নমুনা রেকর্ড)',
    batchNumber: 'JDG-PPR-2026',
    dateAdministered: plusDaysIso(-25),
    administeredBy: 'আবদুল মালেক (খামার কর্মী)',
    notes: 'বিচারক ডেমো উদাহরণ রেকর্ড',
  },
];

export const JUDGE_DEMO_AUDIT_ANSWERS: Record<string, AuditItemAnswer> = {
  bio_01_visitor: { domainId: 'bio_01_visitor', response: 'partial', answeredAt: todayIso },
  bio_02_sick_isolation: { domainId: 'bio_02_sick_isolation', response: 'missing', answeredAt: todayIso },
  bio_03_handwashing: { domainId: 'bio_03_handwashing', response: 'good', answeredAt: todayIso },
  bio_04_footwear: { domainId: 'bio_04_footwear', response: 'missing', answeredAt: todayIso },
  bio_05_equipment_cleaning: { domainId: 'bio_05_equipment_cleaning', response: 'good', answeredAt: todayIso },
  bio_06_feed_water_protection: { domainId: 'bio_06_feed_water_protection', response: 'partial', answeredAt: todayIso },
  bio_07_wild_birds_pests: { domainId: 'bio_07_wild_birds_pests', response: 'good', answeredAt: todayIso },
  bio_08_dead_bird_disposal: { domainId: 'bio_08_dead_bird_disposal', response: 'good', answeredAt: todayIso },
  bio_09_other_animals_separation: { domainId: 'bio_09_other_animals_separation', response: 'good', answeredAt: todayIso },
  bio_10_vehicle_external_control: { domainId: 'bio_10_vehicle_external_control', response: 'partial', answeredAt: todayIso },
};

export const JUDGE_DEMO_ACTIONS: ActionPlanItem[] = [
  {
    id: 'jdg_act_01',
    farmId: 'KS-JUDGE-01',
    auditSessionId: 'audit_judge_01',
    domainId: 'bio_02_sick_isolation',
    titleBn: 'অসুস্থ বা নতুন প্রাণী-পাখি রাখার আলাদা খাঁচা ও কর্নার চালু করা',
    titleEn: 'Activate Segregated Isolation Corner for Sick/New Stock',
    whyRecommendedBn:
      'একটি প্রাণী ঝিমালে বা নতুন গরু-মুরগি আনলে আলাদা না রাখলে পুরো খামারে সংক্রমণ ছড়াতে পারে।',
    whyRecommendedEn:
      'Prompt separation of dull or newly purchased animals prevents rapid herd-wide pathogen spread.',
    riskCategory: 'critical',
    priority: 'urgent',
    sourceModule: 'biosecurity_audit',
    knowledgeTopicId: 'topic_quarantine',
    applicableSpecies: ['cattle', 'goat', 'chicken_broiler'],
    assignedTo: 'আবদুল মালেক (খামার কর্মী)',
    assignedCategory: 'worker',
    targetDescriptionBn: 'খামারের দক্ষিণ-পূর্ব বাঁশের পৃথক শেড',
    targetDescriptionEn: 'South-East Bamboo Quarantine Stall',
    estimatedEffort: 'low',
    costCategory: 'low',
    requiredMaterialsBn: 'বাঁশের বেড়া, আলাদা পানির বালতি ও খাবারের পাত্র, চুন।',
    requiredMaterialsEn: 'Bamboo partition, dedicated water bucket and feeder, lime.',
    stepsBn: [
      'মূল শেড ও গোয়াল থেকে ৩০ ফুট দূরে আলাদা স্থান পরিষ্কার করে চুন ছিটিয়ে নিন।',
      'অসুস্থ বা নতুন আসা প্রাণীকে সেখানে রেখে আলাদা পানির পাত্র দিন।',
      'সুস্থ প্রাণীর কাজ শেষ করে সবশেষে আলাদা স্থানের কাজ করুন।',
    ],
    stepsEn: [
      'Clean and lime-dust a corner at least 30 feet away from main sheds.',
      'Keep separate water and feed bowls exclusively for that corner.',
      'Always tend healthy animals first and visit the isolation corner last.',
    ],
    expectedBenefitBn: 'বড় নির্মাণ খরচ ছাড়াই দ্রুত রোগ ছড়ানো থামানো যায়।',
    expectedBenefitEn: 'Immediate transmission reduction with minimal capital expense.',
    deadlineDate: plusDaysIso(1),
    status: 'in_progress',
    completedSteps: [0],
    notes: 'নমুনা তথ্য: কর্মী আবদুল মালেক স্থান পরিষ্কার সম্পন্ন করেছেন।',
  },
  {
    id: 'jdg_act_02',
    farmId: 'KS-JUDGE-01',
    auditSessionId: 'audit_judge_01',
    domainId: 'bio_04_footwear',
    titleBn: 'শেডের দরজায় জীবাণুনাশক ফুটবাথ ট্রে ও খামারের আলাদা জুতা রাখা',
    titleEn: 'Place Disinfectant Footbath & Dedicated Shed Boots at Entrance',
    whyRecommendedBn:
      'বাইরের রাস্তার কাদা ও জুতোর তলা দিয়ে সবচেয়ে বেশি ভাইরাস ও ব্যাকটেরিয়া খামারে ঢোকে।',
    whyRecommendedEn: 'Outside footwear is the top vector tracking market microbes into sheds.',
    riskCategory: 'critical',
    priority: 'urgent',
    sourceModule: 'biosecurity_audit',
    knowledgeTopicId: 'topic_daily_hygiene',
    applicableSpecies: ['cattle', 'goat', 'chicken_broiler'],
    assignedTo: 'সালমা আক্তার (পোল্ট্রি কর্মী)',
    assignedCategory: 'worker',
    targetDescriptionBn: 'ব্রয়লার শেড ও গোয়ালের প্রবেশদ্বার',
    targetDescriptionEn: 'Broiler Shed & Cattle Barn Entrance',
    estimatedEffort: 'low',
    costCategory: 'low',
    requiredMaterialsBn: 'প্লাস্টিক গামলা, ব্লিচিং বা পটাশ, ১ জোড়া প্লাস্টিক বুট।',
    requiredMaterialsEn: 'Plastic tray, disinfectant solution, 1 pair rubber boots.',
    stepsBn: [
      'শেডের দরজার সামনে জীবাণুনাশক পানি ভর্তি গামলা বসান।',
      'বাইরের জুতা বাইরে রেখে শেডের বুট পরে ফুটবাথে পা ডুবিয়ে ঢুকুন।',
      'প্রতিদিন সকালে পুরনো পানি ফেলে নতুন দ্রবণ দিন।',
    ],
    stepsEn: [
      'Set the disinfectant tray directly at the entrance threshold.',
      'Leave street sandals outside and step into the footbath with shed boots.',
      'Refresh muddy water every morning.',
    ],
    expectedBenefitBn: 'পা ও জুতার মাধ্যমে জীবাণু প্রবেশ উল্লেখযোগ্যভাবে কমে।',
    expectedBenefitEn: 'Blocks shoe-borne microbes at the shed doorway.',
    deadlineDate: todayIso,
    status: 'pending',
  },
  {
    id: 'jdg_act_03',
    farmId: 'KS-JUDGE-01',
    auditSessionId: 'audit_judge_01',
    domainId: 'bio_06_feed_water_protection',
    titleBn: 'খাবারের বস্তা মাচার ওপর তোলা ও পানির ট্যাংক ঢেকে রাখা',
    titleEn: 'Elevate Feed Bags on Pallets & Cover Water Tanks',
    whyRecommendedBn: 'স্যাতসেতে মেঝেতে খাবার রাখলে ছত্রাক জন্মে এবং খোলা পানিতে ময়লা পড়ে।',
    whyRecommendedEn: 'Floor moisture causes feed mold and uncovered water collects droppings.',
    riskCategory: 'high',
    priority: 'high',
    sourceModule: 'biosecurity_audit',
    knowledgeTopicId: 'topic_feed_water',
    applicableSpecies: ['cattle', 'goat', 'chicken_broiler'],
    assignedTo: 'রহিম মিয়া (পরিবার সদস্য)',
    assignedCategory: 'family',
    targetDescriptionBn: 'খাদ্য গুদাম ও পানির ট্যাংক',
    targetDescriptionEn: 'Feed Store & Water Tank',
    estimatedEffort: 'low',
    costCategory: 'free',
    requiredMaterialsBn: 'বাঁশের/কাঠের মাচা, প্লাস্টিক ঢাকনা।',
    requiredMaterialsEn: 'Wooden/bamboo pallet, tank cover.',
    stepsBn: [
      'মেঝে থেকে ৬ ইঞ্চি উঁচু মাচার ওপর খাবারের বস্তা সাজান।',
      'পানির ড্রাম ও ট্যাংক ঢাকনা দিয়ে ঢেকে রাখুন।',
    ],
    stepsEn: [
      'Stack feed sacks on raised pallets 6 inches above floor.',
      'Keep drinking water tanks securely covered.',
    ],
    expectedBenefitBn: 'খাদ্য বিষক্রিয়া ও পানিবাহিত ডায়রিয়া প্রতিরোধ হয়।',
    expectedBenefitEn: 'Prevents mycotoxin spoilage and waterborne gut issues.',
    deadlineDate: plusDaysIso(2),
    status: 'completed',
    completedDate: todayIso,
    completedSteps: [0, 1],
    notes: 'নমুনা তথ্য: খাবারের বস্তা মাচায় তোলা সম্পন্ন হয়েছে।',
  },
  {
    id: 'jdg_act_04',
    farmId: 'KS-JUDGE-01',
    auditSessionId: 'audit_judge_01',
    domainId: 'bio_01_visitor',
    titleBn: 'বাইরের ক্রেতা ও পরিদর্শকদের শেডে প্রবেশ নিয়ন্ত্রণ ও রেজিস্টার',
    titleEn: 'Restrict Outside Buyers & Maintain Visitor Entry Note',
    whyRecommendedBn: 'হাঁস-মুরগির ব্যবসায়ী বা বাইরের লোকজন শেডে ঢুকলে অন্য খামারের রোগ নিয়ে আসতে পারে।',
    whyRecommendedEn: 'Traders visiting multiple farms often carry germs between sheds.',
    riskCategory: 'high',
    priority: 'high',
    sourceModule: 'biosecurity_audit',
    knowledgeTopicId: 'topic_daily_hygiene',
    applicableSpecies: ['cattle', 'goat', 'chicken_broiler'],
    assignedTo: 'মোঃ করিম উদ্দিন (খামারি নিজে)',
    assignedCategory: 'self',
    targetDescriptionBn: 'খামারের প্রধান গেট',
    targetDescriptionEn: 'Main Farm Gate',
    estimatedEffort: 'low',
    costCategory: 'free',
    requiredMaterialsBn: 'গেটে সতর্কতা সাইন ও সাধারণ খাতা-কলম।',
    requiredMaterialsEn: 'Simple gate sign and visitor log notebook.',
    stepsBn: [
      'গেটের বাইরে মুরগি বা দুধ হস্তান্তরের স্থান ঠিক করুন।',
      'অতি জরুরি পরিদর্শক এলে হাত ও জুতা জীবাণুমুক্ত করে তবেই প্রবেশ করান।',
    ],
    stepsEn: [
      'Hand over birds or milk outside the production zone.',
      'Require shoe disinfection and handwashing for essential visitors.',
    ],
    expectedBenefitBn: 'বাইরে থেকে নতুন রোগ আসার ঝুঁকি কমে।',
    expectedBenefitEn: 'Limits cross-farm disease introduction.',
    deadlineDate: plusDaysIso(3),
    status: 'help_needed',
    helpReason: 'নমুনা তথ্য: গেটে নতুন সাইনবোর্ড লাগাতে সহায়তা প্রয়োজন।',
  },
];

export const JUDGE_DEMO_VET_REQUESTS: VetConsultationRequest[] = [
  {
    id: 'jdg_vet_01',
    farmId: 'KS-JUDGE-01',
    targetType: 'animal',
    targetId: 'KS-JDG-CAT-01',
    targetName: 'পদ্মা সুন্দরী (KS-JDG-CAT-01)',
    species: 'cattle',
    consultationType: 'phone_call',
    urgency: 'normal',
    symptoms: ['খাবার খাচ্ছে না', 'দুধ কমেছে'],
    preferredTimeWindow: 'সকাল ৯টা – দুপুর ১টা',
    reason: 'খাবার খাচ্ছে না, দুধ কমেছে',
    description:
      'নমুনা বিচারক ডেমো অনুরোধ: গাভীটির জাবর কাটা কিছুটা কম ও খুরারোগ টিকার আগে ফিটনেস পরামর্শ দরকার।',
    createdAt: todayIso,
    status: 'waiting_review',
    assignedVet: {
      name: 'খামার সুরক্ষা প্রাথমিক পশুচিকিৎসা ডেস্ক (নমুনা)',
      title: 'খামার সুরক্ষা পশুস্বাস্থ্য পরামর্শ',
      phone: '+880 1XXX-XXXXXX (খামার সুরক্ষা প্লেসহোল্ডার)',
      hospital: 'খামার সুরক্ষা আঞ্চলিক সহায়তা কেন্দ্র — চুনারুঘাট',
      vetVerificationStatus: 'demo_example',
    },
  },
];

export const JUDGE_DEMO_HEALTH_EVENTS: HealthEventReport[] = [
  {
    id: 'jdg_he_01',
    farmId: 'KS-JUDGE-01',
    targetType: 'animal',
    targetId: 'KS-JDG-CAT-01',
    species: 'cattle',
    symptoms: ['খাওয়া কিছুটা কম', 'দুধ সামান্য কমেছে'],
    severity: 'moderate',
    description: 'নমুনা ডেমো পর্যবেক্ষণ (পদ্মা সুন্দরী): আলাদা করে পরিষ্কার পানি ও পরামর্শ চাওয়া হয়েছে।',
    reportedDate: todayIso,
    status: 'under_review',
  },
];

export const JUDGE_DEMO_ALERTS: RegionalAlert[] = [
  {
    id: 'jdg_alert_01',
    titleBn: 'মৌসুমি খুরারোগ (FMD) ও ভ্যাপসা গরম সতর্কতা (নমুনা)',
    titleEn: 'Seasonal FMD & Heat Stress Advisory (Sample Demo)',
    species: ['cattle', 'goat', 'chicken_broiler'],
    district: 'হবিগঞ্জ (Habiganj)',
    upazila: 'চুনারুঘাট (Chunarughat)',
    severity: 'warning',
    verificationStatus: 'official_dls',
    source: 'DLS Official Advisory (Sample Demo)',
    lastUpdated: todayIso,
    recommendedPrecautionsBn: [
      'সুস্থ গাভী ও ষাঁড়ের খুরারোগ (FMD) টিকা হালনাগাদ রাখুন।',
      'দুপুর ১২টা–৩টা পোল্ট্রি শেডে বাতাস চলাচল ও ঠান্ডা পরিষ্কার পানি নিশ্চিত করুন।',
    ],
    recommendedPrecautionsEn: [
      'Keep cattle FMD boosters current.',
      'Maintain poultry shed ventilation and cool clean drinking water during afternoon heat.',
    ],
    isSimulated: true,
  },
];

export const JUDGE_DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'jdg_notif_01',
    farmId: 'KS-JUDGE-01',
    targetTaskId: 'jdg_task_02',
    category: 'vaccination',
    titleBn: 'আজ গামবোরো (IBD) টিকার তারিখ — সুরক্ষা ব্রয়লার ব্যাচ ০৭',
    titleEn: 'Gumboro (IBD) Vaccine Due Today — Batch 07',
    bodyBn: 'নমুনা রিমাইন্ডার: সালমা আক্তারের জন্য নির্ধারিত ব্রয়লার ব্যাচ ০৭ এর টিকা ক্যালেন্ডারে দেখুন।',
    bodyEn: 'Sample reminder: View Batch 07 IBD dose scheduled for today.',
    createdAt: todayIso,
    isRead: false,
    targetScreen: 'calendar',
  },
  {
    id: 'jdg_notif_02',
    farmId: 'KS-JUDGE-01',
    targetTaskId: 'jdg_act_02',
    category: 'biosecurity',
    titleBn: 'জরুরি BioShield কাজ বাকি: প্রবেশপথে ফুটবাথ',
    titleEn: 'Pending BioShield Action: Entrance Footbath',
    bodyBn: 'নমুনা রিমাইন্ডার: শেডের দরজায় ফুটবাথ ও আলাদা জুতা রাখার কাজটি এখনো বাকি আছে।',
    bodyEn: 'Sample reminder: Entrance footbath setup is pending completion.',
    createdAt: todayIso,
    isRead: false,
    targetScreen: 'biosecurity',
  },
];

export const JUDGE_DEMO_CHAT_HISTORY: KhamarBondhuMessage[] = [
  {
    id: 'jdg_msg_welcome',
    sender: 'assistant',
    text: 'আসসালামু আলাইকুম! আমি "খামার বন্ধু" (বিচারক ডেমো প্রাক-প্রস্তুত শিক্ষামূলক সহায়িকা — লাইভ AI বা ডাক্তার নয়)। রুপালী বাংলা খামারের পদ্মা সুন্দরী গাভী ও ব্রয়লার ব্যাচ ০৭ সংক্রান্ত প্রাথমিক যত্ন প্রশ্ন করতে পারেন।',
    timestamp: 'ডেমো শুরু',
  },
  {
    id: 'jdg_msg_q1',
    sender: 'user',
    text: 'খামারের পানি পরিষ্কার রাখব কীভাবে?',
    timestamp: 'নমুনা প্রশ্ন',
  },
  {
    id: 'jdg_msg_a1',
    sender: 'assistant',
    text: 'খামারের পানি পরিষ্কার রাখার সহজ নিয়ম:\n১. প্রতিদিন সকালে পানির পাত্র বা ড্রাম ব্রাশ দিয়ে ঘষে ধুয়ে তাজা পানি দিন।\n২. পানির ট্যাংক সবসময় ঢাকনা দিয়ে ঢেকে রাখুন যেন ময়লা বা পাখির বিষ্ঠা না পড়ে।\n৩. খাবারের ও পানির পাত্র গোবর থেকে দূরে উঁচু স্থানে রাখুন।',
    topicKey: 'topic_feed_water',
    timestamp: 'সহায়িকা',
  },
];
