import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppNotification, NavScreen } from '../types';

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_001',
    ownerUid: 'demo_user_rafiq_001',
    farmId: 'KS-DEMO-001',
    category: 'vaccination',
    titleBn: 'আজকের নির্ধারিত টিকাদান: ব্রয়লার ব্যাচ ০৪',
    titleEn: 'Scheduled Vaccination: Broiler Batch 04',
    bodyBn: 'আজ ব্রয়লার ব্যাচ ০৪ এর জন্য গামবোরো বা আইবিডি (IBD) বুস্টার টিকাদানের নির্ধারিত দিন। পানির পাত্র প্রস্তুত রাখুন।',
    bodyEn: 'Broiler Batch 04 is 14 days old. Administer IBD booster vaccine today.',
    targetScreen: 'calendar',
    targetTaskId: 'task_002_ibd_booster_today',
    targetId: 'KS-FLK-0001',
    sourceModule: 'Preventive Care Calendar',
    isRead: false,
    createdAt: '2026-11-12T06:00:00Z',
    deliveryChannel: 'in_app',
    isSimulated: true,
  },
  {
    id: 'notif_002',
    ownerUid: 'demo_user_rafiq_001',
    farmId: 'KS-DEMO-001',
    category: 'deworming',
    titleBn: 'কৃমিনাশক পর্যালোচনা প্রয়োজন: চান্দের আলো',
    titleEn: 'Deworming Review Overdue: Chander Alo',
    bodyBn: 'দুধের গাভী চান্দের আলোর (KS-CAT-0002) কৃমিনাশকের নির্ধারিত সময় অতিবাহিত হয়েছে। চিকিৎসকের সাথে আলোচনা করে নিরাপদ ডোজ প্রয়োগ করুন।',
    bodyEn: 'Deworming review for dairy cow Chander Alo (KS-CAT-0002) is overdue by 3 days.',
    targetScreen: 'calendar',
    targetId: 'KS-CAT-0002',
    sourceModule: 'Preventive Care Calendar',
    isRead: false,
    createdAt: '2026-11-10T08:00:00Z',
    deliveryChannel: 'in_app',
    isSimulated: true,
  },
  {
    id: 'notif_003',
    ownerUid: 'demo_user_rafiq_001',
    farmId: 'KS-DEMO-001',
    category: 'biosecurity',
    titleBn: 'দৈনিক জীবনিরাপত্তা ও ফুটবাথ চেক সম্পন্ন করুন',
    titleEn: 'Daily Biosecurity & Footbath Check Required',
    bodyBn: 'শেডে প্রবেশের আগে ফুটবাথের জীবাণুনাশক দ্রবণ পরিবর্তন এবং বহিরাগতদের প্রবেশের তথ্য লগবইয়ে লিপিবদ্ধ করুন।',
    bodyEn: 'Replenish disinfectant in entryway footbaths and log farm visitors.',
    targetScreen: 'biosecurity',
    sourceModule: 'BioShield Action Planner',
    isRead: true,
    createdAt: '2026-11-11T07:30:00Z',
    deliveryChannel: 'in_app',
    isSimulated: true,
  },
  {
    id: 'notif_004',
    ownerUid: 'demo_user_rafiq_001',
    farmId: 'KS-DEMO-001',
    category: 'alert',
    titleBn: 'আঞ্চলিক সতর্কতা: খুরারোগ (FMD) সচেতনতা',
    titleEn: 'Regional Advisory: FMD Disease Watch',
    bodyBn: 'মাধবপুর ও সংলগ্ন করিডোরে খুরারোগের মৌসুমী সতর্কতা জারি করা হয়েছে। খামারে জীবনিরাপত্তা জোরদার করুন।',
    bodyEn: 'Seasonal Foot & Mouth Disease advisory issued for Madhabpur corridor.',
    targetScreen: 'regional_alerts',
    sourceModule: 'Regional Disease Surveillance',
    sourceAdvisoryId: 'alert_fmd_hbj_01',
    isRead: false,
    createdAt: '2026-11-11T09:00:00Z',
    deliveryChannel: 'in_app',
    isSimulated: false,
  },
];

