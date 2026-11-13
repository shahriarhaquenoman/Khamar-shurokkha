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
import { ScheduledCareTask, CareRecord, PreventiveProtocol } from '../types';
import {
  INITIAL_SCHEDULED_TASKS,
  INITIAL_CARE_RECORDS,
} from '../data/initialData';
import { AUTHORIZED_PROTOCOLS } from '../data/protocolData';

export const careService = {
  // Read approved veterinary protocols
  getApprovedProtocols(): PreventiveProtocol[] {
    return AUTHORIZED_PROTOCOLS.filter((p) => p.approvalStatus === 'approved');
  },

  // Get scheduled care tasks for a specific farm
  async getTasksByFarm(farmId: string, ownerUid: string): Promise<ScheduledCareTask[]> {
    const results: ScheduledCareTask[] = [];

    if (ownerUid.startsWith('demo_user_')) {
      const demoTasks = INITIAL_SCHEDULED_TASKS.filter((t) => t.farmId === farmId);
      results.push(...demoTasks);
    }

    try {
      const q = query(
        collection(db, 'careTasks'),
        where('farmId', '==', farmId),
        where('ownerUid', '==', ownerUid)
      );
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        const data = d.data() as ScheduledCareTask;
        results.push(data);
      });
    } catch (e) {
      console.warn('Error reading care tasks from Firestore:', e);
    }

    const map = new Map<string, ScheduledCareTask>();
    results.forEach((t) => map.set(t.id, t));
    return Array.from(map.values());
  },

  // Create scheduled care task
  async createTask(
    ownerUid: string,
    taskData: Omit<ScheduledCareTask, 'id'>
  ): Promise<ScheduledCareTask> {
    const taskId = `task_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const fullTask: ScheduledCareTask = {
      ...taskData,
      id: taskId,
    };

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'careTasks', taskId), {
          ...fullTask,
          ownerUid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return fullTask;
  },

  // Mark task completed and create linked CareRecord
  async completeCareTask(
    taskId: string,
    ownerUid: string,
    task: ScheduledCareTask,
    administeredBy: string = 'খামারি নিজে',
    productName?: string,
    notes?: string
  ): Promise<{ updatedTask: ScheduledCareTask; careRecord: CareRecord }> {
    const today = new Date().toISOString().split('T')[0];
    const recordId = `rec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    const careRecord: CareRecord = {
      id: recordId,
      farmId: task.farmId,
      targetType: task.targetType,
      targetId: task.targetId,
      species: task.species,
      careType: task.careType,
      diseaseOrTarget: task.titleBn,
      productName: productName || task.productName || 'অনুমোদিত মানসম্মত ওষুধ/ভ্যাকসিন',
      dateAdministered: today,
      administeredBy,
      notes: notes || task.descriptionBn,
      status: 'completed',
    };

    const updatedTask: ScheduledCareTask = {
      ...task,
      status: 'completed',
      completedDate: today,
      administeredBy,
      productName: productName || task.productName,
    };

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        // Save care record
        await setDoc(doc(db, 'careRecords', recordId), {
          ...careRecord,
          ownerUid,
          createdAt: new Date().toISOString(),
        });

        // Update task
        await updateDoc(doc(db, 'careTasks', taskId), {
          status: 'completed',
          completedDate: today,
          administeredBy,
          productName: careRecord.productName,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return { updatedTask, careRecord };
  },

  async completeTask(
    taskId: string,
    administeredBy: string = 'খামারি নিজে',
    ownerUid: string = 'demo_user_rafiq_001',
    task?: ScheduledCareTask
  ): Promise<void> {
    if (task) {
      await this.completeCareTask(taskId, ownerUid, task, administeredBy);
    } else if (!ownerUid.startsWith('demo_user_')) {
      try {
        await updateDoc(doc(db, 'careTasks', taskId), {
          status: 'completed',
          completedDate: new Date().toISOString().split('T')[0],
          administeredBy,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore update warning:', e);
      }
    }
  },

  // Read care records (history of administered vaccines & dewormings)
  async getCareRecordsByFarm(farmId: string, ownerUid: string): Promise<CareRecord[]> {
    const results: CareRecord[] = [];

    if (ownerUid.startsWith('demo_user_')) {
      const demoRecords = INITIAL_CARE_RECORDS.filter((r) => r.farmId === farmId);
      results.push(...demoRecords);
    }

    try {
      const q = query(
        collection(db, 'careRecords'),
        where('farmId', '==', farmId),
        where('ownerUid', '==', ownerUid)
      );
      const snaps = await getDocs(q);
      snaps.forEach((d) => {
        const data = d.data() as CareRecord;
        results.push(data);
      });
    } catch (e) {
      console.warn('Error reading care records from Firestore:', e);
    }

    const map = new Map<string, CareRecord>();
    results.forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  },

  // Create care record directly (e.g. ad-hoc vaccination log)
  async createCareRecordDirectly(
    ownerUid: string,
    recordData: Omit<CareRecord, 'id'>
  ): Promise<CareRecord> {
    const recordId = `rec_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const fullRecord: CareRecord = {
      ...recordData,
      id: recordId,
    };

    if (!ownerUid.startsWith('demo_user_')) {
      try {
        await setDoc(doc(db, 'careRecords', recordId), {
          ...fullRecord,
          ownerUid,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
    }

    return fullRecord;
  },
};
