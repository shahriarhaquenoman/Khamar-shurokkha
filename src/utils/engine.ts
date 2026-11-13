import {
  AuditResponse,
  BudgetCategory,
  FarmProfile,
  ActionPlanItem,
  CriticalAlert,
  JudgeXRayExplanation,
} from '../types';
import { BIOSECURITY_DOMAINS, isDomainApplicableToFarm, getFarmAnimalGroups } from '../data/biosecurityQuestions';

/**
 * Resource-Adaptive Corrective Action Engine
 * Takes farm profile, budget category, and audit answers
 * Produces up to 3 prioritized actions for the upcoming week and Judge X-Ray explanations.
 */
export function generateAdaptiveActionPlan(
  farm: FarmProfile,
  auditAnswers: Record<string, { domainId: string; response: AuditResponse }>,
  auditSessionId: string
): {
  actions: ActionPlanItem[];
  criticalAlerts: CriticalAlert[];
  xRayExplanations: JudgeXRayExplanation[];
} {
  const criticalAlerts: CriticalAlert[] = [];
  const candidateIssues: {
    domainId: string;
    domainKey: string;
    response: AuditResponse;
    riskSeverity: 'critical' | 'high' | 'routine';
    priorityScore: number;
  }[] = [];

  const { hasPoultry, hasRuminant } = getFarmAnimalGroups(farm);
  const isRuminantOnly = hasRuminant && !hasPoultry;

  // 1. Evaluate weaknesses only across domains applicable to this farm's species
  BIOSECURITY_DOMAINS.filter((d) => isDomainApplicableToFarm(d, farm)).forEach((domain) => {
    const answer = auditAnswers[domain.id];
    if (!answer) return;

    if (answer.response === 'missing' || answer.response === 'partial') {
      let severityWeight = 10;
      if (domain.riskSeverity === 'critical') severityWeight = 40;
      else if (domain.riskSeverity === 'high') severityWeight = 25;

      const responseWeight = answer.response === 'missing' ? 20 : 10;
      const priorityScore = severityWeight + responseWeight;

      candidateIssues.push({
        domainId: domain.id,
        domainKey: domain.domainKey,
        response: answer.response,
        riskSeverity: domain.riskSeverity,
        priorityScore,
      });

      // Generate Critical Alert if a Critical domain is Missing
      if (domain.riskSeverity === 'critical' && answer.response === 'missing') {
        if (domain.domainKey === 'sick_bird_isolation') {
          criticalAlerts.push({
            id: `crit_${domain.id}`,
            domainId: domain.id,
            titleBn: isRuminantOnly
              ? 'জরুরি সতর্কতা: অসুস্থ বা নতুন প্রাণী সুস্থ পালের সাথে অবস্থান করছে'
              : 'জরুরি সতর্কতা: অসুস্থ পাখি সুস্থ মুরগির সাথে অবস্থান করছে',
            titleEn: isRuminantOnly
              ? 'Critical Safeguard: Sick or New Livestock Cohabitating with Herd'
              : 'Critical Safeguard: Sick Birds Cohabitating with Flock',
            riskCategory: 'critical',
            whyItMattersBn: isRuminantOnly
              ? 'অসুস্থ গরু-ছাগল আলাদা না রাখলে ক্ষুরা রোগ বা পিপিআর পুরো গোয়ালে ছড়িয়ে পড়তে পারে।'
              : 'অসুস্থ পাখি আলাদা না রাখলে বাতাসের মাধ্যমে বা লালা-মলের সংস্পর্শে পুরো শেডের পাখি আক্রান্ত হতে পারে।',
            whyItMattersEn: isRuminantOnly
              ? 'Keeping sick or newly purchased livestock with the herd accelerates spread of FMD or PPR.'
              : 'Failure to separate sick birds may increase the risk of rapid disease transmission within the flock.',
            immediateStepsBn: isRuminantOnly
              ? [
                  'অবিলম্বে অসুস্থ বা নতুন কেনা প্রাণীকে সুস্থ প্রাণীর গোয়াল থেকে দূরে আলাদা স্থানে বাঁধুন।',
                  'সুস্থ প্রাণীর পরিচর্যা শেষ করে তবেই আলাদা রাখা প্রাণীর কাছে যান।',
                  'আলাদা রাখা প্রাণীর খাবার ও পানির পাত্র সম্পূর্ণ পৃথক রাখুন এবং পরে সাবান-পানিতে হাত ধুয়ে নিন।',
                  'লক্ষণ বাড়লে অবিলম্বে নিবন্ধিত পশুচিকিৎসক অথবা খামার সুরক্ষা সহায়তা কেন্দ্রে যোগাযোগ করুন।',
                ]
              : [
                  'অবিলম্বে অসুস্থ বা ঝিমানো পাখিকে প্রধান শেড থেকে বের করে আলাদা খাঁচায় রাখুন।',
                  'সুস্থ পাখির পরিচর্যা শেষ করে তবেই অসুস্থ পাখির শেড বা খাঁচায় যান।',
                  'অসুস্থ পাখি ধরার পর সাবান-পানি বা জীবাণুনাশক দিয়ে হাত ও জুতা ধুয়ে নিন।',
                  'অস্বাভাবিক মৃত্যু বা দ্রুত ছড়ানোর লক্ষণ দেখলে অবিলম্বে নিবন্ধিত পশুচিকিৎসক বা খামার সুরক্ষা সহায়তা কেন্দ্রে যোগাযোগ করুন।',
                ],
            immediateStepsEn: [
              'Immediately separate sick animals into an isolated enclosure away from healthy stock.',
              'Always attend to healthy animals first; handle isolated animals last.',
              'Disinfect hands and shed boots thoroughly after tending isolated stock.',
              'If symptoms escalate, contact Khamar Shurokkha support or a registered veterinarian immediately.',
            ],
            vetGuidanceBn: 'এটি রোগ নির্ণয় নয়। খামারে অ্যান্টিবায়োটিক বা ওষুধ নিজে না দিয়ে নিবন্ধিত পশুচিকিৎসকের পরামর্শ নিন।',
            vetGuidanceEn: 'This alert is a biosecurity safeguard, not a clinical diagnosis. Consult a registered veterinarian before administering treatment.',
          });
        } else if (domain.domainKey === 'dead_bird_disposal') {
          criticalAlerts.push({
            id: `crit_${domain.id}`,
            domainId: domain.id,
            titleBn: isRuminantOnly
              ? 'জরুরি সতর্কতা: মৃত প্রাণী বা সংক্রামক বর্জ্য উন্মুক্ত স্থানে ফেলার ঝুঁকি'
              : 'জরুরি সতর্কতা: মৃত পাখি উন্মুক্ত স্থানে ফেলার মারাত্মক ঝুঁকি',
            titleEn: isRuminantOnly
              ? 'Critical Safeguard: Unsafe Carcass & Bio-Waste Disposal'
              : 'Critical Safeguard: Unsafe Dead Bird Disposal',
            riskCategory: 'critical',
            whyItMattersBn: 'খোলা স্থানে বা ড্রেনে মৃত দেহ বা বর্জ্য ফেললে কুকুর, শিয়াল ও কাক জীবাণু পুরো এলাকায় ছড়িয়ে দিতে পারে।',
            whyItMattersEn: 'Discarding carcasses in open spaces allows scavengers to spread infectious loads across nearby farms.',
            immediateStepsBn: [
              'কোনো অবস্থাতেই মৃত দেহ রাস্তার পাশে, ডোবায় বা খামারের ড্রেনে ফেলবেন না।',
              'খামার ও পানির উৎস থেকে দূরে অন্তত ৩ ফুট গভীর গর্ত খনন করুন।',
              'উপরে পর্যাপ্ত চুন (Quicklime) ছড়িয়ে ভালোভাবে মাটি চাপা দিন।',
              'কুকুর বা শিয়াল যেন মাটি খুঁড়তে না পারে তা নিশ্চিত করতে উপরে ভারী বস্তু রাখুন।',
            ],
            immediateStepsEn: [
              'Never discard dead animals or birds in ditches, rivers, or open fields.',
              'Dig an isolated disposal pit at least 3 feet deep away from drinking water.',
              'Cover with quicklime before backfilling tightly with soil.',
              'Place heavy covers over the pit to block scavengers.',
            ],
            vetGuidanceBn: 'একাধিক প্রাণী বা পাখি মারা গেলে অবিলম্বে স্থানীয় প্রাণিসম্পদ হাসপাতালে যোগাযোগ করুন।',
            vetGuidanceEn: 'Consult the local veterinary hospital immediately if multiple animals die.',
          });
        }
      }
    }
  });

  // Sort candidate issues by priority score descending
  candidateIssues.sort((a, b) => b.priorityScore - a.priorityScore);

  // Take top-3 issues
  const topIssues = candidateIssues.slice(0, 3);

  const actions: ActionPlanItem[] = [];
  const xRayExplanations: JudgeXRayExplanation[] = [];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const deadlineStr = tomorrow.toISOString().split('T')[0];

  topIssues.forEach((issue, index) => {
    const domain = BIOSECURITY_DOMAINS.find((d) => d.id === issue.domainId);
    if (!domain) return;

    const budget = farm.budgetCategory || 'low';
    const resources = farm.availableResources || [];
    const actionData = buildAdaptiveActionContent(
      domain.domainKey,
      budget,
      resources,
      issue.response,
      isRuminantOnly
    );

    const actionItem: ActionPlanItem = {
      id: `act_${issue.domainId}_${Date.now()}_${index}`,
      farmId: farm.id,
      auditSessionId,
      domainId: issue.domainId,
      knowledgeTopicId: domain.knowledgeTopicId,
      applicableSpecies: farm.speciesPresent,
      titleBn: actionData.titleBn,
      titleEn: actionData.titleEn,
      whyRecommendedBn: actionData.whyRecommendedBn,
      whyRecommendedEn: actionData.whyRecommendedEn,
      riskCategory: domain.riskSeverity === 'critical' ? 'critical' : domain.riskSeverity === 'high' ? 'high' : 'routine',
      priority: domain.riskSeverity === 'critical' ? 'urgent' : domain.riskSeverity === 'high' ? 'high' : 'routine',
      sourceModule: 'biosecurity_audit',
      targetDescriptionBn: `${farm.name} (সমগ্র খামার)`,
      targetDescriptionEn: `${farm.name} (Whole Farm)`,
      estimatedEffort: actionData.effort,
      costCategory: actionData.costCategory,
      requiredMaterialsBn: actionData.materialsBn,
      requiredMaterialsEn: actionData.materialsEn,
      stepsBn: actionData.stepsBn,
      stepsEn: actionData.stepsEn,
      expectedBenefitBn: actionData.benefitBn,
      expectedBenefitEn: actionData.benefitEn,
      deadlineDate: deadlineStr,
      status: 'pending',
      deferredAlternativeBn: actionData.deferredBn,
      deferredAlternativeEn: actionData.deferredEn,
      reasonForSelectionBn: actionData.selectionReasonBn,
      reasonForSelectionEn: actionData.selectionReasonEn,
    };

    actions.push(actionItem);

    // Build Judge X-Ray Explanation
    xRayExplanations.push({
      actionId: actionItem.id,
      actionTitleBn: actionItem.titleBn,
      actionTitleEn: actionItem.titleEn,
      triggeredByDomainId: domain.id,
      auditResponse: issue.response,
      ruleTriggeredBn: `পরীক্ষায় এই বিষয়টি "${issue.response === 'missing' ? 'বজায় রাখা হয়নি (Missing)' : 'আংশিক (Partial)'}" চিহ্নিত হয়েছিল। এর প্রোটোটাইপ গুরুত্ব মাত্রা: ${domain.riskSeverity.toUpperCase()}।`,
      ruleTriggeredEn: `Triggered because audit recorded "${issue.response.toUpperCase()}". Baseline prototype severity: ${domain.riskSeverity.toUpperCase()}.`,
      resourceConstraintAppliedBn: `খামারের বাজেট ক্যাটাগরি "${getBudgetNameBn(budget)}" বিবেচনায় নিয়ে বাস্তবসম্মত ও স্বল্পব্যয়ী সমাধান নির্বাচন করা হয়েছে।`,
      resourceConstraintAppliedEn: `Adapted to farm budget category "${budget}". Prioritized high-feasibility, low-capital corrective protocol.`,
      deferredAlternativeBn: actionData.deferredBn,
      deferredAlternativeEn: actionData.deferredEn,
      assumptionsMadeBn: [
        'খামারে নির্ধারিত প্রয়োজনীয় মৌলিক কাঁচামাল (যেমন: সাবান, পানি, চুন) স্থানীয় বাজারে সহজলভ্য।',
        'খামারের একজন কর্মী বা পারিবারিক সদস্য প্রতিদিন ১৫-২০ মিনিট সংস্কারকাজে সময় দিতে সক্ষম।',
      ],
      assumptionsMadeEn: [
        'Basic physical inputs (soap, clean water, quicklime) are locally accessible at upazila bazaar.',
        'At least one farm worker or family member is available to allocate 15-20 minutes daily for maintenance.',
      ],
      unvalidatedCaveatBn: 'গুরুত্বপূর্ণ সতর্কতা: এই সুপারিশটি প্রোটোটাইপ রুল-ইঞ্জিন দ্বারা তৈরি। স্বল্পব্যয়ী বিকল্প সমাধানকে কাঠামোগত স্থায়ী পরিকাঠামোর সমতুল্য বৈজ্ঞানিক প্রতিস্থাপন হিসেবে দাবি করা যাবে না।',
      unvalidatedCaveatEn: 'Methodological caveat: This is an empirical rule-based prototype. Low-cost procedural workarounds must not be claimed as scientifically equivalent to permanent bio-secure engineering.',
    });
  });

  return { actions, criticalAlerts, xRayExplanations };
}

