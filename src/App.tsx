/**
 * Khamar Shurokkha (খামার সুরক্ষা)
 * Integrated Multi-Species Farm Identity, Animal Health, Preventive Care & Early-Warning Platform
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Language,
  UserRole,
  NavScreen,
  FarmProfile,
  AnimalProfile,
  FlockProfile,
  ScheduledCareTask,
  CareRecord,
  HealthEventReport,
  VetConsultationRequest,
  RegionalAlert,
  WeatherInfo,
  AppNotification,
  AuditItemAnswer,
  AuditResponse,
  ActionPlanItem,
  JudgeXRayExplanation,
  ActionStatus,
  CriticalAlert,
  KhamarBondhuMessage,
} from './types';
import {
  INITIAL_DEMO_FARMS,
  INITIAL_ANIMALS,
  INITIAL_FLOCKS,
  INITIAL_SCHEDULED_TASKS,
  INITIAL_CARE_RECORDS,
  INITIAL_HEALTH_EVENTS,
  INITIAL_VET_REQUESTS,
  INITIAL_REGIONAL_ALERTS,
  INITIAL_WEATHER_INFO,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { DEMO_CURRENT_AUDIT, DEMO_INITIAL_ACTIONS } from './data/advisorDemoData';
import { generateAdaptiveActionPlan } from './utils/engine';
import { AUTHORIZED_PROTOCOLS } from './data/protocolData';
import { createInitialTasksForAnimal, createInitialTasksForFlock } from './utils/careEngine';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { DashboardScreen } from './components/DashboardScreen';
import { AnimalsScreen } from './components/AnimalsScreen';
import { PreventiveCareScreen } from './components/PreventiveCareScreen';
import { HealthSupportScreen } from './components/HealthSupportScreen';
import { KnowledgeLibraryScreen } from './components/KnowledgeLibraryScreen';
import { ActionUpdatePayload } from './components/BioShieldTaskDetailModal';
import { BiosecurityModuleScreen } from './components/BiosecurityModuleScreen';
import { RegionalAlertsScreen } from './components/RegionalAlertsScreen';
import { USSDSimulatorScreen } from './components/USSDSimulatorScreen';
import { GovernancePortalScreen } from './components/GovernancePortalScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DEFAULT_KHAMAR_BONDHU_WELCOME } from './components/AIAssistantScreen';
import { JudgeWalkthroughOverlay } from './components/JudgeWalkthroughOverlay';
import { KhamarBondhuFloatingButton } from './components/KhamarBondhuFloatingButton';
import {
  JUDGE_WALKTHROUGH_STEPS,
  JUDGE_DEMO_ACCOUNT,
  JUDGE_DEMO_FARM,
  JUDGE_DEMO_ANIMALS,
  JUDGE_DEMO_FLOCKS,
  JUDGE_DEMO_TASKS,
  JUDGE_DEMO_CARE_RECORDS,
  JUDGE_DEMO_AUDIT_ANSWERS,
  JUDGE_DEMO_ACTIONS,
  JUDGE_DEMO_VET_REQUESTS,
  JUDGE_DEMO_HEALTH_EVENTS,
  JUDGE_DEMO_ALERTS,
  JUDGE_DEMO_NOTIFICATIONS,
  JUDGE_DEMO_CHAT_HISTORY,
} from './data/judgeDemoDataset';
import { CriticalRiskModal } from './components/CriticalRiskModal';
import { AuthModal } from './components/AuthModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { FarmerAccount, authService, DEMO_FARMER_ACCOUNTS } from './services/authService';
import { farmService } from './services/farmService';
import { animalService } from './services/animalService';
import { flockService } from './services/flockService';
import { careService } from './services/careService';
import { notificationService } from './services/notificationService';

const STORAGE_PREFIX = 'khamar_shurokkha_v2_';
const JUDGE_SNAPSHOT_STORAGE_KEY = 'khamar_shurokkha_judge_snapshot_v1';

interface RealModeSnapshot {
  currentUser: FarmerAccount | null;
  isDemoActive: boolean;
  allFarms: FarmProfile[];
  currentFarm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  tasks: ScheduledCareTask[];
  careRecords: CareRecord[];
  healthEvents: HealthEventReport[];
  vetRequests: VetConsultationRequest[];
  notifications: AppNotification[];
  auditAnswers: Record<string, AuditItemAnswer>;
  actions: ActionPlanItem[];
  currentScreen: NavScreen;
}

export default function App() {
  // 1. Core Language & Role State (Bangla by default)
  const [lang, setLang] = useState<Language>(() => {
    try {
      return (localStorage.getItem(`${STORAGE_PREFIX}lang`) as Language) || 'bn';
    } catch {
      return 'bn';
    }
  });

  const [role, setRole] = useState<UserRole>('farmer');
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('dashboard');
  const [knowledgeTopicKey, setKnowledgeTopicKey] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);

  // User Authentication & Backend State
  const [currentUser, setCurrentUser] = useState<FarmerAccount | null>(() => {
    return DEMO_FARMER_ACCOUNTS['demo-rafiq'];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotifCenterOpen, setIsNotifCenterOpen] = useState(false);

  // 2. Farm Profiles State
  const [allFarms, setAllFarms] = useState<FarmProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}all_farms`);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_FARMS;
    } catch {
      return INITIAL_DEMO_FARMS;
    }
  });

  const [currentFarm, setCurrentFarm] = useState<FarmProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}current_farm`);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_FARMS[0];
    } catch {
      return INITIAL_DEMO_FARMS[0];
    }
  });

  // 3. Multi-Species Animals & Flocks
  const [animals, setAnimals] = useState<AnimalProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}animals`);
      return saved ? JSON.parse(saved) : INITIAL_ANIMALS;
    } catch {
      return INITIAL_ANIMALS;
    }
  });

  const [flocks, setFlocks] = useState<FlockProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}flocks`);
      return saved ? JSON.parse(saved) : INITIAL_FLOCKS;
    } catch {
      return INITIAL_FLOCKS;
    }
  });

  // 4. Preventive Health: Tasks & Records
  const [tasks, setTasks] = useState<ScheduledCareTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}tasks`);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_TASKS;
    } catch {
      return INITIAL_SCHEDULED_TASKS;
    }
  });

  const [careRecords, setCareRecords] = useState<CareRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}care_records`);
      return saved ? JSON.parse(saved) : INITIAL_CARE_RECORDS;
    } catch {
      return INITIAL_CARE_RECORDS;
    }
  });

  // 5. Health Events & Vet Requests
  const [healthEvents, setHealthEvents] = useState<HealthEventReport[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}health_events`);
      return saved ? JSON.parse(saved) : INITIAL_HEALTH_EVENTS;
    } catch {
      return INITIAL_HEALTH_EVENTS;
    }
  });

  const [vetRequests, setVetRequests] = useState<VetConsultationRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}vet_requests`);
      return saved ? JSON.parse(saved) : INITIAL_VET_REQUESTS;
    } catch {
      return INITIAL_VET_REQUESTS;
    }
  });

  // 6. Regional Alerts, Weather & Notifications
  const [regionalAlerts, setRegionalAlerts] = useState<RegionalAlert[]>(INITIAL_REGIONAL_ALERTS);
  const [weather] = useState<WeatherInfo>(INITIAL_WEATHER_INFO);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 7. Biosecurity Assessment State
  const [auditAnswers, setAuditAnswers] = useState<Record<string, AuditItemAnswer>>(DEMO_CURRENT_AUDIT.answers);
  const [actions, setActions] = useState<ActionPlanItem[]>(DEMO_INITIAL_ACTIONS);
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([]);
  const [xRayExplanations, setXRayExplanations] = useState<JudgeXRayExplanation[]>([]);
  const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);

  // Preset context targets for cross-screen workflow
  const [presetAnimalForVet, setPresetAnimalForVet] = useState<AnimalProfile | null>(null);
  const [presetContextForAI, setPresetContextForAI] = useState<{ id: string; name: string; species: string } | null>(null);
  const [presetCareTarget, setPresetCareTarget] = useState<{ targetId?: string; type?: 'vaccination' | 'deworming' } | null>(null);

  // Health Support active sub-tab + Persistent Khamar Bondhu Chat History
  const [healthSubTab, setHealthSubTab] = useState<'vet' | 'bondhu'>('vet');
  const [chatMessages, setChatMessages] = useState<KhamarBondhuMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}chat_${currentFarm.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [DEFAULT_KHAMAR_BONDHU_WELCOME(lang)];
  });

  // Competition Judge Demo Mode + Guided Walkthrough (Isolated Snapshot-Restore)
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);
  const [walkthroughStepIndex, setWalkthroughStepIndex] = useState<number>(0);
  const isJudgeDemoRef = useRef<boolean>(false);
  const realSnapshotRef = useRef<RealModeSnapshot | null>(null);

  useEffect(() => {
    isJudgeDemoRef.current = isJudgeDemoActive;
  }, [isJudgeDemoActive]);

  // Reload scoped chat history when switching farms in normal mode
  useEffect(() => {
    if (isJudgeDemoRef.current) return;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}chat_${currentFarm.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatMessages(parsed);
          return;
        }
      }
    } catch {}
    setChatMessages([DEFAULT_KHAMAR_BONDHU_WELCOME(lang)]);
  }, [currentFarm.id]);

  // Persist chat history in normal mode only
  useEffect(() => {
    if (isJudgeDemoRef.current) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}chat_${currentFarm.id}`, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages, currentFarm.id]);

  // Initialize biosecurity explanations for the active farm
  useEffect(() => {
    const res = generateAdaptiveActionPlan(currentFarm, auditAnswers, `audit_${currentFarm.id}`);
    setCriticalAlerts(res.criticalAlerts);
    setXRayExplanations(res.xRayExplanations);
  }, [currentFarm.id]);

  // Listen for real Firebase auth state and load user farms & notifications
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuth(async (account) => {
      if (isJudgeDemoRef.current) return;
      if (account) {
        setCurrentUser(account);
        setIsDemoActive(account.isDemo);

        try {
          const userFarms = await farmService.listFarmsByOwner(account.uid);
          if (userFarms.length > 0 && !isJudgeDemoRef.current) {
            setAllFarms(userFarms);
            setCurrentFarm((prev) => {
              const matched = userFarms.find((f) => f.id === prev.id);
              return matched || userFarms[0];
            });
          }
        } catch (e) {
          console.warn('Error loading farms for user:', e);
        }

        try {
          const notifs = await notificationService.listNotifications(account.uid);
          if (!isJudgeDemoRef.current) {
            setNotifications(notifs);
          }
        } catch (e) {
          console.warn('Error loading notifications:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRefreshNotifications = async () => {
    const uid = currentUser?.uid || currentFarm.ownerUid || 'demo_user_rafiq_001';
    try {
      const notifs = await notificationService.listNotifications(uid);
      setNotifications(notifs);
    } catch (e) {
      console.warn('Error refreshing notifications:', e);
    }
  };

  // Sync to localStorage (Paused during Judge Demo Mode so real user records are never overwritten)
  useEffect(() => {
    if (isJudgeDemoActive) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}lang`, lang);
      localStorage.setItem(`${STORAGE_PREFIX}current_farm`, JSON.stringify(currentFarm));
      localStorage.setItem(`${STORAGE_PREFIX}all_farms`, JSON.stringify(allFarms));
      localStorage.setItem(`${STORAGE_PREFIX}animals`, JSON.stringify(animals));
      localStorage.setItem(`${STORAGE_PREFIX}flocks`, JSON.stringify(flocks));
      localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_PREFIX}care_records`, JSON.stringify(careRecords));
      localStorage.setItem(`${STORAGE_PREFIX}health_events`, JSON.stringify(healthEvents));
      localStorage.setItem(`${STORAGE_PREFIX}vet_requests`, JSON.stringify(vetRequests));
      localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
    } catch {}
  }, [isJudgeDemoActive, lang, currentFarm, allFarms, animals, flocks, tasks, careRecords, healthEvents, vetRequests, notifications]);

  // Handlers
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleNavigate = (screen: NavScreen, topicKey?: string) => {
    if (screen === 'knowledge_library') {
      setKnowledgeTopicKey(topicKey || null);
    }
    if (screen === 'ai_assistant') {
      setHealthSubTab('bondhu');
    } else if (screen === 'vet_services') {
      setHealthSubTab('vet');
    }
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleActivateJudgeDemo = (startWalkthrough = false) => {
    if (!isJudgeDemoActive) {
      const snapshot: RealModeSnapshot = {
        currentUser,
        isDemoActive,
        allFarms,
        currentFarm,
        animals,
        flocks,
        tasks,
        careRecords,
        healthEvents,
        vetRequests,
        notifications,
        auditAnswers,
        actions,
        currentScreen,
      };
      realSnapshotRef.current = snapshot;
      try {
        localStorage.setItem(JUDGE_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
      } catch {}
    }

    isJudgeDemoRef.current = true;
    setIsJudgeDemoActive(true);
    setCurrentUser(JUDGE_DEMO_ACCOUNT);
    setIsDemoActive(true);
    setAllFarms([JUDGE_DEMO_FARM]);
    setCurrentFarm(JUDGE_DEMO_FARM);
    setAnimals(JUDGE_DEMO_ANIMALS);
    setFlocks(JUDGE_DEMO_FLOCKS);
    setTasks(JUDGE_DEMO_TASKS);
    setCareRecords(JUDGE_DEMO_CARE_RECORDS);
    setHealthEvents(JUDGE_DEMO_HEALTH_EVENTS);
    setVetRequests(JUDGE_DEMO_VET_REQUESTS);
    setRegionalAlerts(JUDGE_DEMO_ALERTS);
    setNotifications(JUDGE_DEMO_NOTIFICATIONS);
    setAuditAnswers(JUDGE_DEMO_AUDIT_ANSWERS);
    setActions(JUDGE_DEMO_ACTIONS);
    setChatMessages(JUDGE_DEMO_CHAT_HISTORY);
    setWalkthroughStepIndex(0);
    setIsWalkthroughOpen(startWalkthrough);
    handleNavigate('dashboard');
  };

  const handleExitJudgeDemo = () => {
    let snap = realSnapshotRef.current;
    if (!snap) {
      try {
        const raw = localStorage.getItem(JUDGE_SNAPSHOT_STORAGE_KEY);
        if (raw) snap = JSON.parse(raw);
      } catch {}
    }

    isJudgeDemoRef.current = false;
    setIsJudgeDemoActive(false);
    setIsWalkthroughOpen(false);
    setWalkthroughStepIndex(0);

    if (snap) {
      setCurrentUser(snap.currentUser);
      setIsDemoActive(snap.isDemoActive);
      setAllFarms(snap.allFarms);
      setCurrentFarm(snap.currentFarm);
      setAnimals(snap.animals);
      setFlocks(snap.flocks);
      setTasks(snap.tasks);
      setCareRecords(snap.careRecords);
      setHealthEvents(snap.healthEvents);
      setVetRequests(snap.vetRequests);
      setNotifications(snap.notifications);
      setAuditAnswers(snap.auditAnswers);
      setActions(snap.actions);
      setRegionalAlerts(INITIAL_REGIONAL_ALERTS);
      try {
        const savedChat = localStorage.getItem(`${STORAGE_PREFIX}chat_${snap.currentFarm.id}`);
        setChatMessages(savedChat ? JSON.parse(savedChat) : [DEFAULT_KHAMAR_BONDHU_WELCOME(lang)]);
      } catch {
        setChatMessages([DEFAULT_KHAMAR_BONDHU_WELCOME(lang)]);
      }
      handleNavigate(snap.currentScreen === 'ussd_simulator' ? 'dashboard' : snap.currentScreen);
    } else {
      setRegionalAlerts(INITIAL_REGIONAL_ALERTS);
      handleNavigate('dashboard');
    }

    realSnapshotRef.current = null;
    try {
      localStorage.removeItem(JUDGE_SNAPSHOT_STORAGE_KEY);
    } catch {}
  };

  const handleSelectWalkthroughStep = (newIndex: number) => {
    const clamped = Math.max(0, Math.min(newIndex, JUDGE_WALKTHROUGH_STEPS.length - 1));
    setWalkthroughStepIndex(clamped);
    const step = JUDGE_WALKTHROUGH_STEPS[clamped];
    if (step) {
      if (step.screen === 'health_support') {
        setHealthSubTab('vet');
      }
      handleNavigate(step.screen);
    }
  };

  const handleLaunchDemo = () => {
    setAllFarms(INITIAL_DEMO_FARMS);
    setCurrentFarm(INITIAL_DEMO_FARMS[0]);
    setAnimals(INITIAL_ANIMALS);
    setFlocks(INITIAL_FLOCKS);
    setTasks(INITIAL_SCHEDULED_TASKS);
    setCareRecords(INITIAL_CARE_RECORDS);
    setHealthEvents(INITIAL_HEALTH_EVENTS);
    setVetRequests(INITIAL_VET_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsDemoActive(true);
    setCurrentScreen('dashboard');
  };

  const handleResetDemo = () => {
    localStorage.clear();
    setAllFarms(INITIAL_DEMO_FARMS);
    setCurrentFarm(INITIAL_DEMO_FARMS[0]);
    setAnimals(INITIAL_ANIMALS.filter((a) => a.farmId === INITIAL_DEMO_FARMS[0].id));
    setFlocks(INITIAL_FLOCKS.filter((f) => f.farmId === INITIAL_DEMO_FARMS[0].id));
    setTasks(INITIAL_SCHEDULED_TASKS.filter((t) => t.farmId === INITIAL_DEMO_FARMS[0].id));
    setCareRecords(INITIAL_CARE_RECORDS.filter((r) => r.farmId === INITIAL_DEMO_FARMS[0].id));
    setHealthEvents(INITIAL_HEALTH_EVENTS.filter((e) => e.farmId === INITIAL_DEMO_FARMS[0].id));
    setVetRequests([]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsDemoActive(false);
    setCurrentScreen('dashboard');
  };

  const handleCompleteTask = async (taskId: string) => {
    const completedTask = tasks.find((t) => t.id === taskId);
    const completionDateStr = new Date().toISOString().split('T')[0];

    if (completedTask) {
      // 1. Persist through careService (which updates Firestore if real user)
      const ownerUid = currentUser?.uid || currentFarm.ownerUid || 'demo_user_rafiq_001';
      try {
        await careService.completeTask(taskId, currentFarm.ownerName || 'খামারি নিজে');
      } catch (e) {
        console.warn('CareService completion warning:', e);
      }

      // 2. Create linked CareRecord so the animal/flock profile history immediately updates
      const newCareRec: CareRecord = {
        id: `care_rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        farmId: completedTask.farmId,
        targetType: completedTask.targetType,
        targetId: completedTask.targetId,
        species: completedTask.species,
        careType: completedTask.careType,
        diseaseOrTarget: completedTask.titleBn,
        productName:
          completedTask.productName ||
          (completedTask.careType === 'vaccination'
            ? 'DLS প্রস্তুতকৃত সরকারি টিকা'
            : 'অনুমোদিত ব্রড-স্পেকট্রাম অ্যান্টিহেলমিন্টিক'),
        batchNumber: `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        dateAdministered: completionDateStr,
        administeredBy: currentFarm.ownerName || 'খামারি নিজে',
        notes: `সফলভাবে সম্পন্ন করা হয়েছে (${completedTask.titleBn})`,
      };
      setCareRecords((prev) => [newCareRec, ...prev]);

      // 3. Check if the underlying protocol mandates subsequent recurring administration
      const matchedProto = AUTHORIZED_PROTOCOLS.find((p) => p.id === completedTask.protocolId);
      if (
        matchedProto &&
        matchedProto.subsequentIntervalDays &&
        matchedProto.subsequentIntervalDays > 0
      ) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + matchedProto.subsequentIntervalDays);
        const nextDueDateStr = nextDate.toISOString().split('T')[0];

        const nextTask: ScheduledCareTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          farmId: completedTask.farmId,
          targetType: completedTask.targetType,
          targetId: completedTask.targetId,
          targetName: completedTask.targetName,
          species: completedTask.species,
          careType: completedTask.careType,
          titleBn: `${matchedProto.titleBn} (পরবর্তী নিয়মিত বুস্টার)`,
          titleEn: `${matchedProto.titleEn} (Next Routine Booster)`,
          descriptionBn: `পূর্ববর্তী প্রয়োগের ${matchedProto.subsequentIntervalDays} দিন পর নিয়মিত পুনরাবৃত্তি।`,
          descriptionEn: `Routine booster scheduled ${matchedProto.subsequentIntervalDays} days following prior administration.`,
          protocolId: matchedProto.id,
          dueDate: nextDueDateStr,
          status: 'upcoming',
        };

        // If real user, save booster task to Firestore
        careService.createTask(ownerUid, nextTask).catch(() => {});

        setTasks((prev) => [
          ...prev.map((t) =>
            t.id === taskId
              ? { ...t, status: 'completed' as const, completedDate: completionDateStr }
              : t
          ),
          nextTask,
        ]);
      } else {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: 'completed' as const, completedDate: completionDateStr }
              : t
          )
        );
      }
    }
  };

  const handleAddAnimal = async (newAnimal: AnimalProfile) => {
    const ownerUid = currentUser?.uid || currentFarm.ownerUid || 'demo_user_rafiq_001';
    try {
      await animalService.createAnimal(ownerUid, currentFarm.id, {
        species: newAnimal.species,
        animalName: newAnimal.nameOrTag,
        breed: newAnimal.breed,
        sex: newAnimal.sex,
        estimatedAgeMonths: newAnimal.estimatedAgeMonths || 12,
        tagNumber: newAnimal.tagNumber,
        currentStatus: newAnimal.healthStatus === 'healthy' ? 'healthy' : 'needs_attention',
        productionStage: newAnimal.productionStage,
        notes: newAnimal.notes,
      });
    } catch (e) {
      console.warn('Error saving animal to Firestore:', e);
    }

    setAnimals((prev) => [newAnimal, ...prev]);
    // Automatically generate approved protocol care tasks for the animal
    const initialTasks = createInitialTasksForAnimal(newAnimal);
    if (initialTasks.length > 0) {
      for (const t of initialTasks) {
        careService.createTask(ownerUid, t).catch(() => {});
      }
      setTasks((prev) => [...initialTasks, ...prev]);
    }
  };

  const handleAddFlock = async (newFlock: FlockProfile) => {
    const ownerUid = currentUser?.uid || currentFarm.ownerUid || 'demo_user_rafiq_001';
    try {
      await flockService.createFlock(ownerUid, currentFarm.id, {
        poultryType: newFlock.poultryType,
        batchName: newFlock.batchName,
        initialBirdCount: newFlock.initialBirdCount,
        placementDate: newFlock.placementDate,
        housingType: newFlock.housingType,
        sourceSupplier: newFlock.sourceSupplier,
        notes: newFlock.notes,
      });
    } catch (e) {
      console.warn('Error saving flock to Firestore:', e);
    }

    setFlocks((prev) => [newFlock, ...prev]);
    // Automatically generate approved protocol care tasks for the flock
    const initialTasks = createInitialTasksForFlock(newFlock);
    if (initialTasks.length > 0) {
      for (const t of initialTasks) {
        careService.createTask(ownerUid, t).catch(() => {});
      }
      setTasks((prev) => [...initialTasks, ...prev]);
    }
  };

  const handleRecordMortality = (flockId: string, count: number) => {
    setFlocks((prev) =>
      prev.map((f) => {
        if (f.id === flockId) {
          const updatedMortality = f.mortalityCount + count;
          const updatedLive = Math.max(0, f.currentBirdCount - count);
          return {
            ...f,
            mortalityCount: updatedMortality,
            currentBirdCount: updatedLive,
          };
        }
        return f;
      })
    );
  };

  const handleAddCareRecord = (newRec: CareRecord) => {
    setCareRecords((prev) => [newRec, ...prev]);
  };

  const handleSubmitHealthEvent = (newEvent: HealthEventReport) => {
    setHealthEvents((prev) => [newEvent, ...prev]);
  };

  const handleSubmitVetRequest = (newReq: VetConsultationRequest) => {
    setVetRequests((prev) => [newReq, ...prev]);
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readTimestamp: new Date().toISOString() } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch (_) {}
  };

  // Cross-screen workflow navigators
  const handleAskAIAboutAnimal = (animal: AnimalProfile) => {
    setPresetContextForAI({ id: animal.id, name: animal.nameOrTag, species: animal.species });
    setHealthSubTab('bondhu');
    setCurrentScreen('ai_assistant');
  };

  const handleAskAIAboutFlock = (flock: FlockProfile) => {
    setPresetContextForAI({ id: flock.id, name: flock.batchName, species: flock.poultryType });
    setHealthSubTab('bondhu');
    setCurrentScreen('ai_assistant');
  };

  const handleRequestVetForAnimal = (animal: AnimalProfile) => {
    setPresetAnimalForVet(animal);
    setHealthSubTab('vet');
    setCurrentScreen('vet_services');
  };

  const handleRequestVetForFlock = (_flock: FlockProfile) => {
    setPresetAnimalForVet(null);
    setCurrentScreen('vet_services');
  };

  const handleAuditAnswer = (domainId: string, response: AuditResponse) => {
    setAuditAnswers((prev) => ({
      ...prev,
      [domainId]: {
        domainId,
        response,
        answeredAt: new Date().toISOString(),
      },
    }));
  };

  const handleCompleteAudit = () => {
    const formatted: Record<string, { domainId: string; response: AuditResponse }> = {};
    Object.entries(auditAnswers).forEach(([dId, item]) => {
      formatted[dId] = { domainId: dId, response: item.response };
    });

    const result = generateAdaptiveActionPlan(currentFarm, formatted, `audit_${Date.now()}`);
    setActions((prev) => [
      ...result.actions,
      ...prev.filter((a) => a.farmId !== currentFarm.id || a.sourceModule === 'disease_advisory'),
    ]);
    setCriticalAlerts(result.criticalAlerts);
    setXRayExplanations(result.xRayExplanations);

    if (result.criticalAlerts.length > 0) {
      setIsCriticalModalOpen(true);
    }
  };

  const handleUpdateActionStatus = (
    actionId: string,
    newStatus: ActionStatus,
    data?: ActionUpdatePayload
  ) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          return {
            ...act,
            status: newStatus,
            completedDate:
              newStatus === 'completed'
                ? new Date().toISOString().split('T')[0]
                : act.completedDate,
            notes: data?.notes !== undefined ? data.notes : act.notes,
            unableReason: data?.unableReason !== undefined ? data.unableReason : act.unableReason,
            helpReason: data?.helpReason !== undefined ? data.helpReason : act.helpReason,
            assignedTo: data?.assignedTo !== undefined ? data.assignedTo : act.assignedTo,
            assignedCategory:
              data?.assignedCategory !== undefined ? data.assignedCategory : act.assignedCategory,
            completedSteps:
              data?.completedSteps !== undefined ? data.completedSteps : act.completedSteps,
          };
        }
        return act;
      })
    );
  };

  const handleApplySimulatedPlan = (newActions: ActionPlanItem[], newExpls: JudgeXRayExplanation[]) => {
    setActions(newActions);
    setXRayExplanations(newExpls);
  };

  const handleReviewHealthEvent = (eventId: string, notes: string) => {
    setHealthEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'verified',
              vetNotes: notes,
              reviewedByVet: 'ডাঃ নাজমুল হোসেন (VS)',
            }
          : e
      )
    );
  };

  // Strict Multi-Farm & Account Data Isolation: Bound data to currentFarm.id
  const farmAnimals = animals.filter((a) => a.farmId === currentFarm.id);
  const farmFlocks = flocks.filter((f) => f.farmId === currentFarm.id);
  const farmTasks = tasks.filter((t) => t.farmId === currentFarm.id);
  const farmCareRecords = careRecords.filter((r) => r.farmId === currentFarm.id);
  const farmHealthEvents = healthEvents.filter((e) => e.farmId === currentFarm.id);
  const farmVetRequests = vetRequests.filter((v) => v.farmId === currentFarm.id);
  const pendingTasksCount = farmTasks.filter((t) => t.status === 'overdue' || t.status === 'due_soon').length;
  const completedTaskIds = [
    ...farmTasks.filter((t) => t.status === 'completed').map((t) => t.id),
    ...actions
      .filter(
        (a) =>
          (a.farmId === currentFarm.id || !a.farmId) &&
          (a.status === 'completed' || a.status === 'not_applicable')
      )
      .map((a) => a.id),
  ];

  const isViewingKhamarBondhu =
    currentScreen === 'ai_assistant' ||
    (currentScreen === 'health_support' && healthSubTab === 'bondhu');

  const hasBlockingOverlayOpen =
    isAuthModalOpen || isNotifCenterOpen || isCriticalModalOpen || isMobileMenuOpen;

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-emerald-200">
      <JudgeWalkthroughOverlay
        lang={lang}
        isJudgeDemoActive={isJudgeDemoActive}
        isWalkthroughOpen={isWalkthroughOpen}
        stepIndex={walkthroughStepIndex}
        onToggleWalkthrough={setIsWalkthroughOpen}
        onSelectStep={handleSelectWalkthroughStep}
        onExitJudgeDemo={handleExitJudgeDemo}
      />

      {/* Top Navigation Header with Multi-Farm & Multi-Account Switcher */}
      <Header
        currentFarm={currentFarm}
        allFarms={allFarms}
        onSelectFarm={setCurrentFarm}
        lang={lang}
        onToggleLang={handleToggleLang}
        role={role}
        onChangeRole={setRole}
        onLaunchDemo={handleLaunchDemo}
        onResetDemo={handleResetDemo}
        isDemoActive={isDemoActive}
        onNavigate={handleNavigate}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenNotificationCenter={() => setIsNotifCenterOpen(true)}
        completedTaskIds={completedTaskIds}
      />

      {/* Main Layout: Sidebar + Dynamic Screen */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          lang={lang}
          role={role}
          pendingTasksCount={pendingTasksCount}
          isOpenOnMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 pb-24 md:pb-12">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              farm={currentFarm}
              animals={farmAnimals}
              flocks={farmFlocks}
              tasks={farmTasks}
              alerts={regionalAlerts}
              weather={weather}
              lang={lang}
              currentUser={currentUser}
              actions={actions}
              onUpdateActionStatus={handleUpdateActionStatus}
              auditAnswers={auditAnswers}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onNavigate={handleNavigate}
              onCompleteTask={handleCompleteTask}
              onQuickAddAnimal={() => handleNavigate('animals')}
              onQuickAddFlock={() => handleNavigate('animals')}
              onQuickRecordVaccine={(targetId?: string) => {
                setPresetCareTarget({ targetId, type: 'vaccination' });
                handleNavigate('calendar');
              }}
              onQuickRecordDeworm={(targetId?: string) => {
                setPresetCareTarget({ targetId, type: 'deworming' });
                handleNavigate('calendar');
              }}
              onQuickReportProblem={() => handleNavigate('regional_alerts')}
            />
          )}

          {currentScreen === 'animals' && (
            <AnimalsScreen
              farm={currentFarm}
              animals={farmAnimals}
              flocks={farmFlocks}
              careRecords={farmCareRecords}
              scheduledTasks={farmTasks}
              healthEvents={farmHealthEvents}
              lang={lang}
              onAddAnimal={handleAddAnimal}
              onAddFlock={handleAddFlock}
              onRecordMortality={handleRecordMortality}
              onAskAIAboutAnimal={handleAskAIAboutAnimal}
              onAskAIAboutFlock={handleAskAIAboutFlock}
              onRequestVetForAnimal={handleRequestVetForAnimal}
              onRequestVetForFlock={handleRequestVetForFlock}
              onRecordCare={(targetId, type) => {
                setPresetCareTarget({ targetId, type });
                setCurrentScreen('calendar');
              }}
            />
          )}

          {currentScreen === 'calendar' && (
            <PreventiveCareScreen
              farm={currentFarm}
              animals={farmAnimals}
              flocks={farmFlocks}
              tasks={farmTasks}
              records={farmCareRecords}
              lang={lang}
              onCompleteTask={handleCompleteTask}
              onAddCareRecord={handleAddCareRecord}
              presetTarget={presetCareTarget}
              onClearPreset={() => setPresetCareTarget(null)}
            />
          )}

          {(currentScreen === 'health_support' ||
            currentScreen === 'vet_services' ||
            currentScreen === 'ai_assistant') && (
            <HealthSupportScreen
              farm={currentFarm}
              animals={farmAnimals}
              flocks={farmFlocks}
              requests={farmVetRequests}
              lang={lang}
              initialSubTab={
                currentScreen === 'ai_assistant'
                  ? 'bondhu'
                  : currentScreen === 'vet_services'
                  ? 'vet'
                  : healthSubTab
              }
              onSubTabChange={(tab) => setHealthSubTab(tab)}
              presetAnimal={presetAnimalForVet}
              selectedContextTarget={presetContextForAI}
              onSubmitRequest={handleSubmitVetRequest}
              onNavigate={handleNavigate}
              chatMessages={chatMessages}
              onUpdateChatMessages={setChatMessages}
              onResetChatMessages={() => setChatMessages([DEFAULT_KHAMAR_BONDHU_WELCOME(lang)])}
              isJudgeDemoActive={isJudgeDemoActive}
            />
          )}

          {currentScreen === 'knowledge_library' && (
            <KnowledgeLibraryScreen
              lang={lang}
              initialTopicKey={knowledgeTopicKey}
              onClearInitialTopic={() => setKnowledgeTopicKey(null)}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'biosecurity' && (
            <BiosecurityModuleScreen
              farm={currentFarm}
              ownerUid={currentUser?.uid || currentFarm.ownerUid || 'demo_user'}
              lang={lang}
              answers={auditAnswers}
              onAnswer={handleAuditAnswer}
              onCompleteAudit={handleCompleteAudit}
              actions={actions}
              xRayExplanations={xRayExplanations}
              onUpdateActionStatus={handleUpdateActionStatus}
              onApplySimulatedPlan={handleApplySimulatedPlan}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'regional_alerts' && (
            <RegionalAlertsScreen
              farm={currentFarm}
              animals={farmAnimals}
              flocks={farmFlocks}
              alerts={regionalAlerts}
              weather={weather}
              healthEvents={farmHealthEvents}
              existingActions={actions}
              lang={lang}
              onSubmitHealthEvent={handleSubmitHealthEvent}
              onConvertAlertToAction={(action) => {
                setActions((prev) => {
                  if (
                    prev.some(
                      (a) =>
                        a.id === action.id ||
                        (action.sourceAdvisoryId && a.sourceAdvisoryId === action.sourceAdvisoryId)
                    )
                  ) {
                    return prev;
                  }
                  return [action, ...prev];
                });
                handleNavigate('biosecurity');
              }}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'ussd_simulator' && (
            <USSDSimulatorScreen
              farm={currentFarm}
              tasks={farmTasks}
              animals={farmAnimals}
              lang={lang}
            />
          )}

          {currentScreen === 'governance_portal' && (
            <GovernancePortalScreen
              role={role}
              lang={lang}
              healthEvents={healthEvents}
              onReviewHealthEvent={handleReviewHealthEvent}
            />
          )}

          {currentScreen === 'roadmap' && (
            <RoadmapScreen lang={lang} />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              lang={lang}
              onLanguageChange={setLang}
              farm={currentFarm}
              isDemoActive={isDemoActive}
              onLaunchDemo={handleLaunchDemo}
              onResetAllData={handleResetDemo}
              onNavigate={handleNavigate}
              isJudgeDemoActive={isJudgeDemoActive}
              onActivateJudgeDemo={handleActivateJudgeDemo}
              onExitJudgeDemo={handleExitJudgeDemo}
              onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Critical Risk Modal Alert for Biosecurity Safeguards */}
      <CriticalRiskModal
        alerts={criticalAlerts}
        isOpen={isCriticalModalOpen}
        onClose={() => setIsCriticalModalOpen(false)}
        lang={lang}
        onGoToPlanner={() => {
          setIsCriticalModalOpen(false);
          handleNavigate('biosecurity');
        }}
      />

      {/* Farmer Account Modal (Real Firebase Auth & Switch Demo) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        lang={lang}
        onUserChanged={(user) => {
          setCurrentUser(user);
          setIsDemoActive(user.isDemo);
        }}
      />

      {/* Farm Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        ownerUid={currentUser?.uid || currentFarm.ownerUid || 'demo_user_rafiq_001'}
        lang={lang}
        onRefreshNotifications={handleRefreshNotifications}
        onNavigate={handleNavigate}
        completedTaskIds={completedTaskIds}
      />

      {/* Global Persistent Khamar Bondhu Launcher */}
      <KhamarBondhuFloatingButton
        lang={lang}
        hidden={isViewingKhamarBondhu || hasBlockingOverlayOpen}
        messageCount={chatMessages.length}
        onOpenKhamarBondhu={() => {
          setHealthSubTab('bondhu');
          handleNavigate('ai_assistant');
        }}
      />

      {/* Bottom Navigation for Mobile Smartphones */}
      <MobileNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        lang={lang}
        pendingTasksCount={pendingTasksCount}
      />
    </div>
  );
}
