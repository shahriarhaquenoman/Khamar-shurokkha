/**
 * Khamar Shurokkha (খামার সুরক্ষা)
 * Multi-Species Farm Identity, Animal Health, Preventive Care & Early-Warning Platform
 * Core TypeScript Data Models
 */

export type Language = 'bn' | 'en';
export type UserRole = 'farmer' | 'vet_pro' | 'admin' | 'advisor';

// Supported Species Registry
export type LivestockSpecies = 'cattle' | 'buffalo' | 'goat' | 'sheep';
export type PoultrySpecies = 'chicken_broiler' | 'chicken_layer' | 'chicken_sonali' | 'duck';
export type Species = LivestockSpecies | PoultrySpecies;

export type FarmType =
  | 'dairy'
  | 'beef'
  | 'goat'
  | 'sheep'
  | 'buffalo'
  | 'broiler'
  | 'layer'
  | 'sonali'
  | 'duck'
  | 'mixed';

export type HousingSystem =
  | 'open_sided'
  | 'semi_controlled'
  | 'controlled'
  | 'free_range'
  | 'intensive'
  | 'raised_slatted';

export type BudgetCategory = 'very_limited' | 'low' | 'moderate' | 'flexible';

export interface FarmProfile {
  id: string; // e.g. KS-FARM-0001
  name: string;
  farmName?: string; // backwards compatibility alias
  ownerName: string;
  ownerUid?: string;
  ownerPhone: string;
  ownerEmail?: string;
  district: string;
  upazila: string;
  union?: string;
  farmTypes: FarmType[];
  farmType?: string; // compatibility
  speciesPresent: Species[];
  approximateHeadCount: number;
  flockSize?: number;
  housingSystem: HousingSystem;
  productionSystem?: HousingSystem;
  budgetCategory?: BudgetCategory;
  availableResources?: string[];
  registeredDate: string;
  registeredAt?: string;
  photoUrl?: string;
  isDemo?: boolean;
}

// Individual Animal Model (Cattle, Buffalo, Goat, Sheep)
export type AnimalHealthStatus =
  | 'healthy'
  | 'needs_attention'
  | 'sick'
  | 'in_treatment'
  | 'quarantined';

export interface AnimalProfile {
  id: string; // e.g. KS-CAT-0001, KS-GOT-0001
  farmId: string;
  species: LivestockSpecies;
  nameOrTag: string;
  tagNumber?: string;
  breed: string;
  sex: 'male' | 'female';
  dateOfBirth?: string;
  estimatedAgeMonths: number;
  healthStatus: AnimalHealthStatus;
  productionStage?: string; // e.g. 'milking', 'pregnant', 'fattening', 'dry', 'growing'
  purchaseDate?: string;
  photoUrl?: string;
  notes?: string;
  isArchived?: boolean;
  createdAt: string;
}

// Flock / Batch Model (Broiler, Layer, Sonali, Duck)
export type FlockHealthStatus =
  | 'normal'
  | 'monitoring'
  | 'high_mortality'
  | 'culled';

export interface FlockProfile {
  id: string; // e.g. KS-FLK-0001
  farmId: string;
  poultryType: PoultrySpecies;
  batchName: string;
  initialBirdCount: number;
  currentBirdCount: number;
  placementDate: string;
  ageDays: number;
  sourceSupplier?: string;
  purpose: 'meat' | 'egg' | 'dual';
  housingType: 'litter_floor' | 'cages' | 'free_range';
  mortalityCount: number;
  healthStatus: FlockHealthStatus;
  status: 'active' | 'harvested' | 'sold' | 'archived';
  notes?: string;
  createdAt: string;
}

// Protocol Governance Models
export type CareType = 'vaccination' | 'deworming' | 'routine_hygiene';
export type ProtocolApprovalStatus =
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'archived';

