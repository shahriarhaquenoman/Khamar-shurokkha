import { Language } from '../types';

export const translations = {
  bn: {
    // Brand
    brandName: 'খামার সুরক্ষা',
    brandTagline: 'আপনার খামার, প্রতিদিনের যত্ন।',
    brandEnglishName: 'Khamar Shurokkha',
    brandEnglishTagline: 'Your Farm. Everyday Care.',
    demoModeNotice: 'অ্যাডভাইজর ডেমো — সিমুলেটেড নমুনা তথ্য',

    // Roles
    roleFarmer: 'খামারি / কৃষক',
    roleVetPro: 'ভেটেরিনারি কর্মকর্তা',
    roleAdmin: 'প্ল্যাটফর্ম অ্যাডমিন',
    roleAdvisor: 'উপদেষ্টা / বিচারক মোড',

    // Navigation
    navDashboard: 'আজকের করণীয়',
    navAnimals: 'আমার খামার',
    navCalendar: 'টিকা ও যত্ন ক্যালেন্ডার',
    navHealthSupport: 'স্বাস্থ্য সহায়তা',
    navAIAssistant: 'খামার বন্ধু (সহায়িকা)',
    navVetServices: 'পশুচিকিৎসা সেবা',
    navBiosecurity: 'BioShield সুরক্ষা',
    navRegionalAlerts: 'সতর্কতা ও তথ্য',
    navKnowledge: 'শিখি (জ্ঞানভান্ডার)',
    navUSSD: 'USSD সেবা (*XXX#)',
    navGovernance: 'প্রটোকল গভর্ন্যান্স',
    navRoadmap: 'রোডম্যাপ',
    navSettings: 'সেটিংস ও এসএমএস',

    // Common Buttons & Labels
    addAnimalBtn: 'প্রাণী যোগ করুন',
    addFlockBtn: 'পোল্ট্রি ফ্লক যোগ করুন',
    recordVaccineBtn: 'টিকা রেকর্ড করুন',
    recordDewormBtn: 'কৃমিনাশক রেকর্ড করুন',
    askAIBtn: 'AI সহায়তা নিন',
    requestVetBtn: 'ভেটেরিনারি সেবা নিন',
    reportProblemBtn: 'স্বাস্থ্য সমস্যা জানান',
    viewAllBtn: 'সব দেখুন',
    saveBtn: 'সংরক্ষণ করুন',
    cancelBtn: 'বাতিল',
    closeBtn: 'বন্ধ করুন',
    searchPlaceholder: 'নাম, ট্যাগ বা আইডি দিয়ে খুঁজুন...',
    allSpecies: 'সকল প্রজাতি',
    launchDemoBtn: 'অ্যাডভাইজর ডেমো চালু করুন',
    resetDemoBtn: 'ডেমো রিসেট করুন',
    farmIdLabel: 'খামার আইডি',
    animalIdLabel: 'প্রাণী আইডি',
    flockIdLabel: 'ফ্লক আইডি',

    // Dashboard
    todayTasksTitle: 'আজ আমার খামারের কী কী কাজ আছে?',
    todayTasksSubtitle: 'আজকের নির্ধারিত টিকাদান, কৃমিনাশক পর্যালোচনা ও স্বাস্থ্য করণীয়',
    noTasksToday: 'আজ কোনো জরুরি কাজ বাকি নেই। আপনার খামারের সকল যত্ন আপ-টু-ডেট আছে!',
    myAnimalsTitle: 'আমার প্রাণী ও পোল্ট্রি সংখ্যা',
    totalLivestock: 'মোট গবাদিপশু',
    totalPoultry: 'মোট পোল্ট্রি পাখি',
    quickActionsTitle: 'দ্রুত করণীয় কার্যক্রম',
    weatherAlertTitle: 'আবহাওয়া ও খামার ব্যবস্থাপনা নির্দেশিকা',
    recentAlertsTitle: 'নিকটবর্তী এলাকার প্রাণিস্বাস্থ্য আপডেট',

    // Species
    cattle: 'গরু (Cattle)',
    buffalo: 'মহিষ (Buffalo)',
    goat: 'ছাগল (Goat)',
    sheep: 'ভেড়া (Sheep)',
    chicken_broiler: 'ব্রয়লার মুরগি (Broiler)',
    chicken_layer: 'লেয়ার মুরগি (Layer)',
    chicken_sonali: 'সোনালী মুরগি (Sonali)',
    duck: 'হাঁস (Duck)',

    // Task & Health Statuses
    statusUpcoming: 'আসন্ন',
    statusDueSoon: 'আজ/শীঘ্রই করণীয়',
    statusOverdue: 'সময়োত্তীর্ণ (জরুরি)',
    statusCompleted: 'সম্পন্ন হয়েছে',
    statusHelpNeeded: 'সহায়তা প্রয়োজন',
    statusNotApplicable: 'খামারে প্রযোজ্য নয়',
    statusHealthy: 'সুস্থ ও নিরোগ',
    statusNeedsAttention: 'নজরদারি প্রয়োজন',
    statusSick: 'অসুস্থ / চিকিৎসাধীন',

    // BioShield 4-Stage Farmer Action Loop
    loopStep1: 'খুঁজে দেখি',
    loopStep1Sub: 'খামারে কোথায় সমস্যা বা ঘাটতি আছে?',
    loopStep2: 'আগে কোনটি?',
    loopStep2Sub: 'কোন কাজটি আগে করা জরুরি?',
    loopStep3: 'কাজ ঠিক করি',
    loopStep3Sub: 'কে কাজটি করবেন?',
    loopStep4: 'কাজ করি ও জানাই',
    loopStep4Sub: 'কাজটি করেছেন? নাকি সাহায্য প্রয়োজন?',

    // Biosecurity & Actions
    startActionBtn: 'কাজটি শুরু করুন',
    markCompletedBtn: 'কাজটি সম্পন্ন করেছি',
    needHelpBtn: 'সহায়তা প্রয়োজন',
    unableBtn: 'এখন করতে পারছি না',
    notApplicableBtn: 'আমার খামারে প্রযোজ্য নয়',
    viewDetailsBtn: 'বিস্তারিত দেখুন',
    learnMoreBtn: 'আরও জানুন',
    explainLogicBtn: 'যুক্তি ব্যাখ্যা দেখুন',
    goodPractices: 'ভালো অভ্যাস',
    partialPractices: 'উন্নতি প্রয়োজন',
    missingPractices: 'ঘাটতি / নেই',
    responseGood: 'ভালোভাবে বজায় রাখা হয়েছে',
    responseGoodSub: 'নিয়ম যথাযথভাবে পালিত হচ্ছে',
    responsePartial: 'আংশিকভাবে বজায় রাখা হয়েছে',
    responsePartialSub: 'কিছু ঘাটতি আছে, আরও মানোন্নয়ন দরকার',
    responseMissing: 'বজায় রাখা হয়নি',
    responseMissingSub: 'বর্তমানে এই অভ্যাস বা ব্যবস্থা নেই',
    prevBtn: 'পূর্ববর্তী',
    nextBtn: 'পরবর্তী',
    finishBtn: 'পরীক্ষা সমাপ্ত করুন',
    continueAuditBtn: 'পরীক্ষা চালিয়ে যান',

    // Disclaimer
    scientificDisclaimer: 'খামার সুরক্ষা প্ল্যাটফর্মটি খামার ব্যবস্থাপনা ও প্রতিরোধমূলক স্বাস্থ্য সচেতনতার একটি সহায়ক ডিজিটাল সিস্টেম। এটি স্বয়ংক্রিয় রোগ নির্ণয় বা অ্যান্টিবায়োটিক চিকিৎসা প্রদান করে না। গুরুতর অসুস্থতায় অবিলম্বে নিবন্ধিত পশুচিকিৎসক অথবা খামার সুরক্ষার পশুস্বাস্থ্য সহায়তা কেন্দ্রে যোগাযোগ করুন।',
  },
  en: {
    // Brand
    brandName: 'Khamar Shurokkha',
    brandTagline: 'Your Farm. Everyday Care.',
    brandEnglishName: 'Khamar Shurokkha',
    brandEnglishTagline: 'Your Farm. Everyday Care.',
    demoModeNotice: 'Advisor Demo — Simulated Academic Dataset',

    // Roles
    roleFarmer: 'Farmer View',
    roleVetPro: 'Veterinary Professional',
    roleAdmin: 'Platform Admin',
    roleAdvisor: 'Advisor & Judge Review',

    // Navigation
    navDashboard: 'Today\'s Plan',
    navAnimals: 'My Farm',
    navCalendar: 'Care Calendar',
    navHealthSupport: 'Health Support',
    navAIAssistant: 'Khamar Bondhu',
    navVetServices: 'Veterinary Care',
    navBiosecurity: 'BioShield Care',
    navRegionalAlerts: 'Alerts & Info',
    navKnowledge: 'Learn (Library)',
    navUSSD: 'USSD Simulator (*XXX#)',
    navGovernance: 'Protocol Governance',
    navRoadmap: 'Strategic Roadmap',
    navSettings: 'Settings & SMS',

    // Common Buttons & Labels
    addAnimalBtn: 'Register Animal',
    addFlockBtn: 'Register Poultry Flock',
    recordVaccineBtn: 'Record Vaccine',
    recordDewormBtn: 'Record Deworming',
    askAIBtn: 'Ask AI Assistant',
    requestVetBtn: 'Veterinary Support',
    reportProblemBtn: 'Report Health Event',
    viewAllBtn: 'View All',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    closeBtn: 'Close',
    searchPlaceholder: 'Search by ID, name, or tag...',
    allSpecies: 'All Species',
    launchDemoBtn: 'Load Advisor Demo',
    resetDemoBtn: 'Reset Demo Data',
    farmIdLabel: 'Farm ID',
    animalIdLabel: 'Animal ID',
    flockIdLabel: 'Flock ID',

    // Dashboard
    todayTasksTitle: 'What Should I Do for My Farm Today?',
    todayTasksSubtitle: 'Today\'s scheduled vaccinations, deworming reviews, and preventive tasks',
    noTasksToday: 'No overdue or pending tasks for today. Your farm preventive records are up to date!',
    myAnimalsTitle: 'My Animals & Poultry Inventory',
    totalLivestock: 'Total Livestock',
    totalPoultry: 'Total Birds',
    quickActionsTitle: 'Quick Actions',
    weatherAlertTitle: 'Weather & Seasonal Farm Guidance',
    recentAlertsTitle: 'Nearby Regional Animal Health Updates',

    // Species
    cattle: 'Cattle',
    buffalo: 'Buffalo',
    goat: 'Goat',
    sheep: 'Sheep',
    chicken_broiler: 'Broiler Chicken',
    chicken_layer: 'Layer Chicken',
    chicken_sonali: 'Sonali Chicken',
    duck: 'Duck',

    // Task & Health Statuses
    statusUpcoming: 'Upcoming',
    statusDueSoon: 'Due Soon',
    statusOverdue: 'Overdue (Urgent)',
    statusCompleted: 'Completed',
    statusHelpNeeded: 'Help Needed',
    statusNotApplicable: 'Not Applicable',
    statusHealthy: 'Healthy',
    statusNeedsAttention: 'Needs Attention',
    statusSick: 'Sick / In Treatment',

    // BioShield 4-Stage Farmer Action Loop
    loopStep1: 'Identify',
    loopStep1Sub: 'Where are the gaps on the farm?',
    loopStep2: 'Prioritize',
    loopStep2Sub: 'Which task should come first?',
    loopStep3: 'Assign',
    loopStep3Sub: 'Who will do this task?',
    loopStep4: 'Act & Feedback',
    loopStep4Sub: 'Done, or do you need help?',

    // Biosecurity & Actions
    startActionBtn: 'Start This Task',
    markCompletedBtn: 'Completed This Task',
    needHelpBtn: 'Need Help',
    unableBtn: 'Cannot Do Right Now',
    notApplicableBtn: 'Not Applicable to My Farm',
    viewDetailsBtn: 'View Details',
    learnMoreBtn: 'Learn More',
    explainLogicBtn: 'Explain System Logic',
    goodPractices: 'Good Practices',
    partialPractices: 'Needs Improvement',
    missingPractices: 'Missing / Deficit',
    responseGood: 'Maintained Well',
    responseGoodSub: 'Standard practice is observed',
    responsePartial: 'Partially Maintained',
    responsePartialSub: 'Some deficits need improvement',
    responseMissing: 'Not Maintained',
    responseMissingSub: 'Currently missing or absent',
    prevBtn: 'Previous',
    nextBtn: 'Next',
    finishBtn: 'Complete Check',
    continueAuditBtn: 'Continue Check',

    // Disclaimer
    scientificDisclaimer: 'Khamar Shurokkha is a digital preventive farm management platform. It does not provide autonomous clinical diagnosis or drug prescriptions. For sick animals, consult a registered veterinarian or contact Khamar Shurokkha health support.',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  const dictionary = translations[lang] || translations['bn'];
  return dictionary[key] || translations['bn'][key] || key;
}

export function toBanglaNum(num: number | string, lang: Language = 'bn'): string {
  if (lang !== 'bn') return String(num);
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
}
