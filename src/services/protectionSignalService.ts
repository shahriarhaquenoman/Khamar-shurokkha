import {
  FarmProfile,
  AnimalProfile,
  FlockProfile,
  RegionalAlert,
  WeatherInfo,
  ProtectionSignal,
  ActionPlanItem,
} from '../types';

/**
 * BioShield Operational Framework: Alert-to-Action Integration Engine
 *
 * Decision Pathway:
 * INFORMATION SOURCE
 *   ↓
 * SOURCE VALIDATION (Authority, Verification Status, Active Dates)
 *   ↓
 * FARM RELEVANCE CHECK (Geographic location, species present in herd/flock)
 *   ↓
 * PROTECTION SIGNAL
 *   ↓
 * ACTION ELIGIBILITY RULE (Approved Protocol Template match)
 *   ↓
 * BIOSHIELD TASK (Priority Queue with Explainable Clinical Rationale)
 */

export const protectionSignalService = {
  /**
   * Evaluates a Regional Disease Alert against farm context
   */
  evaluateDiseaseAlert(
    alert: RegionalAlert,
    farm: FarmProfile,
    animals: AnimalProfile[],
    flocks: FlockProfile[]
  ): ProtectionSignal | null {
    // 1. Source & Verification Status Validation
    const isUnderReview = alert.verificationStatus === 'under_review' || alert.verificationStatus === 'reported';
    const isVerifiedOrOfficial = alert.verificationStatus === 'official_dls' || alert.verificationStatus === 'verified';

    // 2. Geographic Relevance Check
    const farmDist = farm.district.toLowerCase();
    const alertDist = alert.district.toLowerCase();
    const isGeographicallyRelevant =
      alertDist.includes(farmDist) ||
      farmDist.includes(alertDist) ||
      alertDist.includes('national') ||
      alertDist.includes('জাতীয়') ||
      alertDist.includes('সারা দেশ');

    if (!isGeographicallyRelevant) {
      return null;
    }

    // 3. Species Relevance Check
    const farmSpecies = new Set<string>();
    farm.speciesPresent.forEach((s) => farmSpecies.add(String(s)));
    animals.forEach((a) => farmSpecies.add(String(a.species)));
    flocks.forEach((f) => farmSpecies.add(String(f.poultryType)));

    const hasMatchingSpecies = alert.species.some((sp) => {
      const spStr = String(sp);
      if (farmSpecies.has(spStr)) return true;
      if (spStr === 'cattle' && (farmSpecies.has('cattle') || farmSpecies.has('buffalo'))) return true;
      if (spStr.includes('chicken') && Array.from(farmSpecies).some((s) => s.includes('chicken'))) return true;
      if (spStr === 'duck' && farmSpecies.has('duck')) return true;
      return false;
    });

    if (!hasMatchingSpecies) {
      return null;
    }

    // 4. Action Eligibility Rules
    // Under-review items NEVER automatically trigger mandatory production tasks
    const eligibilityStatus: ProtectionSignal['eligibilityStatus'] = isUnderReview
      ? 'pending_vet_review'
      : alert.isSimulated
      ? 'simulated_demo'
      : isVerifiedOrOfficial
      ? 'eligible_action'
      : 'information_only';

    const priority: ProtectionSignal['priority'] =
      alert.severity === 'emergency' || alert.severity === 'warning'
        ? 'urgent'
        : 'high';

    const signalId = `sig_alert_${alert.id}_${farm.id}`;

    return {
      id: signalId,
      sourceType: 'regional_alert',
      sourceId: alert.id,
      sourceTitleBn: alert.titleBn,
      sourceTitleEn: alert.titleEn,
      sourceAuthority: alert.source,
      farmId: farm.id,
      targetType: 'farm',
      targetDescriptionBn: `${farm.name} (আঞ্চলিক রোগ প্রতিরোধ)`,
      targetDescriptionEn: `${farm.name} (Regional Disease Defense)`,
      actionCategory: 'biosecurity',
      priority,
      reasonBn: `আঞ্চলিক সতর্কবার্তা (${alert.source}) অনুযায়ী আপনার এলাকায় খুরারোগ/সংক্রামক ব্যাধির উপস্থিতি শনাক্ত হয়েছে। খামারে প্রবেশাধিকার নিয়ন্ত্রণ ও ফুটবাথ জীবাণুমুক্তকরণ জরুরি।`,
      reasonEn: `Verified advisory (${alert.source}) indicates regional pathogen activity. Entry biosecurity and footbath sanitization required.`,
      suggestedActionTitleBn: `আঞ্চলিক সতর্কবার্তা প্রতিরোধ: ${alert.titleBn.split(':')[0] || 'জীবনিরাপত্তা জোরদারকরণ'}`,
      suggestedActionTitleEn: `Regional Alert Defense: Enhanced Barrier Biosecurity`,
      practicalStepsBn: alert.recommendedPrecautionsBn.length > 0
        ? alert.recommendedPrecautionsBn
        : [
            'খামারের প্রবেশপথে তাজা জীবাণুনাশক ফুটবাথ স্থাপন ও নিয়মিত পানি পরিবর্তন করুন।',
            'বাইরের অচেনা দর্শনার্থী ও বেপারিদের শেডে প্রবেশ সাময়িকভাবে স্থগিত রাখুন।',
            'নতুন আনা যেকোনো পশুকে অন্তত ২১ দিন সম্পূর্ণ আলাদা কোয়ারেন্টাইনে পর্যবেক্ষণ করুন।',
          ],
      practicalStepsEn: alert.recommendedPrecautionsEn.length > 0
        ? alert.recommendedPrecautionsEn
        : [
            'Maintain fresh disinfectant footbaths at all barn entryways.',
            'Restrict outside visitors and livestock traders from shed premises.',
            'Quarantine any incoming stock for minimum 21 days in separate quarters.',
          ],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eligibilityStatus,
      isSimulated: alert.isSimulated,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Evaluates Weather Conditions for Seasonal Preparedness
   */
  evaluateWeatherAlert(
    weather: WeatherInfo,
    farm: FarmProfile
  ): ProtectionSignal | null {
    // Only produce signals for moderate/high/severe stress
    if (weather.heatStressIndex === 'low') {
      return null;
    }

    const priority: ProtectionSignal['priority'] =
      weather.heatStressIndex === 'severe' || weather.heatStressIndex === 'high'
        ? 'urgent'
        : 'routine';

    const isHeatStress = weather.temp >= 32 || weather.humidity >= 75;

    return {
      id: `sig_weather_${farm.id}_${new Date().toISOString().split('T')[0]}`,
      sourceType: 'weather_warning',
      sourceId: `weather_${weather.district}`,
      sourceTitleBn: `মৌসুমী আবহাওয়া সতর্কতা: ${weather.condition}`,
      sourceTitleEn: `Weather Advisory: ${weather.condition}`,
      sourceAuthority: 'আঞ্চলিক কৃষি ও আবহাওয়া পর্যবেক্ষণ কেন্দ্র (নমুনা ডেমো ডাটা)',
      farmId: farm.id,
      targetType: 'farm',
      targetDescriptionBn: `${farm.name} (শেড পরিবেশ ও বায়ুচলাচল)`,
      targetDescriptionEn: `${farm.name} (Shed Environment & Ventilation)`,
      actionCategory: 'management_precaution',
      priority,
      reasonBn: `উচ্চ তাপমাত্রা (${weather.temp}°C) ও বাতাসের আর্দ্রতার (${weather.humidity}%) কারণে প্রাণীদের হিট-স্ট্রেস ঝুঁকি রয়েছে।`,
      reasonEn: `High temperature (${weather.temp}°C) and relative humidity (${weather.humidity}%) increase livestock heat stress.`,
      suggestedActionTitleBn: isHeatStress
        ? 'শেড বায়ুচলাচল বৃদ্ধি ও ঠান্ডা পানীয় জল নিশ্চিতকরণ'
        : 'বৃষ্টিজনিত স্যাঁতসেঁতে পরিবেশ ও লিটার নিয়ন্ত্রণ',
      suggestedActionTitleEn: isHeatStress
        ? 'Maximize Shed Ventilation & Ensure Cool Hydration'
        : 'Mitigate Damp Shed Environment & Litter Management',
      practicalStepsBn: weather.managementTipsBn,
      practicalStepsEn: weather.managementTipsEn,
      dueDate: new Date().toISOString().split('T')[0],
      eligibilityStatus: 'eligible_action',
      isSimulated: true, // Clearly marked as demo weather data
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Converts an eligible Protection Signal into a first-class BioShield ActionPlanItem
   * Ensures idempotency and transparent source tracking
   */
  convertSignalToBioShieldAction(signal: ProtectionSignal): ActionPlanItem {
    return {
      id: `act_${signal.id}`,
      auditSessionId: 'session_regional_alert_response',
      domainId: 'domain_regional_alert_response',
      titleBn: signal.suggestedActionTitleBn,
      titleEn: signal.suggestedActionTitleEn,
      whyRecommendedBn: signal.reasonBn,
      whyRecommendedEn: signal.reasonEn,
      riskCategory: signal.priority === 'urgent' ? 'critical' : signal.priority === 'high' ? 'high' : 'routine',
      priority: signal.priority === 'urgent' ? 'urgent' : signal.priority === 'high' ? 'high' : 'routine',
      estimatedEffort: 'low',
      costCategory: 'low',
      requiredMaterialsBn: 'জীবাণুনাশক দ্রবণ, ফুটবাথ ট্রে, পরিষ্কার পানি',
      requiredMaterialsEn: 'Disinfectant solution, footbath tray, clean water',
      stepsBn: signal.practicalStepsBn,
      stepsEn: signal.practicalStepsEn,
      expectedBenefitBn: 'আঞ্চলিক প্রাদুর্ভাব থেকে খামারের প্রাণী ও পশুপাখিকে সংক্রামক জীবাণু প্রবেশ রোধ করা।',
      expectedBenefitEn: 'Prevent external pathogens from entering farm stock during regional disease outbreaks.',
      deadlineDate: signal.dueDate,
      status: 'pending',
      farmId: signal.farmId,
      assignedTo: 'খামারি নিজে',
      assignedCategory: 'self',
      sourceAdvisoryId: signal.sourceId,
      knowledgeTopicId: 'topic_daily_hygiene',
      sourceModule: 'disease_advisory',
      targetDescriptionBn: signal.targetDescriptionBn,
      targetDescriptionEn: signal.targetDescriptionEn,
    };
  },
};