export interface PreventiveProtocol {
  id: string;
  species: Species[];
  careType: CareType;
  titleBn: string;
  titleEn: string;
  diseaseOrTargetBn: string;
  diseaseOrTargetEn: string;
  targetAgeRuleBn: string;
  targetAgeRuleEn: string;
  minAgeDays?: number;
  maxAgeDays?: number;
  firstDoseRule: string;
  boosterRule?: string;
  subsequentIntervalDays?: number;
  contraindicationsBn?: string;
  contraindicationsEn?: string;
  sourceReference: string;
  version: string;
  reviewingVet: string;
  approvalStatus: ProtocolApprovalStatus;
  effectiveDate: string;
}

// Scheduled Care Task
export type TaskStatus =
  | 'upcoming'
  | 'due_soon'
  | 'overdue'
  | 'completed'
  | 'missed'
  | 'rescheduled';

export interface ScheduledCareTask {
  id: string;
  farmId: string;
  targetType: 'animal' | 'flock';
  targetId: string;
  targetName: string;
  species: Species;
  careType: CareType;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  protocolId: string;
  dueDate: string;
  status: TaskStatus;
  completedDate?: string;
  administeredBy?: string;
  productName?: string;
  notes?: string;
}

// Completed Care Record
export interface CareRecord {
  id: string;
  farmId: string;
  targetType: 'animal' | 'flock';
  targetId: string;
  species: Species;
  careType: CareType;
  diseaseOrTarget: string;
  productName?: string;
  batchNumber?: string;
  dateAdministered: string;
  administeredBy: string;
  nextDueDate?: string;
  notes?: string;
  verifiedByVet?: string;
  status?: 'completed' | 'missed';
}

// Health Event Report (Farmer reported)
export type HealthEventStatus =
  | 'reported'
  | 'under_review'
  | 'verified'
  | 'vet_attended'
  | 'resolved';

export interface HealthEventReport {
  id: string;
  farmId: string;
  targetType: 'animal' | 'flock';
  targetId: string;
  species: Species;
  symptoms: string[];
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  reportedDate: string;
  status: HealthEventStatus;
  photoUrl?: string;
  vetNotes?: string;
  reviewedByVet?: string;
}

// Veterinary Consultation Request
export type ConsultationType = 'phone_call' | 'online_consultation' | 'in_person_visit';
export type ConsultationStatus =
  | 'submitted'
  | 'waiting_review'
  | 'accepted'
  | 'scheduled'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'cancelled';

export interface VetConsultationRequest {
  id: string;
  farmId: string;
  targetType: 'animal' | 'flock';
  targetId: string;
  targetName: string;
  species: Species;
  consultationType: ConsultationType;
  urgency?: 'normal' | 'urgent';
  preferredTimeWindow?: string;
  symptoms?: string[];
  reason: string;
  description: string;
  status: ConsultationStatus;
  assignedVet?: {
    name: string;
    title: string;
    phone: string;
    hospital: string;
    bvcNumber?: string;
    vetVerificationStatus?: 'demo_example' | 'bvc_verified';
  };
  scheduledTime?: string;
  consultationNotes?: string;
  createdAt: string;
}

// Regional Disease Alert
export type AlertSeverity = 'notice' | 'advisory' | 'warning' | 'emergency';
export type AlertVerificationStatus =
  | 'reported'
  | 'under_review'
  | 'verified'
  | 'official_dls'
  | 'resolved';

export interface RegionalAlert {
  id: string;
  titleBn: string;
  titleEn: string;
  species: Species[];
  district: string;
  upazila: string;
  severity: AlertSeverity;
  verificationStatus: AlertVerificationStatus;
  source: string;
  lastUpdated: string;
  recommendedPrecautionsBn: string[];
  recommendedPrecautionsEn: string[];
  isSimulated: boolean;
}

// Weather & Seasonal Information
export interface WeatherInfo {
  district: string;
  temp: number;
  condition: string;
  humidity: number;
  rainProbability: number;
  heatStressIndex: 'low' | 'moderate' | 'high' | 'severe';
  managementTipsBn: string[];
  managementTipsEn: string[];
  lastUpdated: string;
}

