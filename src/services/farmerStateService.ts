import {
  ActionPlanItem,
  AnimalProfile,
  AppNotification,
  AuditItemAnswer,
  CareRecord,
  FarmProfile,
  FlockProfile,
  HealthEventReport,
  KhamarBondhuMessage,
  Language,
  RegionalAlert,
  ScheduledCareTask,
  SmsNotificationPreferences,
  VetConsultationRequest,
  WeatherInfo,
} from '../types';
import { DEFAULT_KHAMAR_BONDHU_WELCOME } from '../components/AIAssistantScreen';
import { FarmerAccount } from './authService';
import { BiosecurityChecklistRecord } from './biosecurityService';
import { INITIAL_WEATHER_INFO } from '../data/initialData';

export interface FarmerAppState {
  schemaVersion: 1;
  lang: Language;
  farms: FarmProfile[];
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
}

export function createEmptyFarmerState(user: FarmerAccount): FarmerAppState {
  const lang = user.preferredLanguage || 'bn';
  const today = new Date().toISOString().slice(0, 10);
  const farm: FarmProfile = {
    id: `KS-${user.uid.slice(0, 12).toUpperCase()}`,
    name: `${user.displayName} Farm`,
    ownerName: user.displayName,
    ownerUid: user.uid,
    ownerPhone: user.phoneNumber,
    district: '',
    upazila: '',
    farmTypes: ['mixed'],
    speciesPresent: [],
    approximateHeadCount: 0,
    housingSystem: 'semi_controlled',
    registeredDate: today,
    isDemo: false,
  };

  return {
    schemaVersion: 1,
    lang,
    farms: [farm],
    currentFarm: farm,
    animals: [],
    flocks: [],
    tasks: [],
    careRecords: [],
    healthEvents: [],
    vetRequests: [],
    regionalAlerts: [],
    weather: {
      ...INITIAL_WEATHER_INFO,
      isSimulated: true,
    },
    notifications: [],
    auditAnswers: {},
    actions: [],
    chatMessages: [DEFAULT_KHAMAR_BONDHU_WELCOME(lang)],
    smsPrefs: {
      phoneNumber: user.phoneNumber,
      isPhoneVerified: false,
      smsOptInConsent: false,
      categories: {
        vaccinations: true,
        deworming: true,
        biosecurity: true,
        regionalAlerts: true,
        vetAppointments: true,
      },
      quietHoursEnabled: true,
      quietHoursStart: '21:00',
      quietHoursEnd: '06:00',
      ivrVoiceInterest: false,
      gatewayStatus: 'planned_demo',
    },
    inAppNotifications: true,
    biosecurityRecords: {},
  };
}
