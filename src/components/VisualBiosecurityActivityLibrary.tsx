import React, { useState } from 'react';
import { Language, NavScreen } from '../types';
import {
  FootwearIllustration,
  HandwashingIllustration,
  VisitorEntryIllustration,
  SickBirdIsolationIllustration,
  EquipmentCleaningIllustration,
  FeedProtectionIllustration,
  DeadBirdDisposalIllustration,
  VehicleControlIllustration,
  QuarantineShedIllustration,
} from './BiosecurityIllustrations';
import {
  ShieldCheck,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Info,
  X,
} from 'lucide-react';
import { Button } from './ui/Button';

interface ActivityItem {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  whyItMattersBn: string;
  whyItMattersEn: string;
  whatToDoBn: string;
  whatToDoEn: string;
  stepsBn: string[];
  stepsEn: string[];
  illustration: React.ComponentType<{ className?: string }>;
  biosecurityActionTargetBn: string;
  biosecurityActionTargetEn: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'footbath',
    titleBn: 'প্রবেশপথে জুতা পরিষ্কারের ব্যবস্থা',
    titleEn: 'Entrance Footbath Maintenance',
    categoryBn: 'প্রবেশপথ সুরক্ষা',
    categoryEn: 'Entry Point Biosecurity',
    whyItMattersBn: 'বাইরের জুতার তলায় ক্ষতিকর জীবাণু ও সংক্রামক ভাইরাস লেগে থাকে যা সরাসরি শেডে প্রবেশ করে প্রাণীকে আক্রান্ত করতে পারে।',
    whyItMattersEn: 'Footwear carries pathogens from outside that can directly contaminate farm sheds and infect healthy animals.',
    whatToDoBn: 'খামারের প্রতিটি প্রবেশমুখে নির্ধারিত ফুটবাথ রাখুন এবং শেডে ঢোকার আগে বুট বা জুতা ভালো করে ভিজিয়ে পরিষ্কার করুন।',
    whatToDoEn: 'Place disinfectant footbaths at all shed entrances and dip footwear thoroughly before entering.',
    stepsBn: [
      'প্রবেশপথের দরজার সামনে একটি অগভীর কিন্তু চওড়া প্লাস্টিক বা সিমেন্টের ট্রে স্থাপন করুন।',
      'প্রতিদিন সকালে ফুটবাথের পানি পরিবর্তন করে অনুমোদিত জীবাণুনাশক নির্দিষ্ট মাত্রায় মেশান।',
      'শেডে প্রবেশের সময় উভয় পায়ের জুতা কমপক্ষে ৫-১০ সেকেন্ড জীবাণুনাশক দ্রবণে ডুবিয়ে রাখুন।',
      'ফুটবাথের পানিতে অতিরিক্ত কাদা বা ময়লা জমলে তৎক্ষণাৎ তা ফেলে নতুন পানি দিন।',
    ],
    stepsEn: [
      'Install a shallow, durable plastic or cement tray directly at shed doorways.',
      'Replenish clean water daily with approved disinfectant powder/solution.',
      'Submerge footwear for at least 5-10 seconds before stepping across the threshold.',
      'Replace the solution immediately if contaminated with heavy mud or organic matter.',
    ],
    illustration: FootwearIllustration,
    biosecurityActionTargetBn: 'শেড প্রবেশপথ ও ফুটবাথ ব্যবস্থা',
    biosecurityActionTargetEn: 'Shed Entryways & Footbaths',
  },
  {
    id: 'handwashing',
    titleBn: 'খামারে কাজের আগে ও পরে হাত পরিষ্কার করুন',
    titleEn: 'Hand Hygiene & Sanitization',
    categoryBn: 'ব্যক্তিগত পরিচ্ছন্নতা',
    categoryEn: 'Personal Sanitation',
    whyItMattersBn: 'খামারির হাতের মাধ্যমে এক প্রাণী থেকে অন্য প্রাণীতে বা এক খাঁচা থেকে অন্য খাঁচায় রোগজীবাণু দ্রুত ছড়িয়ে পড়ে।',
    whyItMattersEn: 'Unwashed hands are a primary vector for cross-contaminating animals, feeding troughs, and equipment.',
    whatToDoBn: 'প্রাণীকে স্পর্শ করার আগে, খাবার দেওয়ার পূর্বে এবং শেড থেকে বের হওয়ার পর সাবান ও বিশুদ্ধ পানি দিয়ে হাত ধুয়ে নিন।',
    whatToDoEn: 'Wash hands thoroughly with soap and running water before feeding animals and upon exiting sheds.',
    stepsBn: [
      'শেডের পাশে একটি পানির ড্রাম বা ট্যাপ এবং সাবানের স্থায়ী ব্যবস্থা রাখুন।',
      'প্রথমে পানি দিয়ে হাত ভিজিয়ে সাবান ঘষে পর্যাপ্ত ফেনা তৈরি করুন।',
      'আঙুলের ফাঁক, নখের কোণা ও কবজি পর্যন্ত কমপক্ষে ২০ সেকেন্ড ভালোভাবে ঘষুন।',
      'পরিষ্কার পানি দিয়ে ধুয়ে শুকনা তোয়ালে বা বাতাসে হাত শুকিয়ে নিন।',
    ],
    stepsEn: [
      'Maintain an easily accessible handwashing station with soap near shed entries.',
      'Wet hands with running water and work up a generous soap lather.',
      'Scrub palms, between fingers, under fingernails, and wrists for at least 20 seconds.',
      'Rinse clean and dry with a clean towel or air dry.',
    ],
    illustration: HandwashingIllustration,
    biosecurityActionTargetBn: 'খামার কর্মীদের হাত ধোয়ার স্টেশন',
    biosecurityActionTargetEn: 'Worker Handwash Stations',
  },
  {
    id: 'visitor_control',
    titleBn: 'খামারে কারা প্রবেশ করছে তা নিয়ন্ত্রণ করুন',
    titleEn: 'Visitor Access & Movement Control',
    categoryBn: 'বহিরাগত নিয়ন্ত্রণ',
    categoryEn: 'External Biosecurity',
    whyItMattersBn: 'অন্য খামার থেকে আসা মানুষ, পাইকার বা অতিথি না জেনে মারাত্মক জীবাণু আপনার খামারে বহন করে নিয়ে আসতে পারে।',
    whyItMattersEn: 'Outside visitors and traders may have visited infected farms and unknowingly transport pathogens on clothing.',
    whatToDoBn: 'খামারের মূল ফটকে দর্শনার্থী নিষিদ্ধের নোটিশ টাঙিয়ে রাখুন এবং জরুরি পরিদর্শকদের নাম ও কারণ রেজিস্টার খাতায় লিখে রাখুন।',
    whatToDoEn: 'Post visitor restriction signs at the farm gate and maintain a compulsory visitor logbook.',
    stepsBn: [
      'খামারের সীমানা প্রাচীর বা বেড়ার গেট সবসময় বন্ধ রাখুন ও লাল নোটিশ টানান।',
      'অনুমোদনহীন কোনো বহিরাগত বা প্রাণীর দালালকে শেডের ভেতরে প্রবেশ করতে দেবেন না।',
      'অনিবার্য কারণে কেউ এলে তাকে খামারের আলাদা বুট জুতা ও অ্যাপ্রন পরিধান করতে দিন।',
      'রেজিস্টার খাতায় পরিদর্শকের নাম, তারিখ, মোবাইল নম্বর এবং পূর্ববর্তী খামার পরিদর্শনের তথ্য লিখে রাখুন।',
    ],
    stepsEn: [
      'Keep perimeter fences locked and display a prominent red BioShield restricted entry notice.',
      'Prohibit unauthorized feed traders or middlemen from entering production sheds.',
      'Provide dedicated farm boots and visitor overalls for essential inspectors.',
      'Log visitor full name, date, contact details, and prior farm visits in the farm registry.',
    ],
    illustration: VisitorEntryIllustration,
    biosecurityActionTargetBn: 'খামারের মূল গেট ও দর্শনার্থী রেজিস্টার',
    biosecurityActionTargetEn: 'Main Gate & Visitor Logbook',
  },
  {
    id: 'sick_isolation',
    titleBn: 'অসুস্থ প্রাণীর জন্য আলাদা জায়গা রাখুন',
    titleEn: 'Sick Animal Separation & Isolation',
    categoryBn: 'রোগ সংক্রমন রোধ',
    categoryEn: 'Infection Containment',
    whyItMattersBn: 'একটি অসুস্থ মুরগি বা গরুর হাঁচি, কাশি বা মলমূত্র থেকে দ্রুত গোটা খামারের সব সুস্থ প্রাণী আক্রান্ত হতে পারে।',
    whyItMattersEn: 'Coughing, nasal discharges, or droppings from a single sick animal can rapidly trigger a flock-wide outbreak.',
    whatToDoBn: 'কোনো প্রাণী দুর্বল বা অসুস্থ দেখা মাত্রই তাকে মূল পাল থেকে সরিয়ে আলাদা আইসোলেশন শেডে রেখে চিকিৎসা দিন।',
    whatToDoEn: 'Immediately isolate any dull or symptomatic animal into a separate sick bay away from healthy stock.',
    stepsBn: [
      'মূল শেড থেকে অন্তত ৩০ ফুট দূরে একটি ছোট শুষ্ক আইসোলেশন খাঁচা বা ঘর প্রস্তুত রাখুন।',
      'লক্ষণ দেখা মাত্রই অসুস্থ প্রাণীকে আলতোভাবে মূল দল থেকে আলাদা ঘরে স্থানান্তর করুন।',
      'আলাদা পাত্রে খাদ্য ও পানি দিন যাতে সুস্থ প্রাণীর খাবারের সাথে মিশে না যায়।',
      'সবসময় প্রথমে সুস্থ প্রাণীদের পরিচর্যা শেষ করে সবার শেষে অসুস্থ প্রাণীর সেবা করুন।',
    ],
    stepsEn: [
      'Maintain an isolated pen located at least 30 feet downwind from main herd/flock.',
      'Transfer dull or ailing animals immediately using stress-free handling.',
      'Dedicate separate feed troughs and drinking pans for the isolation pen.',
      'Always tend to healthy animals first; inspect isolated sick stock last.',
    ],
    illustration: SickBirdIsolationIllustration,
    biosecurityActionTargetBn: 'আইসোলেশন শেড ও কোয়ারেন্টাইন এলাকা',
    biosecurityActionTargetEn: 'Sick Bay & Quarantine Enclosure',
  },
  {
    id: 'cleaning_disinfection',
    titleBn: 'খামারের সরঞ্জাম নিয়মিত পরিষ্কার করুন',
    titleEn: 'Equipment Cleaning & Disinfection',
    categoryBn: 'সরঞ্জাম স্বাস্থ্যবিধি',
    categoryEn: 'Sanitation Protocols',
    whyItMattersBn: 'খাবার ও পানির পাত্রে জমে থাকা শেওলা ও মলমূত্র ব্যাক্টেরিয়ার বংশবৃদ্ধি ঘটায়, যার ফলে পেটের রোগ ও পাতলা পায়খানা হয়।',
    whyItMattersEn: 'Biofilm and encrusted manure inside feeders and drinkers harbor Salmonella and E. coli.',
    whatToDoBn: 'প্রতিদিন পরিষ্কার পানি ও ব্রাশ দিয়ে পাত্রের ময়লা ঘষে ধুয়ে ফেলুন এবং সপ্তাহে অন্তত একবার জীবাণুনাশক স্প্রে করুন।',
    whatToDoEn: 'Scrub feeders and drinkers daily with clean water and brush; sanitize weekly with approved disinfectant.',
    stepsBn: [
      'প্রথমে শুকনো বা ভেজা ময়লা ও লিটার ব্রাশ দিয়ে সম্পূর্ণ ঘষে তুলে নিন।',
      'পরিষ্কার পানিতে ধুয়ে পাত্রগুলো রোদে শুকিয়ে নিন।',
      'প্রস্তুতকারকের নির্দেশনামতো জীবাণুনাশক গুলে স্প্রে মেশিনের সাহায্যে স্প্রে করুন।',
      'জীবাণুনাশক শুকানোর পর্যাপ্ত সময় দিন, এরপর খাবার বা পানি পুনরায় ভর্তি করুন।',
    ],
    stepsEn: [
      'Scrape off encrusted organic matter and feed remnants with a stiff cleaning brush.',
      'Rinse clean with water and allow items to air dry in direct sunlight.',
      'Spray approved disinfectant solution at recommended dilution evenly.',
      'Allow adequate contact time before refilling with fresh feed and water.',
    ],
    illustration: EquipmentCleaningIllustration,
    biosecurityActionTargetBn: 'ফিডার, ড্রিংকার ও খামারের সরঞ্জামাদি',
    biosecurityActionTargetEn: 'Feeders, Drinkers & Farm Utensils',
  },
  {
    id: 'feed_water_hygiene',
    titleBn: 'খাদ্য ও পানির পাত্র পরিষ্কার রাখুন',
    titleEn: 'Feed & Water Safety Storage',
    categoryBn: 'পুষ্টি ও খাদ্য নিরাপত্তা',
    categoryEn: 'Feed & Water Security',
    whyItMattersBn: 'স্যাঁতসেঁতে মেঝেতে রাখা খাবারের বস্তায় ছত্রাক ও ফাঙ্গাল টক্সিন জন্মায় যা খেলে প্রাণী মারাত্মক বিষক্রিয়ায় মারা যেতে পারে।',
    whyItMattersEn: 'Feed sacks stored on damp floors develop aflatoxins and mold, causing fatal mycotoxicosis.',
    whatToDoBn: 'খাবারের বস্তা মাটির ওপর না রেখে কাঠের মাচায় উঁচু করে রাখুন এবং পানির ট্যাংক সবসময় ঢাকনা দিয়ে ঢেকে রাখুন।',
    whatToDoEn: 'Store feed bags on elevated wooden pallets away from walls; keep water tanks tightly capped.',
    stepsBn: [
      'মেঝে থেকে অন্তত ৬ ইঞ্চি ও দেয়াল থেকে ১ ফুট দূরত্বে কাঠের তক্তা বা প্যালেট বসান।',
      'প্যালেট বা মাচার ওপরে খাদ্যবস্তা সাজিয়ে রাখুন যাতে নিচ দিয়ে বাতাস চলাচল করতে পারে।',
      'পানির ট্যাংকের মুখ সবসময় শক্ত ঢাকনা দিয়ে বন্ধ রাখুন যাতে ধুলোবালি বা পাখির মল না পড়ে।',
      'মাসে অন্তত একবার পানির পাইপলাইন ও ট্যাংক ব্লিচিং মিশ্রণ দিয়ে ফ্ল্যাশ বা পরিষ্কার করুন।',
    ],
    stepsEn: [
      'Place wooden pallets at least 6 inches off the floor and 1 foot away from walls.',
      'Stack feed bags on top of pallets to ensure continuous dry air circulation.',
      'Keep overhead water tanks covered with tightly fitted lids at all times.',
      'Flush distribution pipes and clean water tanks monthly with water sanitizer.',
    ],
    illustration: FeedProtectionIllustration,
    biosecurityActionTargetBn: 'খাদ্য গুদাম ও পানির স্টোরেজ ট্যাংক',
    biosecurityActionTargetEn: 'Feed Storage & Water Reservoir',
  },
  {
    id: 'waste_management',
    titleBn: 'খামারের বর্জ্য নিরাপদভাবে ব্যবস্থাপনা করুন',
    titleEn: 'Carcass & Waste Safe Disposal',
    categoryBn: 'বর্জ্য ও মৃতদেহ ব্যবস্থাপনা',
    categoryEn: 'Safe Waste Disposal',
    whyItMattersBn: 'মৃত পাখি বা পশু খোলা জায়গায় ফেলে রাখলে শকুন, কুকুর বা মাছি দ্বারা রোগ নিমেষেই সমগ্র গ্রামে ছড়িয়ে পড়তে পারে।',
    whyItMattersEn: 'Openly discarded dead birds or afterbirths are scavenged by dogs and flies, spreading disease across the region.',
    whatToDoBn: 'মৃত প্রাণী অবিলম্বে খামার থেকে দূরে অন্তত ৩ ফুট গভীর গর্ত করে চুন দিয়ে পুঁতে ফেলুন অথবা নির্ধারিত স্থানে ঢাকনাযুক্ত রাখুন।',
    whatToDoEn: 'Deeply bury dead animals in a 3-foot pit with lime cover away from water sources immediately.',
    stepsBn: [
      'খামার ও পানির উৎস (নলকূপ বা পুকুর) থেকে দূরে শুকনো স্থানে গভীর গর্ত খুঁড়ুন।',
      'গর্তের তলায় এক স্তর চুন (Lime powder) ছড়িয়ে দিন।',
      'মৃত প্রাণীর দেহ বা আবর্জনা গর্তে ফেলে তার ওপরে পর্যাপ্ত চুন ছিটিয়ে দিন।',
      'মাটি দিয়ে শক্ত করে গর্ত ভরাট করে দিন যাতে শেয়াল বা কুকুর খুঁড়ে বের করতে না পারে।',
    ],
    stepsEn: [
      'Dig a deep burial pit located well away from sheds and groundwater sources.',
      'Scatter a foundational layer of agricultural lime powder at the pit bottom.',
      'Deposit carcass carefully and coat thoroughly with additional quicklime.',
      'Backfill with compacted soil to prevent scavenger excavation.',
    ],
    illustration: DeadBirdDisposalIllustration,
    biosecurityActionTargetBn: 'মৃতদেহ সমাধি গর্ত ও বর্জ্য ডাম্প',
    biosecurityActionTargetEn: 'Burial Pit & Waste Disposal Area',
  },
  {
    id: 'farm_entry_control',
    titleBn: 'খামারে প্রবেশের নিয়ম অনুসরণ করুন',
    titleEn: 'Farm Entry Perimeter Control',
    categoryBn: 'বহিরাগত পরিধি নিয়ন্ত্রণ',
    categoryEn: 'Perimeter Disinfection',
    whyItMattersBn: 'খামারের ভেতর খাদ্যবাহী বা মুরগিবাহী পিকআপ ভ্যানের চাকায় লেগে বাইরের জীবাণু প্রবেশ করে।',
    whyItMattersEn: 'Vehicle tires from feed trucks or live-bird collection pickups carry pathogens from distant markets.',
    whatToDoBn: 'কোনো যানবাহন খামারের ভেতরে প্রবেশ করতে দেবেন না; একান্ত প্রবেশে চাকা ভালো করে জীবাণুনাশক দিয়ে স্প্রে করুন।',
    whatToDoEn: 'Prevent external vehicles from entering production zones; spray wheels and undercarriages thoroughly.',
    stepsBn: [
      'খাদ্য বা ডিম লোডিং পয়েন্ট খামারের সীমানা প্রাচীরের গেটের বাইরে স্থাপন করুন।',
      'খামারের গেটে চাকা জীবাণুমুক্ত করার জন্য স্প্রেয়ার অথবা চুন-পাউডারের পরিখা তৈরি রাখুন।',
      'যানবাহনের চাকায় মাটি বা গোবর থাকলে তা আগে ধুয়ে এরপর জীবাণুনাশক স্প্রে করুন।',
      'বাইরে থেকে কেনা খাঁচা বা ট্রের ক্ষেত্রে আগে জীবাণুমুক্ত করে তারপর খামারে ঢোকান।',
    ],
    stepsEn: [
      'Position feed unloading and bird collection docks outside the perimeter fence.',
      'Equip the farm gate with a pressurized wheel sprayer or dry lime wheel dip.',
      'Wash off heavy mud from tires prior to applying disinfectant spray.',
      'Sanitize all reusable plastic crates before allowing them past the gate.',
    ],
    illustration: VehicleControlIllustration,
    biosecurityActionTargetBn: 'যানবাহন প্রবেশ গেট ও স্প্রে পয়েন্ট',
    biosecurityActionTargetEn: 'Vehicle Gate & Wheel Wash Basin',
  },
];

