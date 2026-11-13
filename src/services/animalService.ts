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
import { AnimalProfile, LivestockSpecies } from '../types';
import { INITIAL_ANIMALS } from '../data/initialData';

export interface AnimalDocument {
  animalId: string;
  farmId: string;
  ownerUid: string;
  species: LivestockSpecies;
  animalName: string;
  breed: string;
  sex: 'male' | 'female';
  estimatedAgeMonths: number;
  tagNumber?: string;
  currentStatus: 'healthy' | 'needs_attention' | 'isolated' | 'sold' | 'archived';
  productionStage?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export function generateSecureAnimalId(species: LivestockSpecies): string {
  const prefixMap: Record<LivestockSpecies, string> = {
    cattle: 'CAT',
    buffalo: 'BUF',
    goat: 'GOT',
    sheep: 'SHP',
  };
  const prefix = prefixMap[species] || 'LIV';
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timePart = Date.now().toString(36).substring(4).toUpperCase();
  return `KS-${prefix}-${timePart}${randomPart}`;
}

export const animalService = {
  async createAnimal(
    ownerUid: string,
    farmId: string,
    data: Omit<AnimalDocument, 'animalId' | 'farmId' | 'ownerUid' | 'createdAt' | 'updatedAt'>
  ): Promise<AnimalProfile> {
    const animalId = generateSecureAnimalId(data.species);
    const now = new Date().toISOString();

    const record: AnimalDocument = {
      ...data,
      animalId,
      farmId,
      ownerUid,
      createdAt: now,
      updatedAt: now,
      isDemo: ownerUid.startsWith('demo_user_'),
    };

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'animals', animalId), record);
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return {
      id: animalId,
      farmId,
      species: record.species,
      nameOrTag: record.animalName,
      tagNumber: record.tagNumber,
      breed: record.breed,
      sex: record.sex,
      estimatedAgeMonths: record.estimatedAgeMonths,
      healthStatus: (record.currentStatus as any) || 'healthy',
      productionStage: (record.productionStage as any) || 'growing',
      photoUrl: record.photoUrl,
      notes: record.notes,
      createdAt: now,
    };
  },

  async getAnimalsByFarm(farmId: string, ownerUid: string): Promise<AnimalProfile[]> {
    const results: AnimalProfile[] = [];

    // Include initial demo animals if targeting demo farm
    if (ownerUid.startsWith('demo_user_')) {
      const demoMatches = INITIAL_ANIMALS.filter((a) => a.farmId === farmId);
      results.push(...demoMatches);
    }

    try {
      const q = query(
        collection(db, 'animals'),
        where('farmId', '==', farmId),
        where('ownerUid', '==', ownerUid)
      );
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        const docData = d.data() as AnimalDocument;
        if (docData.currentStatus !== 'archived') {
          results.push({
            id: docData.animalId,
            farmId: docData.farmId,
            species: docData.species,
            nameOrTag: docData.animalName,
            tagNumber: docData.tagNumber,
            breed: docData.breed,
            sex: docData.sex,
            estimatedAgeMonths: docData.estimatedAgeMonths,
            healthStatus: (docData.currentStatus as any) || 'healthy',
            productionStage: (docData.productionStage as any) || 'growing',
            photoUrl: docData.photoUrl,
            notes: docData.notes,
            createdAt: docData.createdAt,
          });
        }
      });
    } catch (e) {
      console.warn('Error reading animals from Firestore:', e);
    }

    const map = new Map<string, AnimalProfile>();
    results.forEach((a) => map.set(a.id, a));
    return Array.from(map.values());
  },

  async updateAnimal(animalId: string, updates: Partial<AnimalDocument>): Promise<void> {
    try {
      const ref = doc(db, 'animals', animalId);
      await updateDoc(ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }
  },

  async archiveAnimal(animalId: string): Promise<void> {
    await this.updateAnimal(animalId, { currentStatus: 'archived' });
  },
};