function getBudgetNameBn(b: BudgetCategory): string {
  switch (b) {
    case 'very_limited':
      return 'অত্যন্ত সীমিত';
    case 'low':
      return 'স্বল্প বাজেট';
    case 'moderate':
      return 'মাঝারি বাজেট';
    case 'flexible':
      return 'নমনীয় বাজেট';
    default:
      return 'স্বল্প বাজেট';
  }
}

/**
 * Builds resource-adaptive content tailored to Budget and Domain
 */
function buildAdaptiveActionContent(
  domainKey: string,
  budget: BudgetCategory,
  resources: string[],
  response: AuditResponse,
  isRuminantOnly = false
) {
  const isLowBudget = budget === 'very_limited' || budget === 'low';

  switch (domainKey) {
    case 'sick_bird_isolation':
      if (isRuminantOnly) {
        return {
          titleBn: isLowBudget
            ? 'অসুস্থ বা নতুন গরু-ছাগল সুস্থ পাল থেকে আলাদা রাখা'
            : 'আলাদা কোয়ারেন্টাইন বাঁধাই ও পৃথক খাবার-পানির পাত্র ব্যবস্থা',
          titleEn: isLowBudget
            ? 'Isolate Sick or New Ruminants Away from Main Herd'
            : 'Set Up Dedicated Ruminant Quarantine Pen & Equipment',
          whyRecommendedBn:
            'খুরা রোগ, পিপিআর বা চর্মরোগ দ্রুত এক প্রাণী থেকে পুরো গোয়ালে ছড়িয়ে পড়ে। অসুস্থ বা নতুন কেনা প্রাণী অন্তত ১৪ দিন আলাদা রাখলে ক্ষতি অনেক কমানো যায়।',
          whyRecommendedEn:
            'FMD, PPR, and skin infections spread rapidly through shared troughs and close contact. Isolating sick or new livestock for 14 days protects the main herd.',
          effort: 'low' as const,
          costCategory: isLowBudget ? ('free' as const) : ('low' as const),
          materialsBn: 'একটি বাঁশের বেড়া বা আলাদা খুঁটি, পৃথক বালতি ও খাবারের চাড়ি, চুন।',
          materialsEn: 'Separate bamboo partition or tether corner, dedicated bucket and feed trough, lime.',
          stepsBn: [
            'মূল গোয়াল বা ছাগলের ঘর থেকে অন্তত ১৫-২০ হাত দূরে আলাদা জায়গায় প্রাণীটিকে বাঁধুন।',
            'অসুস্থ বা নতুন প্রাণীর জন্য আলাদা বালতি ও খাবারের পাত্র ব্যবহার করুন।',
            'সুস্থ পালের পরিচর্যা শেষ করে সবশেষে আলাদা রাখা প্রাণীর কাছে যান এবং সাবান দিয়ে হাত ধুয়ে নিন।',
          ],
          stepsEn: [
            'Tether or pen the sick/new animal at least 20-30 feet away from the main shed.',
            'Use dedicated water buckets and feed troughs that never mix with healthy stock.',
            'Tend to healthy animals first, handle the isolated animal last, and wash hands with soap.',
          ],
          benefitBn: 'বড় খরচ ছাড়াই খুরা রোগ ও পিপিআর সংক্রমণ গোয়ালে ছড়ানো অনেকাংশে থামানো যায়।',
          benefitEn: 'Dramatically reduces herd-wide transmission of FMD and PPR at near-zero cost.',
          deferredBn: isLowBudget
            ? 'পাকা আলাদা আইসোলেশন শেড নির্মাণ বাজেটের কারণে আপাতত স্থগিত রাখা হয়েছে।'
            : 'কোনো বিকল্প স্থগিত নয়।',
          deferredEn: isLowBudget
            ? 'Permanent masonry isolation shed deferred due to budget.'
            : 'No structural alternative deferred.',
          selectionReasonBn: 'খামারটিতে গরু/ছাগল থাকায় হাঁস-মুরগির বদলে পশুপাল-উপযোগী পৃথকীকরণ নির্দেশনা দেওয়া হয়েছে।',
          selectionReasonEn: 'Tailored to ruminant species so cattle/goat farmers receive relevant guidance.',
        };
      }
      if (isLowBudget) {
        return {
          titleBn: 'শেডের বাইরে স্বল্পব্যয়ী আলাদা আইসোলেশন খাঁচা স্থাপন',
          titleEn: 'Set Up Low-Cost Segregated Sick Bird Isolation Cage',
          whyRecommendedBn: 'অসুস্থ পাখি দ্রুত প্রধান শেড থেকে আলাদা করা না হলে সংক্রামক ভাইরাস পুরো ফ্লকে দ্রুত ছড়িয়ে পড়তে পারে।',
          whyRecommendedEn: 'Promptly separating dull birds curbs viral shedding and prevents healthy birds from inhaling aerosolized droplets.',
          effort: 'low' as const,
          costCategory: 'low' as const,
          materialsBn: 'একটি পুরাতন বাঁশ বা তারের খাঁচা, প্লাস্টিক ড্রামের অর্ধেক অংশ, খাবার ও পানির দুটি আলাদা বাটি।',
          materialsEn: 'One existing bamboo or wire coop, repurposed plastic crate, separate drinker and feeder.',
          stepsBn: [
            'প্রধান শেড থেকে অন্তত ৩০-৫০ ফুট দূরে বাতাস চলাচলের বিপরীতে খাঁচাটি স্থাপন করুন।',
            'অসুস্থ মুরগিকে সেখানে রেখে পর্যাপ্ত তাজা পানি ও খাবার দিন।',
            'এই খাঁচায় ব্যবহৃত পাত্র কখনোই প্রধান শেডের পাত্রের সাথে মেশাবেন না।',
            'সুস্থ মুরগির কাজ শেষ করে তবেই এই খাঁচায় পরিচর্যার জন্য প্রবেশ করুন।',
          ],
          stepsEn: [
            'Position the recovery cage at least 30-50 feet downwind from main production sheds.',
            'Transfer identified dull/sick birds immediately with dedicated feed and water.',
            'Strictly keep recovery feeders and drinkers separate; never wash them together with main equipment.',
            'Always tend to healthy sheds first; inspect the quarantine cage only at the end of daily rounds.',
          ],
          benefitBn: 'বড় ধরনের শেড নির্মাণ ছাড়াই তাৎক্ষণিকভাবে সংক্রামক রোগের বিস্তার ৫০-৭০% হ্রাস করা সম্ভব।',
          benefitEn: 'Minimizes pathogen circulation immediately without waiting for expensive hospital shed construction.',
          deferredBn: 'বাজেট সীমাবদ্ধতার কারণে আলাদা স্থায়ী পাকা কোয়ারেন্টাইন শেড নির্মাণ আপাতত স্থগিত রাখা হয়েছে।',
          deferredEn: 'Permanent masonry quarantine facility deferred due to initial capital constraints.',
          selectionReasonBn: 'স্বল্পব্যয়ী ও তাৎক্ষণিক বাস্তবায়নযোগ্য হওয়ায় বাঁশের পৃথক খাঁচাকে অগ্রাধিকার দেওয়া হয়েছে।',
          selectionReasonEn: 'Prioritized immediate implementation using locally available materials.',
        };
      } else {
        return {
          titleBn: 'স্থায়ী পৃথকীকরণ কোয়ারেন্টাইন শেড ও স্বাস্থ্যবিধি এলাকা তৈরি',
          titleEn: 'Construct Permanent Isolation Enclosure with Dedicated Hygiene Station',
          whyRecommendedBn: 'বাণিজ্যিক খামারে স্থায়ী ও বাতাস নিয়ন্ত্রণযোগ্য কোয়ারেন্টাইন সুবিধা রোগ প্রতিরক্ষায় সর্বোচ্চ ভূমিকা রাখে।',
          whyRecommendedEn: 'Permanent segregated housing provides superior biosecurity containment and microclimate control.',
          effort: 'medium' as const,
          costCategory: 'moderate' as const,
          materialsBn: 'টিন বা বাঁশের বেড়াযুক্ত আলাদা ছোট শেড, জালির পার্টিশন, ডেডিকেটেড অ্যাপ্রন ও আলাদা পানির লাইন।',
          materialsEn: 'Small partitioned enclosure, wire mesh fencing, dedicated protective coat, standalone watering kit.',
          stepsBn: [
            'প্রধান শেড থেকে ১০০ ফুট দূরে আলাদা শেড নিশ্চিত করুন।',
            'আলাদা ফুটবাথ ও জুতার র‍্যাক স্থাপন করুন।',
            'লক্ষণ পর্যবেক্ষণ চার্ট ঝুলিয়ে রাখুন এবং প্রতিদিন মৃত্যুর হিসাব লিখুন।',
          ],
          stepsEn: [
            'Ensure a 100-foot buffer zone between the quarantine unit and primary housing.',
            'Install dedicated footbath and distinct rubber boots at quarantine entrance.',
            'Maintain daily symptom observation and mortality tracking logs.',
          ],
          benefitBn: 'দীর্ঘমেয়াদে ব্রয়লার ও লেয়ার ফ্লকের জীব-নিরাপত্তা মান উন্নত হয়।',
          benefitEn: 'Provides durable multi-batch biosecurity integrity for commercial flocks.',
          deferredBn: 'কোনো বিকল্প স্থগিত করা হয়নি; পর্যাপ্ত বাজেট থাকায় স্থায়ী সমাধান অগ্রাধিকার পেয়েছে।',
          deferredEn: 'No major alternative deferred; capital budget allows permanent structure.',
          selectionReasonBn: 'নমনীয় বাজেটের সুযোগ থাকায় দীর্ঘস্থায়ী সমাধান নির্বাচন করা হয়েছে।',
          selectionReasonEn: 'Budget headroom justifies permanent infrastructure investment.',
        };
      }

    case 'handwashing_hygiene':
      return {
        titleBn: 'শেডের প্রবেশমুখে কার্যকর হাত ধোয়ার ব্যবস্থা স্থাপন',
        titleEn: 'Install Accessible Handwashing Station at Shed Entrance',
        whyRecommendedBn: 'হাত জীব-নিরাপত্তা লঙ্ঘনের একটি প্রধান বাহক। নিয়মিত সাবান দিয়ে হাত ধুলে বহু সংক্রামক ব্যাকটেরিয়ার বিস্তার রোধ হয়।',
        whyRecommendedEn: 'Hands frequently carry external enteric and respiratory microbes into bird feeding lines.',
        effort: 'low' as const,
        costCategory: isLowBudget ? ('free' as const) : ('low' as const),
        materialsBn: isLowBudget
          ? 'একটি পুরাতন বালতি বা ড্রাম যাতে ট্যাপ লাগানো আছে, সাবান ও একটি সাবানের ঢাকনাযুক্ত কেস।'
          : 'একটি প্লাস্টিক পানির সিন্ক বা বেসিন, তরল হ্যান্ডওয়াশ ও ডিসপোজেবল তোয়ালে।',
        materialsEn: isLowBudget
          ? 'One plastic bucket with gravity tap, antibacterial bar soap with draining soap dish.'
          : 'Wall-mounted sink with foot-pump tap, liquid disinfectant soap, paper towels.',
        stepsBn: [
          'শেডের দরজার ঠিক পাশেই পানির ড্রাম বা বালতি উঁচু মাচায় রাখুন।',
          'সাবান বৃষ্টির পানিতে যাতে গলে না যায় সেজন্য ঢাকনাযুক্ত পাত্রে ঝুলিয়ে রাখুন।',
          'শেডে প্রবেশের আগে অন্তত ২০ সেকেন্ড সাবান দিয়ে হাত ঘষে ধুয়ে শুকিয়ে নিন।',
        ],
        stepsEn: [
          'Position water reservoir on elevated stand directly adjacent to the entrance door.',
          'Keep soap protected from rain splash in a covered draining holder.',
          'Enforce minimum 20-second scrub with lather before stepping past the threshold.',
        ],
        benefitBn: 'অল্প খরচে খামারকর্মীদের ব্যক্তিগত পরিচ্ছন্নতার সুঅভ্যাস গড়ে ওঠে।',
        benefitEn: 'Instills daily hygiene compliance among farm workers with negligible operational cost.',
        deferredBn: isLowBudget
          ? 'প্লাম্বিং পাইপলাইনসহ দামী মেটাল বেসিন স্থাপন আপাতত স্থগিত রাখা হয়েছে।'
          : 'কোনোটি নয়।',
        deferredEn: isLowBudget
          ? 'Automated foot-pedal plumbing washbasin deferred due to expenditure ceiling.'
          : 'None.',
        selectionReasonBn: 'সহজে তৈরি ও প্রতিদিনের ব্যবহারে কোনো বাড়তি ঝামেলা না থাকায় এটি প্রথম অগ্রাধিকার।',
        selectionReasonEn: 'Extremely high compliance yield relative to near-zero initial cost.',
      };

    case 'footwear_footbath':
      return {
        titleBn: 'প্রবেশদ্বারে জীবাণুনাশক ফুটবাথ ট্রে ও শেডের আলাদা জুতা চালু করা',
        titleEn: 'Establish Disinfectant Footbath Tray & Dedicated Shed-Only Boots',
        whyRecommendedBn: 'বাইরের জুতার তলায় লেগে থাকা কাদা ও বিষ্ঠা শেডের লিটারে সরাসরি সংক্রামক জীবাণু ঢুকিয়ে দেয়।',
        whyRecommendedEn: 'Footwear sole contamination is recognized globally as the primary mechanical vector of shed pathogen entry.',
        effort: 'low' as const,
        costCategory: 'low' as const,
        materialsBn: 'একটি শক্ত প্লাস্টিকের বড় গামলা বা অগভীর ট্রে, ব্লিচিং বা আয়োডিন জীবাণুনাশক, এক জোড়া রাবারের বুট জুতা।',
        materialsEn: 'Durable shallow plastic tub/tray, commercial disinfectant (iodophor/bleach), one pair of dedicated rubber boots.',
        stepsBn: [
          'শেডের দরজার বাইরে ফুটবাথ ট্রে রাখুন যাতে এটি এড়িয়ে ভেতরে ঢোকা অসম্ভব হয়।',
          'পানিতে নির্ধারিত মাত্রায় জীবাণুনাশক মেশান (প্রতি লিটারে ২-৩ গ্রাম ব্লিচিং বা নির্দেশিত মাত্রা)।',
          'রাস্তার জুতা খুলে বাইরে রাখুন এবং ট্রেতে পা ভিজিয়ে শেডের নির্দিষ্ট জুতা পরে প্রবেশ করুন।',
          'প্রতিদিন সকালে ফুটবাথের কাদাযুক্ত পানি ফেলে নতুন জীবাণুনাশক পানি দিন।',
        ],
        stepsEn: [
          'Place the tray across the entryway so bypassing it is physically impractical.',
          'Prepare disinfectant solution according to manufacturer label dilution ratios.',
          'Remove street shoes outside, step into the bath, and change into dedicated shed boots.',
          'Empty muddy sediment daily and recharge with fresh disinfectant every morning.',
        ],
        benefitBn: 'বাইরে থেকে শেডের ভেতর রোগ ছড়িয়ে পড়ার অন্যতম প্রধান রাস্তা তাৎক্ষণিক বন্ধ হয়।',
        benefitEn: 'Cuts mechanical transmission of spore-forming and viral agents via contaminated mud.',
        deferredBn: isLowBudget
          ? 'দরজায় স্থায়ী সিমেন্টের পাকা ফুটবাথ চৌবাচ্চা ও অটোমেটিক স্প্রেয়ার নির্মাণ আপাতত স্থগিত।'
          : 'কোনোটি নয়।',
        deferredEn: isLowBudget
          ? 'Poured-concrete walk-through dipping basin deferred until next batch expansion.'
          : 'None.',
        selectionReasonBn: 'প্লাস্টিক ট্রের স্বল্পমূল্য ও তাৎক্ষণিক সুরক্ষা দেওয়ার ক্ষমতার কারণে এটি নির্বাচিত।',
        selectionReasonEn: 'Rapid deployment using portable plastic basin yields immediate protective barrier.',
      };

    case 'dead_bird_disposal':
      return {
        titleBn: 'খামার থেকে দূরে নিরাপদ ৩-ফুট গভীর চুনযুক্ত নিষ্কাশন গর্ত তৈরি',
        titleEn: 'Excavate 3-Foot Deep Covered Mortality Pit with Quicklime Seal',
        whyRecommendedBn: 'মৃত পাখি খোলা স্থানে ফেললে শিয়াল, কাক ও কুকুর মাংস টেনে পুরো খামার প্রাঙ্গণে রোগ ছড়িয়ে ফেলে।',
        whyRecommendedEn: 'Scavengers tear open carcasses, spreading massive viral titres across local environment within hours.',
        effort: 'medium' as const,
        costCategory: isLowBudget ? ('free' as const) : ('low' as const),
        materialsBn: 'কোদাল বা শাবল, ২০ কেজি পাথুরে চুন (Quicklime), গর্ত ঢাকার জন্য একটি ভারী টিন বা কাঠের তক্তা।',
        materialsEn: 'Spade/shovel, 10-20 kg calcium hydroxide (quicklime), heavy timber or corrugated tin lid.',
        stepsBn: [
          'খামারের বাতাস চলাচলের বিপরীতে সীমানার কোণে অন্তত ৩ ফুট গভীর ও ২ ফুট চওড়া গর্ত খনন করুন।',
          'মৃত পাখি ফেলার পর প্রতি স্তরে অন্তত ২ মুঠো চুন ছড়িয়ে দিন।',
          'কুকুর বা শিয়াল যেন মাটি খুঁড়তে না পারে সেজন্য উপরে ভারী ঢাকনা বা মাটি চাপা দিন।',
        ],
        stepsEn: [
          'Dig a pit at least 3 feet deep in downwind boundary corner away from drinking water wells.',
          'Place mortality into the pit and cover immediately with two scoops of dry quicklime.',
          'Secure a heavy, tightly fitted lid weighted with rocks to block scavenger intrusion.',
        ],
        benefitBn: 'খামারের চারপাশের পরিবেশ মাছি ও মাংসভোজী প্রাণীর সংক্রমণ থেকে সম্পূর্ণ সুরক্ষিত থাকে।',
        benefitEn: 'Eliminates fly breeding grounds and neutralizes pathogen survival in soil.',
        deferredBn: 'দামী মেকানিক্যাল ইনসিনারেটর বা বাণিজ্যিক বায়ো-কম্পোস্টার স্থাপন স্থগিত রাখা হয়েছে।',
        deferredEn: 'High-cost diesel mortality incinerator or commercial bio-digester deferred.',
        selectionReasonBn: 'জিরো খরচে কোদাল ও চুন দিয়ে সর্বোচ্চ জীবাণু বিস্তার রোধ করা সম্ভব।',
        selectionReasonEn: 'Low equipment overhead with near-perfect epidemiological dead-end containment.',
      };

    case 'feed_water_protection':
      return {
        titleBn: 'খাদ্যের বস্তা মাচায় রাখা ও পানির পাইপলাইন ফ্লাশিং নিশ্চিত করা',
        titleEn: 'Elevate Feed Sacks on Wood Pallets & Flush Water Pipelines',
        whyRecommendedBn: 'মেঝের স্যাঁতসেঁতে আর্দ্রতায় খাদ্যে ছত্রাক ও বিষাক্ত আফলাটক্সিন তৈরি হয় যা মুরগির লিভার ধ্বংস করে।',
        whyRecommendedEn: 'Damp concrete draws moisture into feed bags, generating toxic fungal metabolites (aflatoxins).',
        effort: 'low' as const,
        costCategory: 'low' as const,
        materialsBn: 'কাঠের মাচা বা প্লাস্টিক প্যালেট (মেঝে থেকে ৬ ইঞ্চি উঁচু), পাইপ ফ্লাশিংয়ের জন্য ভিনেগার বা ক্লোরিন।',
        materialsEn: 'Wooden pallets (min 6 inches off ground), food-grade vinegar/bleach for line flushing.',
        stepsBn: [
          'খাদ্যের বস্তা কখনো সরাসরি সিমেন্টের মেঝের ওপর রাখবেন না।',
          'দেয়াল থেকে অন্তত ১ ফুট দূরে কাঠের প্যালেটের ওপর সুন্দরভাবে সাজিয়ে রাখুন।',
          'সপ্তাহে অন্তত একবার পাইপলাইনের শেষ প্রান্তের ক্যাপ খুলে দ্রুত পানি প্রবাহিত করে ময়লা বের করে দিন।',
        ],
        stepsEn: [
          'Never store feed sacks directly against concrete floor or damp exterior walls.',
          'Stack bags on pallets at least 1 foot away from perimeter walls to facilitate airflow.',
          'Open end-caps of nipple/bell drinker piping weekly to flush out sediment and bacterial biofilm.',
        ],
        benefitBn: 'মুরগির হজমশক্তি ভালো থাকে এবং ফিড বিষক্রিয়ায় মৃত্যু শূন্যের কোঠায় নেমে আসে।',
        benefitEn: 'Drastically cuts aflatoxicosis risk and prevents chronic enteritis in broiler batches.',
        deferredBn: 'সিলোকনটেইনার বা মেটাল ফিড সাইলো স্থাপন স্থগিত রাখা হয়েছে।',
        deferredEn: 'Automated hermetic feed storage silos deferred due to expenditure profile.',
        selectionReasonBn: 'কাঠের প্যালেটের সহজলভ্যতা এবং তাৎক্ষণিক খাদ্য অপচয় রোধ।',
        selectionReasonEn: 'Extreme return on investment by preventing costly feed spoilage.',
      };

    default:
      return {
        titleBn: 'খামারের প্রবেশ ও পরিষ্কার-পরিচ্ছন্নতার নিয়ম জোরদার করা',
        titleEn: 'Tighten General Farm Biosecurity Protocol & Cleaning Schedules',
        whyRecommendedBn: 'নিয়মিত জীবাণুনাশক স্প্রে ও পরিচ্ছন্নতা খামারে জীবাণু প্রবেশের পথ অবরুদ্ধ রাখে।',
        whyRecommendedEn: 'Regular sanitization schedules lower environmental baseline microbial pressure.',
        effort: 'medium' as const,
        costCategory: 'low' as const,
        materialsBn: 'স্প্রেয়ার মেশিন, অনুমোদিত জীবাণুনাশক, পরিষ্কারক ব্রাশ।',
        materialsEn: 'Knapsack sprayer, approved veterinary disinfectant, stiff scrub brushes.',
        stepsBn: [
          'শেডের চারপাশের ঝোপঝাড় ও ময়লা পরিষ্কার রাখুন।',
          'প্রতি ব্যাচ শুরুর আগে এবং শেষে পুরো শেড চুনকাম করুন।',
          'বাহিরের কোনো সরঞ্জাম জীবাণুমুক্ত না করে ভেতরে প্রবেশ করাবেন না।',
        ],
        stepsEn: [
          'Clear tall weeds and clutter within a 15-foot perimeter around all shed walls.',
          'Whitewash internal surfaces with lime between consecutive broiler batches.',
          'Sanitize all incoming crates or tools before crossing the clean-zone barrier.',
        ],
        benefitBn: 'ফ্লকের স্বাভাবিক গড় রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি পায়।',
        benefitEn: 'Maintains sustained bio-exclusion barriers against opportunistic farm pathogens.',
        deferredBn: 'সম্পূর্ণ স্বয়ংক্রিয় ভেহিকেল স্প্রে ব্যারিয়ার স্থাপন স্থগিত।',
        deferredEn: 'Automated vehicle drive-through disinfection archway deferred.',
        selectionReasonBn: 'সহজলভ্য জীবাণুনাশক স্প্রে দিয়ে দ্রুত ফলাফল পাওয়া যায়।',
        selectionReasonEn: 'Reliable broad-spectrum biosecurity enhancement with standard farm supplies.',
      };
  }
}