interface VisualBiosecurityActivityLibraryProps {
  lang: Language;
  onNavigate: (screen: NavScreen) => void;
  onSelectActionTarget?: (targetTitle: string) => void;
}

export const VisualBiosecurityActivityLibrary: React.FC<VisualBiosecurityActivityLibraryProps> = ({
  lang,
  onNavigate,
  onSelectActionTarget,
}) => {
  const isBn = lang === 'bn';
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const filteredActivities = ACTIVITIES.filter((act) => {
    if (activeCategoryFilter === 'all') return true;
    return act.id === activeCategoryFilter || act.categoryBn.includes(activeCategoryFilter);
  });

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-800 tracking-wider mb-0.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{isBn ? 'ভিজ্যুয়াল বায়োসিকিউরিটি শিক্ষাকেন্দ্র' : 'Visual Biosecurity Activity Library'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isBn ? 'খামার সুরক্ষার ৮টি মৌলিক অভ্যাস' : '8 Essential Farm Protection Practices'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isBn
              ? 'সহজ ও স্পষ্ট ছবি দেখে প্রতিটি সুরক্ষামূলক কাজের নিয়ম ও ধাপগুলো সহজে বুঝুন'
              : 'Clear visual guides designed for effortless understanding and on-farm compliance'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('biosecurity')}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          className="text-xs font-bold shrink-0"
        >
          {isBn ? 'সম্পূর্ণ অডিট শুরু করুন' : 'Start Full Audit'}
        </Button>
      </div>

      {/* Grid of 8 Visual Activity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredActivities.map((act) => {
          const Illustration = act.illustration;

          return (
            <div
              key={act.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Illustration Header */}
              <div className="relative bg-slate-50 border-b border-slate-100 p-2 overflow-hidden">
                <Illustration className="w-full h-36 object-contain transition-transform duration-300 group-hover:scale-102" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-emerald-900 shadow-xs border border-emerald-100">
                  {isBn ? act.categoryBn : act.categoryEn}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                    {isBn ? act.titleBn : act.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {isBn ? act.whatToDoBn : act.whatToDoEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? '৪টি সহজ ধাপ' : '4 Easy Steps'}</span>
                  </span>

                  <button
                    onClick={() => setSelectedActivity(act)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 text-xs font-black transition-colors flex items-center gap-1"
                  >
                    <span>{isBn ? 'ধাপে ধাপে দেখুন' : 'View Guide'}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-700" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Selected Biosecurity Activity */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            {/* Modal Header with Illustration */}
            <div className="relative bg-slate-50 border-b border-slate-200 p-4 sm:p-6 text-center">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 shadow-xs border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-w-xs mx-auto mb-2">
                <selectedActivity.illustration className="w-full h-44 object-contain" />
              </div>

              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
                {isBn ? selectedActivity.categoryBn : selectedActivity.categoryEn}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {isBn ? selectedActivity.titleBn : selectedActivity.titleEn}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
              {/* Why It Matters */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-black text-xs uppercase text-amber-900">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>{isBn ? 'কেন এটি অত্যন্ত গুরুত্বপূর্ণ?' : 'Why It Matters'}</span>
                </div>
                <p className="leading-relaxed">
                  {isBn ? selectedActivity.whyItMattersBn : selectedActivity.whyItMattersEn}
                </p>
              </div>

              {/* What To Do */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  {isBn ? 'কী করতে হবে:' : 'What To Do:'}
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {isBn ? selectedActivity.whatToDoBn : selectedActivity.whatToDoEn}
                </p>
              </div>

              {/* Step-by-Step Guidance */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  {isBn ? 'ধাপে ধাপে সম্পন্ন করার নিয়ম:' : 'Step-by-Step Action Guide:'}
                </h4>

                <div className="space-y-2">
                  {(isBn ? selectedActivity.stepsBn : selectedActivity.stepsEn).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Associated Farm Target */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>{isBn ? 'সম্পর্কিত খামার এলাকা:' : 'Applicable Farm Area:'}</span>
                <strong className="text-slate-900 font-bold">
                  {isBn ? selectedActivity.biosecurityActionTargetBn : selectedActivity.biosecurityActionTargetEn}
                </strong>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedActivity(null)}>
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedActivity(null);
                  onNavigate('biosecurity');
                }}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {isBn ? 'বায়োশিল্ড অ্যাকশন প্ল্যানে যান' : 'Go to Action Plan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