// Notifications - Normalized Unified View Model
export interface AppNotification {
  id: string;
  ownerUid?: string;
  farmId?: string;
  category: 'vaccination' | 'deworming' | 'consultation' | 'alert' | 'weather' | 'system' | 'biosecurity';
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  targetScreen?: NavScreen;
  targetId?: string;
  targetTaskId?: string;
  sourceModule?: string;
  sourceAdvisoryId?: string;
  isRead: boolean;
  readTimestamp?: string;
  createdAt: string;
  deliveryChannel?: 'in_app' | 'simulated_sms' | 'simulated_voice' | 'simulated_ussd';
  isSimulated?: boolean;
}

// Protection Signal Architecture (Information Source -> Validation -> Farm Relevance -> Action Eligibility)
export interface ProtectionSignal {
  id: string;
  sourceType: 'regional_alert' | 'weather_warning' | 'health_event' | 'care_schedule' | 'biosecurity_gap' | 'dls_notice';
  sourceId: string;
  sourceTitleBn: string;
  sourceTitleEn: string;
  sourceAuthority: string;
  farmId: string;
  targetType: 'farm' | 'animal' | 'flock';
  targetId?: string;
  targetDescriptionBn: string;
  targetDescriptionEn: string;
  actionCategory: 'biosecurity' | 'vaccination' | 'deworming' | 'management_precaution' | 'isolation' | 'investigation';
  priority: 'urgent' | 'high' | 'routine';
  reasonBn: string;
  reasonEn: string;
  suggestedActionTitleBn: string;
  suggestedActionTitleEn: string;
  practicalStepsBn: string[];
  practicalStepsEn: string[];
  dueDate: string;
  eligibilityStatus: 'eligible_action' | 'information_only' | 'pending_vet_review' | 'simulated_demo';
  isSimulated: boolean;
  createdAt: string;
}

// Biosecurity Assessment Models
export type AuditResponse = 'good' | 'partial' | 'missing';

export interface BiosecurityDomain {
  id: string;
  order: number;
  domainKey: string;
  titleBn: string;
  titleEn: string;
  questionBn: string;
  questionEn: string;
  explanationBn: string;
  explanationEn: string;
  riskSeverity: 'critical' | 'high' | 'routine';
  practicalTipBn: string;
  practicalTipEn: string;
  iconName: string;
  applicableFarmGroups?: ('poultry' | 'ruminant' | 'all')[];
  ruminantTitleBn?: string;
  ruminantTitleEn?: string;
  ruminantQuestionBn?: string;
  ruminantQuestionEn?: string;
  ruminantExplanationBn?: string;
  ruminantExplanationEn?: string;
  ruminantTipBn?: string;
  ruminantTipEn?: string;
  knowledgeTopicId?: string;
}

export interface AuditItemAnswer {
  domainId: string;
  response: AuditResponse;
  answeredAt: string;
  notes?: string;
}

export interface AuditSession {
  id: string;
  farmId: string;
  date: string;
  status: 'in_progress' | 'completed';
  answers: Record<string, AuditItemAnswer>;
  goodCount: number;
  partialCount: number;
  missingCount: number;
  criticalIssuesIdentified: string[];
  completedAt?: string;
  isDemo?: boolean;
}

export type ActionStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'overdue'
  | 'unable_to_complete'
  | 'help_needed'
  | 'not_applicable';

