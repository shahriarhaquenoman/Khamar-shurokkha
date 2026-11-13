import { BiosecurityDomain, FarmProfile, FarmType, Species } from '../types';

const POULTRY_SPECIES: Species[] = ['chicken_broiler', 'chicken_layer', 'chicken_sonali', 'duck'];
const RUMINANT_SPECIES: Species[] = ['cattle', 'buffalo', 'goat', 'sheep'];
const POULTRY_FARM_TYPES: FarmType[] = ['broiler', 'layer', 'sonali', 'duck'];
const RUMINANT_FARM_TYPES: FarmType[] = ['dairy', 'beef', 'goat', 'sheep', 'buffalo'];

export function getFarmAnimalGroups(farm?: FarmProfile | null): {
  hasPoultry: boolean;
  hasRuminant: boolean;
} {
  if (!farm) return { hasPoultry: true, hasRuminant: false };
  const species = farm.speciesPresent || [];
  const types = farm.farmTypes || [];

  const hasPoultry =
    species.some((s) => POULTRY_SPECIES.includes(s)) ||
    types.some((t) => POULTRY_FARM_TYPES.includes(t)) ||
    types.includes('mixed');

  const hasRuminant =
    species.some((s) => RUMINANT_SPECIES.includes(s)) ||
    types.some((t) => RUMINANT_FARM_TYPES.includes(t)) ||
    types.includes('mixed');

  if (!hasPoultry && !hasRuminant) {
    return { hasPoultry: true, hasRuminant: true };
  }
  return { hasPoultry, hasRuminant };
}

export function isDomainApplicableToFarm(domain: BiosecurityDomain, farm?: FarmProfile | null): boolean {
  const groups = domain.applicableFarmGroups || ['all'];
  if (groups.includes('all')) return true;
  const { hasPoultry, hasRuminant } = getFarmAnimalGroups(farm);
  if (groups.includes('poultry') && hasPoultry) return true;
  if (groups.includes('ruminant') && hasRuminant) return true;
  return false;
}

export function getLocalizedDomainContent(
  domain: BiosecurityDomain,
  farm?: FarmProfile | null
): {
  titleBn: string;
  titleEn: string;
  questionBn: string;
  questionEn: string;
  explanationBn: string;
  explanationEn: string;
  practicalTipBn: string;
  practicalTipEn: string;
} {
  const { hasPoultry, hasRuminant } = getFarmAnimalGroups(farm);
  const useRuminantCopy = hasRuminant && !hasPoultry && Boolean(domain.ruminantTitleBn);
  return {
    titleBn: useRuminantCopy ? domain.ruminantTitleBn! : domain.titleBn,
    titleEn: useRuminantCopy ? domain.ruminantTitleEn || domain.titleEn : domain.titleEn,
    questionBn: useRuminantCopy ? domain.ruminantQuestionBn || domain.questionBn : domain.questionBn,
    questionEn: useRuminantCopy ? domain.ruminantQuestionEn || domain.questionEn : domain.questionEn,
    explanationBn: useRuminantCopy ? domain.ruminantExplanationBn || domain.explanationBn : domain.explanationBn,
    explanationEn: useRuminantCopy ? domain.ruminantExplanationEn || domain.explanationEn : domain.explanationEn,
    practicalTipBn: useRuminantCopy ? domain.ruminantTipBn || domain.practicalTipBn : domain.practicalTipBn,
    practicalTipEn: useRuminantCopy ? domain.ruminantTipEn || domain.practicalTipEn : domain.practicalTipEn,
  };
}

