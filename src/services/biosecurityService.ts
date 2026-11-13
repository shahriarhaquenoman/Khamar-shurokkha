import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BiosecurityTaskItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: 'hygiene' | 'access_control' | 'waste_management' | 'water_feed';
  descriptionBn: string;
  priority: 'critical' | 'high' | 'medium';
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

export interface BiosecurityChecklistRecord {
  checklistId: string;
  farmId: string;
  ownerUid: string;
  date: string;
  itemsCompleted: string[]; // IDs of tasks completed
  totalItems: number;
  scorePercent: number;
  inspectorName: string;
  notes?: string;
  createdAt: string;
}

export const biosecurityService = {
  // Get checklist for a specific farm on a specific date
  async getDailyChecklist(
    farmId: string,
    ownerUid: string,
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<BiosecurityChecklistRecord | null> {
    const checklistId = `bio_${farmId}_${date}`;

    // Read from Firestore if authenticated
    try {
      const snap = await getDoc(doc(db, 'biosecurityChecklists', checklistId));
      if (snap.exists()) {
        return snap.data() as BiosecurityChecklistRecord;
      }
    } catch (e) {
      console.warn('Error reading biosecurity checklist from Firestore:', e);
    }

    // Check localStorage fallback for demo/offline
    const cached = localStorage.getItem(`bio_check_${checklistId}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }

    return null;
  },

  // Save or update checklist
  async saveDailyChecklist(
    farmId: string,
    ownerUid: string,
    date: string,
    completedItemIds: string[],
    inspectorName: string,
    notes?: string
  ): Promise<BiosecurityChecklistRecord> {
    const checklistId = `bio_${farmId}_${date}`;
    const totalItems = STANDARD_BIOSECURITY_TASKS.length;
    const scorePercent = Math.round((completedItemIds.length / totalItems) * 100);

    const record: BiosecurityChecklistRecord = {
      checklistId,
      farmId,
      ownerUid,
      date,
      itemsCompleted: completedItemIds,
      totalItems,
      scorePercent,
      inspectorName,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    // Cache locally
    localStorage.setItem(`bio_check_${checklistId}`, JSON.stringify(record));

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'biosecurityChecklists', checklistId), record, { merge: true });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return record;
  },

  // Get historical checklists for trend overview
  async getRecentChecklists(farmId: string, ownerUid: string): Promise<BiosecurityChecklistRecord[]> {
    const results: BiosecurityChecklistRecord[] = [];

    try {
      const q = query(
        collection(db, 'biosecurityChecklists'),
        where('farmId', '==', farmId),
        where('ownerUid', '==', ownerUid)
      );
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        results.push(d.data() as BiosecurityChecklistRecord);
      });
    } catch (e) {
      console.warn('Error listing biosecurity checklists from Firestore:', e);
    }

    return results.sort((a, b) => b.date.localeCompare(a.date));
  },
};
