import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FarmProfile } from '../types';
import { INITIAL_DEMO_FARMS } from '../data/initialData';

export interface FarmDocument {
  farmId: string;
  ownerUid: string;
  farmName: string;
  district: string;
  upazila: string;
  speciesPresent: string[];
  farmType: string;
  status: 'active' | 'archived';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

// Secure collision-resistant Farm ID generator
export function generateSecureFarmId(): string {
  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KS-FARM-${timestampPart}-${randomPart}`;
}

export const farmService = {
  // Create a new farm in Firestore
  async createFarm(
    ownerUid: string,
    farmData: {
      name: string;
      district: string;
      upazila: string;
      speciesPresent: string[];
      farmType?: string;
      notes?: string;
    }
  ): Promise<FarmProfile> {
    const farmId = generateSecureFarmId();
    const now = new Date().toISOString();

    const record: FarmDocument = {
      farmId,
      ownerUid,
      farmName: farmData.name,
      district: farmData.district,
      upazila: farmData.upazila,
      speciesPresent: farmData.speciesPresent,
      farmType: farmData.farmType || 'mixed_farm',
      status: 'active',
      notes: farmData.notes || '',
      createdAt: now,
      updatedAt: now,
      isDemo: ownerUid.startsWith('demo_user_'),
    };

    // Save in Firestore if real user
    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'farms', farmId), record);
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return {
      id: farmId,
      name: record.farmName,
      ownerName: record.farmName,
      ownerUid: record.ownerUid,
      ownerPhone: '',
      district: record.district,
      upazila: record.upazila,
      farmTypes: [(record.farmType as any) || 'mixed'],
      farmType: record.farmType,
      speciesPresent: record.speciesPresent as any,
      approximateHeadCount: 50,
      housingSystem: 'intensive',
      registeredDate: now,
      registeredAt: now,
      isDemo: record.isDemo,
    };
  },

  // Read farm by ID
  async getFarm(farmId: string): Promise<FarmDocument | null> {
    try {
      const snap = await getDoc(doc(db, 'farms', farmId));
      if (snap.exists()) {
        return snap.data() as FarmDocument;
      }
    } catch (e) {
      console.warn('Error reading farm from Firestore:', e);
    }
    // Check initial demo farms
    const demo = INITIAL_DEMO_FARMS.find((f) => f.id === farmId);
    if (demo) {
      return {
        farmId: demo.id,
        ownerUid: demo.ownerUid || 'demo_user_rafiq_001',
        farmName: demo.name,
        district: demo.district,
        upazila: demo.upazila,
        speciesPresent: (demo.speciesPresent || []) as string[],
        farmType: demo.farmType || 'mixed_farm',
        status: 'active',
        createdAt: demo.registeredDate,
        updatedAt: demo.registeredDate,
        isDemo: true,
      };
    }
    return null;
  },

  // List all farms belonging to an authenticated owner
  async listFarmsByOwner(ownerUid: string): Promise<FarmProfile[]> {
    const results: FarmProfile[] = [];

    // If demo owner, include demo farms associated with this user
    if (ownerUid.startsWith('demo_user_')) {
      const demoFarms = INITIAL_DEMO_FARMS.filter(
        (f) => !f.ownerUid || f.ownerUid === ownerUid
      );
      results.push(...demoFarms);
    }

    // Query Firestore for this owner's farms
    try {
      const q = query(collection(db, 'farms'), where('ownerUid', '==', ownerUid));
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        const data = d.data() as FarmDocument;
        if (data.status !== 'archived') {
          results.push({
            id: data.farmId,
            name: data.farmName,
            ownerName: data.farmName,
            ownerUid: data.ownerUid,
            ownerPhone: '',
            district: data.district,
            upazila: data.upazila,
            farmTypes: [(data.farmType as any) || 'mixed'],
            farmType: data.farmType,
            speciesPresent: (data.speciesPresent || []) as any,
            approximateHeadCount: 50,
            housingSystem: 'intensive',
            registeredDate: data.createdAt,
            registeredAt: data.createdAt,
            isDemo: data.isDemo,
          });
        }
      });
    } catch (e) {
      console.warn('Error listing farms from Firestore:', e);
    }

    // Deduplicate by ID
    const uniqueMap = new Map<string, FarmProfile>();
    results.forEach((f) => uniqueMap.set(f.id, f));
    return Array.from(uniqueMap.values());
  },

  // Update farm details
  async updateFarm(farmId: string, updates: Partial<FarmDocument>): Promise<void> {
    try {
      const ref = doc(db, 'farms', farmId);
      await updateDoc(ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }
  },

  // Archive farm
  async archiveFarm(farmId: string): Promise<void> {
    await this.updateFarm(farmId, { status: 'archived' });
  },
};
