/**
 * Khamar Shurokkha (খামার সুরক্ষা)
 * Integrated Multi-Species Farm Identity, Animal Health, Preventive Care & Early-Warning Platform
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  SmsNotificationPreferences,
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
import { type FarmerAccount, authService, DEMO_FARMER_ACCOUNTS } from './services/authService';
import { createEmptyFarmerState, type FarmerAppState } from './services/farmerStateService';
import { loadPrivateFarmerState, savePrivateFarmerState } from './lib/farmerApi';
import { BiosecurityChecklistRecord } from './services/biosecurityService';
import useSWR from 'swr';

interface RealModeSnapshot {
  currentUser: FarmerAccount | null;
  isDemoActive: boolean;
  lang: Language;
  role: UserRole;
  allFarms: FarmProfile[];
  currentFarm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  tasks: ScheduledCareTask[];
  careRecords: CareRecord[];
  healthEvents: HealthEventReport[];
  vetRequests: VetConsultationRequest[];
  regionalAlerts: RegionalAlert[];
  weather: WeatherInfo;
  notifications: AppNotification[];
  auditAnswers: Record<string, AuditItemAnswer>;
  actions: ActionPlanItem[];
  chatMessages: KhamarBondhuMessage[];
  smsPrefs: SmsNotificationPreferences;
  inAppNotifications: boolean;
  biosecurityRecords: Record<string, BiosecurityChecklistRecord>;
  currentScreen: NavScreen;
}

export default function App() {
  // Demo data stays in memory; signed-in farmer data is loaded from private Supabase storage.
  const [lang, setLang] = useState<Language>('bn');

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
  const [allFarms, setAllFarms] = useState<FarmProfile[]>(INITIAL_DEMO_FARMS);
  const [currentFarm, setCurrentFarm] = useState<FarmProfile>(INITIAL_DEMO_FARMS[0]);

  // 3. Multi-Species Animals & Flocks
  const [animals, setAnimals] = useState<AnimalProfile[]>(INITIAL_ANIMALS);
  const [flocks, setFlocks] = useState<FlockProfile[]>(INITIAL_FLOCKS);

  // 4. Preventive Health: Tasks & Records
  const [tasks, setTasks] = useState<ScheduledCareTask[]>(INITIAL_SCHEDULED_TASKS);
  const [careRecords, setCareRecords] = useState<CareRecord[]>(INITIAL_CARE_RECORDS);

  // 5. Health Events & Vet Requests
  const [healthEvents, setHealthEvents] = useState<HealthEventReport[]>(INITIAL_HEALTH_EVENTS);
  const [vetRequests, setVetRequests] = useState<VetConsultationRequest[]>(INITIAL_VET_REQUESTS);

  // 6. Regional Alerts, Weather & Notifications
  const [regionalAlerts, setRegionalAlerts] = useState<RegionalAlert[]>(INITIAL_REGIONAL_ALERTS);
  const [weather, setWeather] = useState<WeatherInfo>(INITIAL_WEATHER_INFO);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [smsPrefs, setSmsPrefs] = useState<SmsNotificationPreferences>({
    phoneNumber: INITIAL_DEMO_FARMS[0].ownerPhone,
    isPhoneVerified: false,
    smsOptInConsent: false,
    categories: { vaccinations: true, deworming: true, biosecurity: true, regionalAlerts: true, vetAppointments: true },
    quietHoursEnabled: true,
    quietHoursStart: '21:00',
    quietHoursEnd: '06:00',
    ivrVoiceInterest: false,
    gatewayStatus: 'planned_demo',
  });
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [biosecurityRecords, setBiosecurityRecords] = useState<Record<string, BiosecurityChecklistRecord>>({});

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

  // Health Support active sub-tab + account-scoped Khamar Bondhu history
  const [healthSubTab, setHealthSubTab] = useState<'vet' | 'bondhu'>('vet');
  const [chatMessages, setChatMessages] = useState<KhamarBondhuMessage[]>([
    DEFAULT_KHAMAR_BONDHU_WELCOME('bn'),
  ]);

  // Competition Judge Demo Mode + Guided Walkthrough (Isolated Snapshot-Restore)
  const [isJudgeDemoActive, setIsJudgeDemoActive] = useState<boolean>(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);
  const [walkthroughStepIndex, setWalkthroughStepIndex] = useState<number>(0);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const isJudgeDemoRef = useRef<boolean>(false);
  const realSnapshotRef = useRef<RealModeSnapshot | null>(null);
  const activeAccountUidRef = useRef<string | null>(DEMO_FARMER_ACCOUNTS['demo-rafiq'].uid);
  const hydratedAccountUidRef = useRef<string | null>(null);

  useEffect(() => {
    isJudgeDemoRef.current = isJudgeDemoActive;
  }, [isJudgeDemoActive]);

  const applyFarmerState = useCallback((state: FarmerAppState) => {
    setLang(state.lang);
    setAllFarms(state.farms);
    setCurrentFarm(state.currentFarm);
    setAnimals(state.animals);
    setFlocks(state.flocks);
    setTasks(state.tasks);
    setCareRecords(state.careRecords);
    setHealthEvents(state.healthEvents);
    setVetRequests(state.vetRequests);
    setRegionalAlerts(state.regionalAlerts);
    setWeather(state.weather);
    setNotifications(state.notifications);
    setAuditAnswers(state.auditAnswers);
    setActions(state.actions);
    setChatMessages(state.chatMessages);
    setSmsPrefs(state.smsPrefs);
    setInAppNotifications(state.inAppNotifications);
    setBiosecurityRecords(state.biosecurityRecords);
  }, []);

  const resetDemoState = useCallback(() => {
    setLang('bn');
    setRole('farmer');
    setAllFarms(INITIAL_DEMO_FARMS);
    setCurrentFarm(INITIAL_DEMO_FARMS[0]);
    setAnimals(INITIAL_ANIMALS);
    setFlocks(INITIAL_FLOCKS);
    setTasks(INITIAL_SCHEDULED_TASKS);
    setCareRecords(INITIAL_CARE_RECORDS);
    setHealthEvents(INITIAL_HEALTH_EVENTS);
    setVetRequests(INITIAL_VET_REQUESTS);
    setRegionalAlerts(INITIAL_REGIONAL_ALERTS);
    setWeather(INITIAL_WEATHER_INFO);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditAnswers(DEMO_CURRENT_AUDIT.answers);
    setActions(DEMO_INITIAL_ACTIONS);
    setChatMessages([DEFAULT_KHAMAR_BONDHU_WELCOME('bn')]);
    setSmsPrefs({
      phoneNumber: INITIAL_DEMO_FARMS[0].ownerPhone,
      isPhoneVerified: false,
      smsOptInConsent: false,
      categories: { vaccinations: true, deworming: true, biosecurity: true, regionalAlerts: true, vetAppointments: true },
      quietHoursEnabled: true,
      quietHoursStart: '21:00',
      quietHoursEnd: '06:00',
      ivrVoiceInterest: false,
      gatewayStatus: 'planned_demo',
    });
    setInAppNotifications(true);
    setBiosecurityRecords({});
    setIsDemoActive(true);
  }, []);

  const handleAccountChanged = useCallback((account: FarmerAccount) => {
    if (isJudgeDemoRef.current) return;
    const accountChanged = activeAccountUidRef.current !== account.uid;
    activeAccountUidRef.current = account.uid;
    setCurrentUser(account);
    setIsDemoActive(account.isDemo);
    if (!accountChanged) return;

    hydratedAccountUidRef.current = null;
    setCloudSyncStatus('idle');
    if (account.isDemo) {
      resetDemoState();
      return;
    }
    setRole('farmer');
    applyFarmerState(createEmptyFarmerState(account));
  }, [applyFarmerState, resetDemoState]);

  useEffect(() => authService.subscribeToAuth(handleAccountChanged), [handleAccountChanged]);

  const remoteAccountUid = currentUser && !currentUser.isDemo && !isDemoActive && !isJudgeDemoActive
    ? currentUser.uid
    : null;
  const {
    data: remoteFarmerState,
    error: remoteFarmerStateError,
    isLoading: isRemoteFarmerStateLoading,
    mutate: mutateRemoteFarmerState,
  } = useSWR<FarmerAppState | null>(
    remoteAccountUid ? `private-farmer-state:${remoteAccountUid}` : null,
    () => loadPrivateFarmerState<FarmerAppState>(),
    { revalidateOnFocus: false, shouldRetryOnError: false, revalidateOnReconnect: true }
  );

  useEffect(() => {
    if (!remoteAccountUid) return;
    if (remoteFarmerStateError) {
      setCloudSyncStatus('error');
      return;
    }
    if (isRemoteFarmerStateLoading || remoteFarmerState === undefined) return;
    if (hydratedAccountUidRef.current === remoteAccountUid) return;
    const state = remoteFarmerState || createEmptyFarmerState(currentUser!);
    applyFarmerState(state);
    hydratedAccountUidRef.current = remoteAccountUid;
    setCloudSyncStatus(remoteFarmerState ? 'saved' : 'idle');
  }, [
    remoteAccountUid,
    remoteFarmerState,
    remoteFarmerStateError,
    isRemoteFarmerStateLoading,
    currentUser,
    applyFarmerState,
  ]);

  const farmerStateForStorage = useMemo<FarmerAppState>(() => ({
    schemaVersion: 1,
    lang,
    farms: allFarms,
    currentFarm,
    animals,
    flocks,
    tasks,
    careRecords,
    healthEvents,
    vetRequests,
    regionalAlerts,
    weather,
    notifications,
    auditAnswers,
    actions,
    chatMessages,
    smsPrefs,
    inAppNotifications,
    biosecurityRecords,
  }), [
    lang, allFarms, currentFarm, animals, flocks, tasks, careRecords, healthEvents,
    vetRequests, regionalAlerts, weather, notifications, auditAnswers, actions,
    chatMessages, smsPrefs, inAppNotifications, biosecurityRecords,
  ]);

  useEffect(() => {
    if (
      !remoteAccountUid ||
      isRemoteFarmerStateLoading ||
      remoteFarmerStateError ||
      hydratedAccountUidRef.current !== remoteAccountUid
    ) return;

    const timeoutId = window.setTimeout(async () => {
      setCloudSyncStatus('saving');
      try {
        await savePrivateFarmerState(farmerStateForStorage);
        hydratedAccountUidRef.current = remoteAccountUid;
        setCloudSyncStatus('saved');
        await mutateRemoteFarmerState(farmerStateForStorage, false);
      } catch {
        setCloudSyncStatus('error');
      }
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [
    remoteAccountUid,
    isRemoteFarmerStateLoading,
    remoteFarmerStateError,
    farmerStateForStorage,
    mutateRemoteFarmerState,
  ]);

  useEffect(() => {
    const res = generateAdaptiveActionPlan(currentFarm, auditAnswers, `audit_${currentFarm.id}`);
    setCriticalAlerts(res.criticalAlerts);
    setXRayExplanations(res.xRayExplanations);
  }, [currentFarm, auditAnswers]);

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
      realSnapshotRef.current = {
        currentUser,
        isDemoActive,
        lang,
        role,
        allFarms,
        currentFarm,
        animals,
        flocks,
        tasks,
        careRecords,
        healthEvents,
        vetRequests,
        regionalAlerts,
        weather,
        notifications,
        auditAnswers,
        actions,
        chatMessages,
        smsPrefs,
        inAppNotifications,
        biosecurityRecords,
        currentScreen,
      };
    }

    hydratedAccountUidRef.current = null;
    isJudgeDemoRef.current = true;
    setIsJudgeDemoActive(true);
    setCurrentUser(JUDGE_DEMO_ACCOUNT);
    setIsDemoActive(true);
    setLang('bn');
    setRole('farmer');
    setAllFarms([JUDGE_DEMO_FARM]);
    setCurrentFarm(JUDGE_DEMO_FARM);
    setAnimals(JUDGE_DEMO_ANIMALS);
    setFlocks(JUDGE_DEMO_FLOCKS);
    setTasks(JUDGE_DEMO_TASKS);
    setCareRecords(JUDGE_DEMO_CARE_RECORDS);
    setHealthEvents(JUDGE_DEMO_HEALTH_EVENTS);
    setVetRequests(JUDGE_DEMO_VET_REQUESTS);
    setRegionalAlerts(JUDGE_DEMO_ALERTS);
    setWeather({ ...INITIAL_WEATHER_INFO, isSimulated: true });
    setNotifications(JUDGE_DEMO_NOTIFICATIONS);
    setAuditAnswers(JUDGE_DEMO_AUDIT_ANSWERS);
    setActions(JUDGE_DEMO_ACTIONS);
    setChatMessages(JUDGE_DEMO_CHAT_HISTORY);
    setSmsPrefs({
      phoneNumber: JUDGE_DEMO_FARM.ownerPhone,
      isPhoneVerified: false,
      smsOptInConsent: false,
      categories: { vaccinations: true, deworming: true, biosecurity: true, regionalAlerts: true, vetAppointments: true },
      quietHoursEnabled: true,
      quietHoursStart: '21:00',
      quietHoursEnd: '06:00',
      ivrVoiceInterest: false,
      gatewayStatus: 'planned_demo',
    });
    setInAppNotifications(true);
    setBiosecurityRecords({});
    setWalkthroughStepIndex(0);
    setIsWalkthroughOpen(startWalkthrough);
    handleNavigate('dashboard');
  };

  const handleExitJudgeDemo = () => {
    const snapshot = realSnapshotRef.current;
    isJudgeDemoRef.current = false;
    setIsJudgeDemoActive(false);
    setIsWalkthroughOpen(false);
    setWalkthroughStepIndex(0);

    if (snapshot) {
      setCurrentUser(snapshot.currentUser);
      setIsDemoActive(snapshot.isDemoActive);
      setLang(snapshot.lang);
      setRole(snapshot.role);
      setAllFarms(snapshot.allFarms);
      setCurrentFarm(snapshot.currentFarm);
      setAnimals(snapshot.animals);
      setFlocks(snapshot.flocks);
      setTasks(snapshot.tasks);
      setCareRecords(snapshot.careRecords);
      setHealthEvents(snapshot.healthEvents);
      setVetRequests(snapshot.vetRequests);
      setRegionalAlerts(snapshot.regionalAlerts);
      setWeather(snapshot.weather);
      setNotifications(snapshot.notifications);
      setAuditAnswers(snapshot.auditAnswers);
      setActions(snapshot.actions);
      setChatMessages(snapshot.chatMessages);
      setSmsPrefs(snapshot.smsPrefs);
      setInAppNotifications(snapshot.inAppNotifications);
      setBiosecurityRecords(snapshot.biosecurityRecords);
      activeAccountUidRef.current = snapshot.currentUser?.uid || null;
      hydratedAccountUidRef.current =
        snapshot.currentUser && !snapshot.currentUser.isDemo ? snapshot.currentUser.uid : null;
      handleNavigate(snapshot.currentScreen === 'ussd_simulator' ? 'dashboard' : snapshot.currentScreen);
    } else {
      resetDemoState();
      handleNavigate('dashboard');
    }

    realSnapshotRef.current = null;
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
    resetDemoState();
    setCurrentScreen('dashboard');
    handleAccountChanged(DEMO_FARMER_ACCOUNTS['demo-rafiq']);
    void authService.selectDemoFarmer('demo-rafiq');
  };

  const handleResetDemo = () => {
    if (currentUser && !currentUser.isDemo) {
      applyFarmerState(createEmptyFarmerState(currentUser));
      hydratedAccountUidRef.current = currentUser.uid;
      setCloudSyncStatus('saving');
    } else {
      resetDemoState();
    }
    setCurrentScreen('dashboard');
  };

  const handleCompleteTask = async (taskId: string) => {
    const completedTask = tasks.find((t) => t.id === taskId);
    const completionDateStr = new Date().toISOString().split('T')[0];

    if (completedTask) {
      // Create a linked care record so animal and flock histories update immediately.
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

  const handleAddAnimal = (newAnimal: AnimalProfile) => {
    setAnimals((prev) => [newAnimal, ...prev]);
    // Automatically generate approved protocol care tasks for the animal
    const initialTasks = createInitialTasksForAnimal(newAnimal);
    if (initialTasks.length > 0) {
      setTasks((prev) => [...initialTasks, ...prev]);
    }
  };

  const handleAddFlock = (newFlock: FlockProfile) => {
    setFlocks((prev) => [newFlock, ...prev]);
    // Automatically generate approved protocol care tasks for the flock
    const initialTasks = createInitialTasksForFlock(newFlock);
    if (initialTasks.length > 0) {
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

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readTimestamp: new Date().toISOString() } : n))
    );
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

  const handleSaveBiosecurityChecklist = (record: BiosecurityChecklistRecord) => {
    setBiosecurityRecords((previous) => ({
      ...previous,
      [`${record.farmId}_${record.date}`]: record,
    }));
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
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] flex flex-col selection:bg-emerald-200">
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
        onChangeRole={(nextRole) => {
          if (isDemoActive || isJudgeDemoActive) setRole(nextRole);
        }}
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
          {!isDemoActive && !isJudgeDemoActive && cloudSyncStatus !== 'idle' && (
            <div
              aria-live="polite"
              className={`mb-3 rounded-xl border px-3 py-2 text-xs font-semibold ${
                cloudSyncStatus === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              }`}
              role={cloudSyncStatus === 'error' ? 'alert' : 'status'}
            >
              {cloudSyncStatus === 'error'
                ? lang === 'bn' ? 'সর্বশেষ পরিবর্তন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।' : 'The latest changes could not be saved. Try again.'
                : cloudSyncStatus === 'saving'
                  ? lang === 'bn' ? 'আপনার খামারের তথ্য নিরাপদে সংরক্ষণ হচ্ছে…' : 'Saving your farm data securely…'
                  : lang === 'bn' ? 'আপনার খামারের তথ্য সংরক্ষিত।' : 'Your farm data is saved.'}
            </div>
          )}
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
              isDemoActive={isDemoActive}
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
              isDemoActive={isDemoActive}
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
              records={biosecurityRecords}
              onSaveChecklist={handleSaveBiosecurityChecklist}
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
              smsPrefs={smsPrefs}
              onSmsPrefsChange={setSmsPrefs}
              inAppNotifications={inAppNotifications}
              onInAppNotificationsChange={setInAppNotifications}
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

      {/* Farmer Account Modal (Mobile Password Auth & Demo Switch) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        lang={lang}
        onUserChanged={handleAccountChanged}
      />

      {/* Farm Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifCenterOpen}
        onClose={() => setIsNotifCenterOpen(false)}
        notifications={notifications}
        lang={lang}
        onMarkRead={handleMarkNotificationRead}
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
