import {
  AnimalProfile,
  FlockProfile,
  PreventiveProtocol,
  ScheduledCareTask,
  Species,
} from '../types';
import { AUTHORIZED_PROTOCOLS } from '../data/protocolData';

/**
 * Matches an animal or flock profile against authorized protocols
 * and determines applicable scheduled care tasks.
 */
export function getApplicableProtocols(
  species: Species,
  ageInDays: number
): {
  applicable: PreventiveProtocol[];
  requiresVetConsultation: boolean;
  notes: string;
} {
  const approvedProtocols = AUTHORIZED_PROTOCOLS.filter(
    (p) => p.approvalStatus === 'approved' && p.species.includes(species)
  );

  const matched = approvedProtocols.filter((p) => {
    if (p.minAgeDays && ageInDays < p.minAgeDays) return false;
    if (p.maxAgeDays && ageInDays > p.maxAgeDays) return false;
    return true;
  });

  return {
    applicable: matched,
    requiresVetConsultation: matched.length === 0,
    notes:
      matched.length === 0
        ? 'প্রাণীর বয়স ও পূর্ববর্তী রেকর্ডের অপর্যাপ্ততার কারণে বিশেষজ্ঞ ভেটেরিনারি চিকিৎসকের পরামর্শ প্রয়োজন।'
        : 'অনুমোদিত জাতীয় ডিপিআরএস ও এলআরআই প্রটোকল অনুযায়ী প্রযোজ্য।',
  };
}

/**
 * Helper to generate systematic IDs
 */
export function generateAnimalId(species: string, existingCount: number): string {
  let prefix = 'CAT';
  if (species === 'buffalo') prefix = 'BUF';
  else if (species === 'goat') prefix = 'GOT';
  else if (species === 'sheep') prefix = 'SHP';
  const num = String(existingCount + 1).padStart(4, '0');
  return `KS-${prefix}-${num}`;
}

export function generateFlockId(existingCount: number): string {
  const num = String(existingCount + 1).padStart(4, '0');
  return `KS-FLK-${num}`;
}

export function generateFarmId(existingCount: number): string {
  const num = String(existingCount + 1).padStart(4, '0');
  return `KS-FARM-${num}`;
}

/**
 * Automatically creates initial scheduled care tasks for a newly registered animal
 * strictly based on approved veterinary protocol templates.
 */
export function createInitialTasksForAnimal(animal: AnimalProfile): ScheduledCareTask[] {
  const ageDays = (animal.estimatedAgeMonths || 6) * 30;
  const { applicable } = getApplicableProtocols(animal.species, ageDays);

  return applicable.map((proto, idx) => {
    const due = new Date();
    due.setDate(due.getDate() + 7 * (idx + 1));
    const dueDateStr = due.toISOString().split('T')[0];

    return {
      id: `task_${animal.id}_${proto.id}_${Date.now()}_${idx}`,
      farmId: animal.farmId,
      targetType: 'animal' as const,
      targetId: animal.id,
      targetName: `${animal.nameOrTag} (${animal.id})`,
      species: animal.species,
      careType: proto.careType,
      titleBn: proto.titleBn,
      titleEn: proto.titleEn,
      descriptionBn: proto.targetAgeRuleBn,
      descriptionEn: proto.targetAgeRuleEn,
      protocolId: proto.id,
      dueDate: dueDateStr,
      status: (idx === 0 ? 'due_soon' : 'upcoming') as 'due_soon' | 'upcoming',
    };
  });
}

/**
 * Automatically creates initial care tasks for a poultry flock
 */
export function createInitialTasksForFlock(flock: FlockProfile): ScheduledCareTask[] {
  const { applicable } = getApplicableProtocols(flock.poultryType, flock.ageDays);

  return applicable.map((proto, idx) => {
    const due = new Date();
    due.setDate(due.getDate() + (idx === 0 ? 1 : 7));
    const dueDateStr = due.toISOString().split('T')[0];

    return {
      id: `task_${flock.id}_${proto.id}_${Date.now()}_${idx}`,
      farmId: flock.farmId,
      targetType: 'flock' as const,
      targetId: flock.id,
      targetName: `${flock.batchName} (${flock.id})`,
      species: flock.poultryType,
      careType: proto.careType,
      titleBn: proto.titleBn,
      titleEn: proto.titleEn,
      descriptionBn: proto.targetAgeRuleBn,
      descriptionEn: proto.targetAgeRuleEn,
      protocolId: proto.id,
      dueDate: dueDateStr,
      status: (idx === 0 ? 'due_soon' : 'upcoming') as 'due_soon' | 'upcoming',
    };
  });
}