export function normalizeNotification(raw: any): AppNotification {
  const isRead = typeof raw.isRead === 'boolean' ? raw.isRead : Boolean(raw.readStatus);
  const titleBn = raw.titleBn || raw.title || '';
  const titleEn = raw.titleEn || raw.title || '';
  const bodyBn = raw.bodyBn || raw.message || '';
  const bodyEn = raw.bodyEn || raw.message || '';

  let category: AppNotification['category'] = 'system';
  const type = raw.category || raw.notificationType;
  if (type === 'vaccine_reminder' || type === 'vaccination') category = 'vaccination';
  else if (type === 'deworm_reminder' || type === 'deworming') category = 'deworming';
  else if (type === 'biosecurity_alert' || type === 'biosecurity') category = 'biosecurity';
  else if (type === 'outbreak_warning' || type === 'alert') category = 'alert';
  else if (type === 'consultation') category = 'consultation';
  else if (type === 'weather') category = 'weather';

  let targetScreen: NavScreen | undefined = raw.targetScreen;
  if (!targetScreen) {
    if (category === 'vaccination' || category === 'deworming') targetScreen = 'calendar';
    else if (category === 'biosecurity') targetScreen = 'biosecurity';
    else if (category === 'alert' || category === 'weather') targetScreen = 'regional_alerts';
    else if (category === 'consultation') targetScreen = 'vet_services';
  }

  return {
    id: String(raw.id),
    ownerUid: raw.ownerUid || 'demo_user_rafiq_001',
    farmId: raw.farmId,
    category,
    titleBn,
    titleEn,
    bodyBn,
    bodyEn,
    targetScreen,
    targetId: raw.targetId || raw.relatedAnimalId,
    targetTaskId: raw.targetTaskId || raw.relatedCareTaskId,
    sourceModule: raw.sourceModule,
    sourceAdvisoryId: raw.sourceAdvisoryId,
    isRead,
    readTimestamp: raw.readTimestamp,
    createdAt: raw.createdAt || raw.scheduledAt || new Date().toISOString(),
    deliveryChannel: raw.deliveryChannel || 'in_app',
    isSimulated: raw.isSimulated !== undefined ? raw.isSimulated : true,
  };
}

export const notificationService = {
  async getNotificationsByOwner(ownerUid: string): Promise<AppNotification[]> {
    const list: AppNotification[] = [];

    // Always seed baseline demo notifications if demo user
    if (ownerUid.startsWith('demo_user_') || ownerUid === 'demo_user_rafiq_001') {
      list.push(...DEFAULT_NOTIFICATIONS);
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('ownerUid', '==', ownerUid)
      );
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        list.push(normalizeNotification(d.data()));
      });
    } catch (e) {
      console.warn('Error fetching notifications from Firestore:', e);
    }

    const map = new Map<string, AppNotification>();
    list.forEach((n) => map.set(n.id, n));
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async listNotifications(ownerUid: string): Promise<AppNotification[]> {
    return this.getNotificationsByOwner(ownerUid);
  },

  async createNotification(
    ownerUid: string,
    data: Omit<AppNotification, 'id' | 'ownerUid' | 'createdAt'>
  ): Promise<AppNotification> {
    const id = `notif_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const notif: AppNotification = {
      ...data,
      id,
      ownerUid,
      createdAt: new Date().toISOString(),
    };

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'notifications', id), {
          ...notif,
          readStatus: notif.isRead,
          title: notif.titleBn,
          message: notif.bodyBn,
        });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return notif;
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        readStatus: true,
        readTimestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }
  },

  async markAllAsRead(ownerUid: string, currentNotifications: AppNotification[]): Promise<void> {
    const unread = currentNotifications.filter((n) => !n.isRead);
    for (const n of unread) {
      if (!ownerUid.startsWith('demo_user_')) {
        try {
          await updateDoc(doc(db, 'notifications', n.id), {
            isRead: true,
            readStatus: true,
            readTimestamp: new Date().toISOString(),
          });
        } catch (_) {}
      }
    }
  },
};