export interface ActionPlanItem {
  id: string;
  farmId?: string;
  auditSessionId: string;
  domainId: string;
  titleBn: string;
  titleEn: string;
  whyRecommendedBn: string;
  whyRecommendedEn: string;
  riskCategory: 'critical' | 'high' | 'routine';
  priority?: 'urgent' | 'high' | 'due_today' | 'upcoming' | 'routine';
  estimatedEffort: 'low' | 'medium' | 'high';
  costCategory: 'free' | 'low' | 'moderate' | 'high';
  requiredMaterialsBn: string;
  requiredMaterialsEn: string;
  stepsBn: string[];
  stepsEn: string[];
  completedSteps?: number[];
  expectedBenefitBn: string;
  expectedBenefitEn: string;
  deadlineDate: string;
  status: ActionStatus;
  completedDate?: string;
  unableReason?: string;
  helpReason?: string;
  notes?: string;
  photoUrl?: string;
  deferredAlternativeBn?: string;
  deferredAlternativeEn?: string;
  reasonForSelectionBn?: string;
  reasonForSelectionEn?: string;
  assignedTo?: string;
  assignedCategory?: 'self' | 'family' | 'worker';
  applicableSpecies?: Species[];
  applicableFarmTypes?: FarmType[];
  knowledgeTopicId?: string;
  sourceAdvisoryId?: string;
  verificationStatus?: 'pending_verification' | 'self_reported' | 'evidence_submitted' | 'independently_verified';
  sourceModule?: 'biosecurity_audit' | 'preventive_care' | 'disease_advisory' | 'environmental';
  targetDescriptionBn?: string;
  targetDescriptionEn?: string;
}

export interface CriticalAlert {
  id: string;
  domainId: string;
  titleBn: string;
  titleEn: string;
  riskCategory: 'critical' | 'high';
  whyItMattersBn: string;
  whyItMattersEn: string;
  immediateStepsBn: string[];
  immediateStepsEn: string[];
  vetGuidanceBn: string;
  vetGuidanceEn: string;
}

export interface JudgeXRayExplanation {
  actionId: string;
  actionTitleBn: string;
  actionTitleEn: string;
  triggeredByDomainId: string;
  auditResponse: AuditResponse;
  ruleTriggeredBn: string;
  ruleTriggeredEn: string;
  resourceConstraintAppliedBn: string;
  resourceConstraintAppliedEn: string;
  deferredAlternativeBn: string;
  deferredAlternativeEn: string;
  assumptionsMadeBn: string[];
  assumptionsMadeEn: string[];
  unvalidatedCaveatBn: string;
  unvalidatedCaveatEn: string;
}

// Knowledge Library Models
export type KnowledgeCategory =
  | 'daily_hygiene'
  | 'vaccine_deworming'
  | 'quarantine'
  | 'feed_water'
  | 'seasonal_care'
  | 'emergency_vet';

export interface KnowledgeArticle {
  id: string;
  topicKey: string;
  category: KnowledgeCategory;
  speciesFocus: 'all' | 'poultry' | 'ruminant';
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  whyImportantBn: string;
  whyImportantEn: string;
  stepsBn: string[];
  stepsEn: string[];
  materialsBn?: string;
  materialsEn?: string;
  warningBn?: string;
  warningEn?: string;
  reviewStatusBn: string;
  reviewStatusEn: string;
  illustrationKey:
    | 'footbath'
    | 'handwashing'
    | 'sick_isolation'
    | 'dead_burial'
    | 'feed_water'
    | 'pest_control'
    | 'vaccination'
    | 'deworming'
    | 'heat_stress'
    | 'emergency_vet';
}

export interface SmsNotificationPreferences {
  phoneNumber: string;
  isPhoneVerified: boolean;
  smsOptInConsent: boolean;
  consentTimestamp?: string;
  categories: {
    vaccinations: boolean;
    deworming: boolean;
    biosecurity: boolean;
    regionalAlerts: boolean;
    vetAppointments: boolean;
  };
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  ivrVoiceInterest: boolean;
  gatewayStatus: 'planned_demo';
}

export interface KhamarBondhuMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isEmergencyAlert?: boolean;
  topicKey?: string;
  timestamp: string;
}

// Navigation Screens
export type NavScreen =
  | 'dashboard'
  | 'animals'
  | 'calendar'
  | 'health_support'
  | 'ai_assistant'
  | 'vet_services'
  | 'biosecurity'
  | 'regional_alerts'
  | 'knowledge_library'
  | 'ussd_simulator'
  | 'governance_portal'
  | 'roadmap'
  | 'settings';

