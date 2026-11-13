export interface BiosecurityTaskItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: 'hygiene' | 'access_control' | 'waste_management' | 'water_feed';
  descriptionBn: string;
  priority: 'critical' | 'high' | 'medium';
}

export interface BiosecurityChecklistRecord {
  checklistId: string;
  farmId: string;
  ownerUid: string;
  date: string;
  itemsCompleted: string[];
  totalItems: number;
  scorePercent: number;
  inspectorName: string;
  notes?: string;
  createdAt: string;
}

export const STANDARD_BIOSECURITY_TASKS: BiosecurityTaskItem[] = [
  {
    id: 'footbath_maintenance',
    titleBn: 'জীবাণুনাশক ফুটবাথ প্রস্তুত ও সতেজ দ্রবণ বজায় রাখা',
    titleEn: 'Footbath Disinfectant Preparation & Refreshing',
    category: 'hygiene',
    descriptionBn: 'শেডের প্রবেশদ্বারে রাখা ফুটবাথে ব্লিচিং বা পটাশ দ্রবণ পর্যাপ্ত ও কার্যকর আছে কিনা পরীক্ষা করুন।',
    priority: 'critical',
  },
  {
    id: 'visitor_logging',
    titleBn: 'বহিরাগত দর্শনার্থী ও খামারি প্রবেশ রেজিস্টার এন্ট্রি',
    titleEn: 'Visitor Logbook & Screening Record',
    category: 'access_control',
    descriptionBn: 'বাইরের কোনো ডিলার, পাইকার বা অতিথি প্রবেশ করলে নাম, ফোন ও প্রবেশের কারণ লগ করুন।',
    priority: 'critical',
  },
  {
    id: 'dedicated_footwear',
    titleBn: 'শেডে প্রবেশের আগে নির্দিষ্ট রাবার বুট ও পোশাক পরিবর্তন',
    titleEn: 'Dedicated Rubber Boots & Shed Attire',
    category: 'hygiene',
    descriptionBn: 'বাইরের জুতো বাইরে রেখে শুধুমাত্র খামারের জন্য সংরক্ষিত জীবাণুমুক্ত বুট পরিধান নিশ্চিত করুন।',
    priority: 'high',
  },
  {
    id: 'vehicle_tire_spray',
    titleBn: 'খাদ্য বা ওষুধবাহী ভ্যান/গাড়ির চাকায় স্প্রে করা',
    titleEn: 'Feed & Supply Vehicle Wheel Disinfection',
    category: 'access_control',
    descriptionBn: 'যেকোনো বাহন খামার চত্বরে প্রবেশের পূর্বে চাকায় অনুমোদিত জীবাণুনাশক স্প্রে করুন।',
    priority: 'medium',
  },
  {
    id: 'carcass_deep_burial',
    titleBn: 'মৃত পাখি/বর্জ্য তাৎক্ষণিক গভীর গর্তে মাটির নিচে পুতে ফেলা',
    titleEn: 'Immediate Deep Burial of Dead Birds/Carcasses',
    category: 'waste_management',
    descriptionBn: 'মৃত মুরগি ফেলে না রেখে দ্রুত শেড থেকে বের করে চুন দিয়ে মাটির নিচে পুতে রাখুন।',
    priority: 'critical',
  },
  {
    id: 'drinker_line_flush',
    titleBn: 'পানির পাত্র ও ড্রিংকার লাইন জীবানুমুক্ত ও পরিষ্কার রাখা',
    titleEn: 'Water Line Flushing & Drinker Sanitation',
    category: 'water_feed',
    descriptionBn: 'জীবাণুমুক্ত ঠান্ডা পরিষ্কার জল নিশ্চিত করতে পাত্র ঘষে ধুয়ে নিন।',
    priority: 'high',
  },
];