export const BIOSECURITY_DOMAINS: BiosecurityDomain[] = [
  {
    id: 'bio_01_visitor',
    order: 1,
    domainKey: 'visitor_control',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_daily_hygiene',
    titleBn: 'দর্শনার্থী ও বহিরাগত প্রবেশ নিয়ন্ত্রণ',
    titleEn: 'Visitor Entry Control',
    questionBn: 'খামারের ভেতর বহিরাগত মানুষ বা অপ্রয়োজনীয় দর্শনার্থীদের অবাধ প্রবেশ নিয়ন্ত্রণ করা হয় কি?',
    questionEn: 'Is unauthorized or unnecessary human entry strictly restricted into the farm premises?',
    explanationBn: 'বহিরাগত মানুষের কাপড় ও জুতার মাধ্যমে অন্য খামার বা হাট-বাজার থেকে মারাত্মক জীবাণু খামারে ছড়িয়ে পড়তে পারে।',
    explanationEn: 'Visitors can inadvertently transport infectious pathogens on clothing and footwear.',
    riskSeverity: 'high',
    practicalTipBn: 'গেটে স্পষ্ট সতর্কীকরণ বোর্ড ঝুলিয়ে রাখুন এবং খামার পরিদর্শন খাতা রাখুন।',
    practicalTipEn: 'Install a clear entry board at the gate and keep a simple visitor logbook.',
    iconName: 'UserX',
  },
  {
    id: 'bio_02_sick_isolation',
    order: 2,
    domainKey: 'sick_bird_isolation',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_quarantine',
    titleBn: 'অসুস্থ পাখি পৃথকীকরণ ও কোয়ারেন্টাইন',
    titleEn: 'Sick Bird Separation & Isolation',
    questionBn: 'কোনো মুরগি বা হাঁস নিস্তেজ বা অসুস্থ দেখা গেলে সাথে সাথে সুস্থ পাখি থেকে আলাদা করে রাখা হয় কি?',
    questionEn: 'Are dull or sick birds immediately isolated in a separate enclosure away from the healthy flock?',
    explanationBn: 'অসুস্থ পাখি দ্রুত আলাদা না করলে বাতাস বা লালা-মলের মাধ্যমে পুরো শেডে রোগ ছড়িয়ে পড়তে পারে।',
    explanationEn: 'Delaying isolation accelerates pathogen transmission through aerosols and shared drinkers.',
    riskSeverity: 'critical',
    practicalTipBn: 'প্রধান শেড থেকে অন্তত ৫০ ফুট দূরে একটি ছোট বাতাস চলাচলযুক্ত আলাদা খাঁচা প্রস্তুত রাখুন।',
    practicalTipEn: 'Keep a separate isolation coop located downwind away from main sheds.',
    ruminantTitleBn: 'অসুস্থ বা নতুন প্রাণী পৃথকীকরণ (কোয়ারেন্টাইন)',
    ruminantTitleEn: 'Sick or New Livestock Isolation',
    ruminantQuestionBn: 'কোনো গরু বা ছাগল অসুস্থ হলে বা বাজার থেকে নতুন প্রাণী আনলে আলাদা স্থানে রাখা হয় কি?',
    ruminantQuestionEn: 'Are sick livestock or newly purchased cattle/goats kept in a separate stall away from healthy animals?',
    ruminantExplanationBn: 'নতুন বা অসুস্থ প্রাণী সুস্থ পালের সাথে রাখলে ক্ষুরা রোগ, পিপিআর বা লাম্পি স্কিন রোগ পুরো গোয়ালে ছড়াতে পারে।',
    ruminantExplanationEn: 'Mixing new or sick cattle/goats spreads FMD, PPR, or LSD across the entire herd.',
    ruminantTipBn: 'গোয়ালের একপাশে বা আলাদা ঘরে কমপক্ষে ১৪ দিন নতুন ও অসুস্থ প্রাণী রাখার ব্যবস্থা করুন।',
    ruminantTipEn: 'Keep new or sick cattle/goats in a separate corner or shed for at least 14 days.',
    iconName: 'ShieldAlert',
  },
  {
    id: 'bio_03_handwashing',
    order: 3,
    domainKey: 'handwashing_hygiene',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_daily_hygiene',
    titleBn: 'হাত ধোয়া ও ব্যক্তিগত স্বাস্থ্যবিধি',
    titleEn: 'Handwashing & Personal Hygiene',
    questionBn: 'খামারে ঢোকার আগে এবং প্রাণী বা খাবারের পাত্র ধরার পর সাবান ও পরিষ্কার পানি দিয়ে হাত ধোয়া হয় কি?',
    questionEn: 'Do handlers wash hands with soap and clean water before entering and after handling animals or utensils?',
    explanationBn: 'হাত দিয়ে নিয়মিত খাবার ও পানির পাত্র স্পর্শ করা হয়, তাই অপরিষ্কার হাত জীবাণু বিস্তারের অন্যতম প্রধান বাহক।',
    explanationEn: 'Hands frequently touch drinkers and feeders; unwashed hands spread germs across the farm.',
    riskSeverity: 'high',
    practicalTipBn: 'খামারের গেটেই সাবান ও ট্যাপযুক্ত বালতি বা ড্রামের সহজ ব্যবস্থা রাখুন।',
    practicalTipEn: 'Place a covered tap bucket and soap bar directly at the farm entrance.',
    iconName: 'HandMetal',
  },
  {
    id: 'bio_04_footwear',
    order: 4,
    domainKey: 'footwear_footbath',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_daily_hygiene',
    titleBn: 'নির্দিষ্ট জুতা ও সচল ফুটবাথ ব্যবহার',
    titleEn: 'Dedicated Footwear & Maintained Footbath',
    questionBn: 'খামার বা গোয়ালে ঢোকার মুখে জীবাণুনাশক ফুটবাথ এবং ভেতরে ব্যবহারের জন্য আলাদা বুট বা স্যান্ডেল আছে কি?',
    questionEn: 'Is there a disinfectant footbath at the entrance and separate shed-only footwear inside?',
    explanationBn: 'রাস্তাঘাটের জুতার তলায় লেগে থাকা কাদা ও মলমূত্র সরাসরি শেড বা গোয়ালের মেঝেতে ক্ষতিকর জীবাণু পৌঁছে দেয়।',
    explanationEn: 'Street footwear carries external mud and manure pathogens directly onto shed floors.',
    riskSeverity: 'high',
    practicalTipBn: 'ফুটবাথের পানি প্রতিদিন পরিষ্কার করে নতুন জীবাণুনাশক পানি দিন। কাদা জমতে দেবেন না।',
    practicalTipEn: 'Clean the footbath tray daily and refresh disinfectant solution.',
    iconName: 'Footprints',
  },
  {
    id: 'bio_05_equipment_cleaning',
    order: 5,
    domainKey: 'equipment_disinfection',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_feed_water',
    titleBn: 'খাবার ও পানির পাত্র নিয়মিত পরিষ্কার রাখা',
    titleEn: 'Feeder & Drinker Cleaning & Disinfection',
    questionBn: 'খাবারের পাত্র, পানির পাত্র এবং ব্যবহার্য সরঞ্জাম নিয়মিত সাবান-পানিতে ধুয়ে পরিষ্কার রাখা হয় কি?',
    questionEn: 'Are feeders, water troughs, and farm tools routinely scrubbed, cleaned, and dried?',
    explanationBn: 'পাত্রের কোণায় জমে থাকা ভেজা খাবার ও শ্যাওলায় ক্ষতিকর ব্যাকটেরিয়া ও ছত্রাক জন্মে।',
    explanationEn: 'Feed residue and slime inside drinkers breed bacteria and mold.',
    riskSeverity: 'routine',
    practicalTipBn: 'প্রতিদিন সকালে পানি বদলানোর সময় ব্রাশ দিয়ে পাত্র পরিষ্কার করুন।',
    practicalTipEn: 'Scrub drinkers daily with a brush before refilling clean water.',
    iconName: 'Sparkles',
  },
  {
    id: 'bio_06_feed_water_protection',
    order: 6,
    domainKey: 'feed_water_protection',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_feed_water',
    titleBn: 'খাবার ও পানির উৎস দূষণমুক্ত রাখা',
    titleEn: 'Feed & Drinking Water Protection',
    questionBn: 'খাবারের বস্তা স্যাঁতসেঁতে মেঝে থেকে বাঁচাতে কাঠের মাচায় রাখা এবং পানির উৎস পরিষ্কার রাখা হয় কি?',
    questionEn: 'Are feed bags stored on raised pallets away from moisture, and is drinking water kept clean?',
    explanationBn: 'মেঝের আর্দ্রতায় খাবারে ক্ষতিকর ছত্রাক জন্মে এবং দূষিত পানি প্রাণীর পেটের পীড়া ও অসুস্থতা তৈরি করে।',
    explanationEn: 'Damp storage breeds fungal toxins in feed and contaminated water causes enteric illness.',
    riskSeverity: 'high',
    practicalTipBn: 'দেয়াল ও মেঝে থেকে ৬ ইঞ্চি উঁচু মাচায় খাবার রাখুন এবং পানির পাত্র বা ট্যাংক নিয়মিত পরিষ্কার করুন।',
    practicalTipEn: 'Stack feed bags on wooden pallets off the floor and flush water containers regularly.',
    iconName: 'Package',
  },
  {
    id: 'bio_07_wild_birds_pests',
    order: 7,
    domainKey: 'pest_wild_bird_control',
    applicableFarmGroups: ['poultry'],
    knowledgeTopicId: 'topic_daily_hygiene',
    titleBn: 'বন্য পাখি, ইঁদুর ও কুকুর-বিড়াল রোধ',
    titleEn: 'Wild Bird, Rodent & Pest Exclusion',
    questionBn: 'শেডের তারের জালি অক্ষত রয়েছে এবং বুনো পাখি, ইঁদুর বা বাইরের প্রাণী ঢোকা বন্ধ আছে কি?',
    questionEn: 'Is shed wire netting intact without holes, barring wild birds, rats, and predators?',
    explanationBn: 'বন্য পাখি ও ইঁদুর বার্ড ফ্লু এবং সালমোনেলার মতো মারাত্মক জীবাণু খামারে বয়ে আনতে পারে।',
    explanationEn: 'Wild birds and rodents carry Avian Influenza and Salmonella into poultry sheds.',
    riskSeverity: 'high',
    practicalTipBn: 'জালির ছেঁড়া অংশ তার দিয়ে শক্ত করে বাঁধুন এবং শেডের বাইরে ইঁদুরের ফাঁদ রাখুন।',
    practicalTipEn: 'Patch wire mesh tears immediately and set safe traps outside the shed.',
    iconName: 'Bird',
  },
  {
    id: 'bio_08_dead_bird_disposal',
    order: 8,
    domainKey: 'dead_bird_disposal',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_daily_hygiene',
    titleBn: 'মৃত পাখি ও খামারের বর্জ্য নিরাপদ নিষ্কাশন',
    titleEn: 'Dead Bird & Farm Bio-Waste Safe Disposal',
    questionBn: 'মৃত পাখি বা বর্জ্য খোলা জায়গায় না ফেলে খামার থেকে দূরে গর্ত করে চুন দিয়ে মাটি চাপা দেওয়া হয় কি?',
    questionEn: 'Are dead birds or infectious farm waste buried safely in a deep pit with lime, never thrown outside?',
    explanationBn: 'খোলা স্থানে বা ড্রেনে মৃত দেহ বা বর্জ্য ফেললে শিয়াল, কুকুর ও কাক জীবাণু পুরো এলাকায় ছড়িয়ে দেয়।',
    explanationEn: 'Open disposal attracts scavengers that spread infectious material across nearby farms.',
    riskSeverity: 'critical',
    practicalTipBn: 'খামারের এক পাশে ঢাকনাযুক্ত গর্ত করে চুন দিয়ে পুঁতে ফেলার ব্যবস্থা রাখুন।',
    practicalTipEn: 'Maintain a covered deep pit downwind with quicklime for safe disposal.',
    ruminantTitleBn: 'গোবর, বর্জ্য ও মৃত প্রাণী নিরাপদ ব্যবস্থাপনা',
    ruminantTitleEn: 'Manure, Bio-Waste & Mortality Disposal',
    ruminantQuestionBn: 'গোয়ালের ময়লা ও গোবর পানির উৎস থেকে দূরে রাখা হয় এবং মৃত প্রাণী গভীর গর্তে চুন দিয়ে পুঁতে ফেলা হয় কি?',
    ruminantQuestionEn: 'Is shed manure kept away from drinking water sources and any carcass buried deeply with lime?',
    ruminantExplanationBn: 'পানিতে বর্জ্য মিশলে বা খোলা স্থানে মৃত প্রাণী ফেললে জীবাণু ও পরজীবী দ্রুত ছড়ায়।',
    ruminantExplanationEn: 'Uncontrolled manure runoff and open carcasses contaminate water and spread parasites.',
    ruminantTipBn: 'গোয়ালের বর্জ্য নির্দিষ্ট দূরে কম্পোস্ট গর্তে রাখুন এবং জলাবদ্ধতা দূর করুন।',
    ruminantTipEn: 'Keep manure in a designated pit away from water troughs and keep shed floors dry.',
    iconName: 'Trash2',
  },
  {
    id: 'bio_09_other_animals_separation',
    order: 9,
    domainKey: 'animal_species_separation',
    applicableFarmGroups: ['poultry'],
    knowledgeTopicId: 'topic_quarantine',
    titleBn: 'হাঁস, কবুতর ও অন্যান্য প্রাণী থেকে পৃথক রাখা',
    titleEn: 'Separation of Poultry Sheds from Other Animals',
    questionBn: 'ব্রয়লার বা লেয়ার শেডের ভেতরে বা সীমানায় দেশি হাঁস, কবুতর বা গরু-ছাগলের অবাধ মেলামেশা বন্ধ আছে কি?',
    questionEn: 'Are commercial poultry sheds separated from free-range ducks, pigeons, or other livestock?',
    explanationBn: 'হাঁস নিজেরা অসুস্থ না হয়েও ইনফ্লুয়েঞ্জা ভাইরাস বহন করে মুরগিকে সংক্রমিত করতে পারে।',
    explanationEn: 'Domestic ducks can silently carry avian influenza viruses that infect chickens.',
    riskSeverity: 'high',
    practicalTipBn: 'হাঁস ও কবুতরকে মুরগির শেড থেকে অন্তত ১০০ ফুট দূরে আলাদা স্থানে রাখুন।',
    practicalTipEn: 'Keep backyard ducks and pigeons separated from commercial poultry sheds.',
    iconName: 'Layers',
  },
  {
    id: 'bio_10_vehicle_external_control',
    order: 10,
    domainKey: 'vehicle_external_contamination',
    applicableFarmGroups: ['all'],
    knowledgeTopicId: 'topic_daily_hygiene',
    titleBn: 'বাইরের গাড়ি ও সরঞ্জাম জীবাণুমুক্ত রাখা',
    titleEn: 'External Vehicle & Equipment Control',
    questionBn: 'খাবার বা প্রাণী বহনকারী বাইরের গাড়ি ও খাঁচা খামারের ভেতরে না এনে গেটে জীবাণুনাশক স্প্রে করা হয় কি?',
    questionEn: 'Are external supply vehicles and transport crates kept outside the main shed area or disinfected at the gate?',
    explanationBn: 'বাজার ও অন্য খামার থেকে আসা গাড়ির চাকা এবং খাঁচায় সংক্রামক জীবাণু লেগে থাকতে পারে।',
    explanationEn: 'Supplier trucks and market crates frequently carry germs between multiple farms.',
    riskSeverity: 'high',
    practicalTipBn: 'পণ্য বা প্রাণী হস্তান্তর খামারের গেটের বাইরে থেকেই করুন এবং বাজারের খাঁচা ভেতরে নেবেন না।',
    practicalTipEn: 'Load and unload animals or feed at the perimeter gate rather than inside sheds.',
    iconName: 'Truck',
  },
];
