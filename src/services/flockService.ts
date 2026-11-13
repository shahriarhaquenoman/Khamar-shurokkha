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
import { FlockProfile, PoultrySpecies } from '../types';
import { INITIAL_FLOCKS } from '../data/initialData';

export interface FlockDocument {
  flockId: string;
  farmId: string;
  ownerUid: string;
  species: PoultrySpecies;
  batchName: string;
  birdCount: number;
  initialBirdCount: number;
  placementDate: string;
  ageDays: number;
  housingSystem: string;
  productionPurpose: string;
  currentStatus: 'active' | 'depleted' | 'culled' | 'archived';
  mortalityCount: number;
  sourceSupplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export function generateSecureFlockId(): string {
  const timePart = Date.now().toString(36).substring(4).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KS-FLK-${timePart}${randomPart}`;
}

export const flockService = {
  async createFlock(
    ownerUid: string,
    farmId: string,
    data: {
      poultryType: PoultrySpecies;
      batchName: string;
      initialBirdCount: number;
      placementDate: string;
      housingType?: string;
      sourceSupplier?: string;
      notes?: string;
    }
  ): Promise<FlockProfile> {
    const flockId = generateSecureFlockId();
    const now = new Date().toISOString();

    const placement = new Date(data.placementDate);
    const today = new Date();
    const ageDays = Math.max(0, Math.floor((today.getTime() - placement.getTime()) / (1000 * 60 * 60 * 24)));

    const record: FlockDocument = {
      flockId,
      farmId,
      ownerUid,
      species: data.poultryType,
      batchName: data.batchName,
      birdCount: data.initialBirdCount,
      initialBirdCount: data.initialBirdCount,
      placementDate: data.placementDate,
      ageDays,
      housingSystem: data.housingType || 'litter_floor',
      productionPurpose: data.poultryType.includes('layer') ? 'egg' : 'meat',
      currentStatus: 'active',
      mortalityCount: 0,
      sourceSupplier: data.sourceSupplier,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
      isDemo: ownerUid.startsWith('demo_user_'),
    };

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'flocks', flockId), record);
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return {
      id: flockId,
      farmId,
      poultryType: record.species,
      batchName: record.batchName,
      initialBirdCount: record.initialBirdCount,
      currentBirdCount: record.birdCount,
      placementDate: record.placementDate,
      ageDays: record.ageDays,
      sourceSupplier: record.sourceSupplier,
      purpose: record.productionPurpose as any,
      housingType: record.housingSystem as any,
      mortalityCount: 0,
      healthStatus: 'normal',
      status: 'active',
      notes: record.notes,
      createdAt: now,
    };
  },

  async getFlocksByFarm(farmId: string, ownerUid: string): Promise<FlockProfile[]> {
    const results: FlockProfile[] = [];

    // Include initial demo flocks if targeting demo
    if (ownerUid.startsWith('demo_user_')) {
      const demoMatches = INITIAL_FLOCKS.filter((f) => f.farmId === farmId);
      results.push(...demoMatches);
    }

    try {
      const q = query(
        collection(db, 'flocks'),
        where('farmId', '==', farmId),
        where('ownerUid', '==', ownerUid)
      );
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        const docData = d.data() as FlockDocument;
        if (docData.currentStatus !== 'archived') {
          results.push({
            id: docData.flockId,
            farmId: docData.farmId,
            poultryType: docData.species,
            batchName: docData.batchName,
            initialBirdCount: docData.initialBirdCount,
            currentBirdCount: docData.birdCount,
            placementDate: docData.placementDate,
            ageDays: docData.ageDays,
            sourceSupplier: docData.sourceSupplier,
            purpose: docData.productionPurpose as any,
            housingType: docData.housingSystem as any,
            mortalityCount: docData.mortalityCount || 0,
            healthStatus: 'normal',
            status: docData.currentStatus as any,
            notes: docData.notes,
            createdAt: docData.createdAt,
          });
        }
      });
    } catch (e) {
      console.warn('Error reading flocks from Firestore:', e);
    }

    const map = new Map<string, FlockProfile>();
    results.forEach((f) => map.set(f.id, f));
    return Array.from(map.values());
  },

  async updateFlock(flockId: string, updates: Partial<FlockDocument>): Promise<void> {
    try {
      const ref = doc(db, 'flocks', flockId);
      await updateDoc(ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }
  },

  async archiveFlock(flockId: string): Promise<void> {
    await this.updateFlock(flockId, { currentStatus: 'archived' });
  },
};
