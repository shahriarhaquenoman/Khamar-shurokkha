import React from 'react';
import {
  Calendar,
  Shield,
  Activity,
  Radio,
  FileCheck2,
  AlertTriangle,
  Phone,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { Language } from '../types';

interface RoadmapScreenProps {
  lang: Language;
}

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ lang }) => {
  const isBn = lang === 'bn';

  const phases = [
    {
      phaseNumber: '১',
      phaseEn: 'PHASE 1 — DIGITAL FARM FOUNDATION',
      phaseBn: 'পর্যায় ১ — ডিজিটাল খামার ভিত্তি (সম্পন্ন এমভিপি)',
      badgeBn: 'বর্তমান পর্যায় (লাইভ এমভিপি)',
      badgeEn: 'Current Phase (Live MVP)',
      isCurrent: true,
      icon: Shield,
      titleBn: 'খামার পরিচয়, অ্যানিম্যাল আইডি ও সমন্বিত ড্যাশবোর্ড',
      titleEn: 'Digital Farm ID, Multi-Species Animal ID & Records',
      itemsBn: [
        'খামারি নিবন্ধন ও স্বতন্ত্র ফার্ম আইডি (Farm ID: KS-FARM-0001)',
        'গরু, মহিষ, ছাগল ও ভেড়ার একক অ্যানিম্যাল আইডি (Animal ID: KS-CAT-0001)',
        'পোল্ট্রি ব্যাচভিত্তিক ফ্লক আইডি (Flock ID: KS-FLK-0001)',
        'ডিজিটাল কিউআর কোডসহ প্রিন্টযোগ্য পরিচয়পত্র (ID Cards)',
        'আজকের কাজের সহজ ড্যাশবোর্ড ("আজ আমার খামারের কী কী কাজ আছে?")',
      ],
      itemsEn: [
        'Farmer registration & systematic Farm ID (KS-FARM-0001)',
        'Individual Animal ID for cattle, buffalo, goat & sheep',
        'Batch Flock ID for commercial poultry (Broiler, Layer, Duck)',
        'Printable Digital ID Cards with QR code verification',
        'Intuitive farmer dashboard answering "What should I do today?"',
      ],
    },
    {
      phaseNumber: '২',
      phaseEn: 'PHASE 2 — PREVENTIVE ANIMAL HEALTH',
      phaseBn: 'পর্যায় ২ — প্রতিরোধমূলক প্রাণিস্বাস্থ্য ও প্রটোকল',
      badgeBn: 'বর্তমান পর্যায় (সক্রিয়)',
      badgeEn: 'Active Prototype Feature',
      isCurrent: true,
      icon: Activity,
      titleBn: 'বিশেষজ্ঞ-অনুমোদিত টিকাদান ও কৃমিনাশক ক্যালেন্ডার',
      titleEn: 'Expert-Reviewed Vaccination & Deworming Calendar',
      itemsBn: [
        'প্রাণিসম্পদ অধিদপ্তর (DLS) অনুমোদিত প্রজাতিভিত্তিক টিকা প্রটোকল',
        'ঝুঁকি ও বয়স অনুযায়ী কৃমিনাশক পর্যালোচনা ও রেকর্ড ব্যবস্থাপনা',
        'মাসিক ও সাপ্তাহিক ভিজ্যুয়াল কেয়ার ক্যালেন্ডার ও এজেন্ডা তালিকা',
        'সময়োত্তীর্ণ, আজ করণীয় ও আসন্ন কাজের স্বয়ংক্রিয় রিমাইন্ডার ইঞ্জিন',
      ],
      itemsEn: [
        'DLS & LRI authorized species-specific vaccination protocols',
        'Risk-stratified deworming review & lifetime health logging',
        'Visual monthly calendar and weekly prioritized agenda',
        'Dynamic task classification: Overdue, Due Soon, and Upcoming',
      ],
    },
    {
      phaseNumber: '৩',
      phaseEn: 'PHASE 3 — DIGITAL GUIDANCE & VET SUPPORT',
      phaseBn: 'পর্যায় ৩ — ডিজিটাল এআই গাইডেন্স ও ভেটেরিনারি সেবা',
      badgeBn: 'পরবর্তী পর্যায়',
      badgeEn: 'Next Phase (Near-Term)',
      isCurrent: false,
      icon: Sparkles,
      titleBn: 'AI স্বাস্থ্য সহায়ক ও সরাসরি ভেটেরিনারি টেলি-পরামর্শ',
      titleEn: 'AI Guidance Assistant & Tele-Veterinary Consultations',
      itemsBn: [
        'দায়িত্বশীল সীমার মধ্যে AI স্বাস্থ্য সহায়ক (নো ড্রাগ প্রেসক্রিপশন)',
        'প্রাণীর প্রোফাইলভিত্তিক প্রেক্ষাপট-সচেতন পরামর্শ ও প্রশ্ন সমাধান',
        'উপজেলা ভেটেরিনারি সার্জনদের সাথে সরাসরি কনসালটেশন অনুরোধ বুকিং',
        'জরুরি বিপজ্জনক লক্ষণ চিহ্নিতকরণ ও তাৎক্ষণিক হাসপাতাল রেফারেল',
      ],
      itemsEn: [
        'Safe, bounded AI assistant avoiding drug prescriptions',
        'Context-aware animal queries pulling active profile health data',
        'Direct consultation request workflow to Upazila veterinary surgeons',
        'Emergency symptom escalation triage with direct helpline guidance',
      ],
    },
    {
      phaseNumber: '৪',
      phaseEn: 'PHASE 4 — CONNECTED FARM PROTECTION',
      phaseBn: 'পর্যায় ৪ — সংযুক্ত সুরক্ষা ও আঞ্চলিক সতর্কবার্তা',
      badgeBn: 'পরবর্তী ৬-১২ মাস',
      badgeEn: '6-12 Months Roadmap',
      isCurrent: false,
      icon: Radio,
      titleBn: 'সিনড্রোমিক নজরদারি, আবহাওয়া ব্যবস্থাপনা ও আর্লি-ওয়ার্নিং',
      titleEn: 'Syndromic Early Warning & Weather Protection',
      itemsBn: [
        'উপজেলা প্রাণিসম্পদ অধিদপ্তরের রোগ সতর্কতা সরাসরি প্রকাশ',
        'খামারিদের জমা দেওয়া স্বাস্থ্য সমস্যা থেকে প্রাথমিক ক্লাস্টার নজরদারি',
        'তাপমাত্রা, আর্দ্রতা ও হিট-স্ট্রেস সূচকভিত্তিক খামার পরিচর্যা টিপস',
        'বায়োসিকিউরিটি ১০-ডোমেন অডিট ও সাপ্তাহিক অ্যাকশন ট্র্যাকার',
      ],
      itemsEn: [
        'Official DLS disease advisories localized to Upazila level',
        'Community symptom aggregation for responsible early outbreak tracking',
        'Micro-climate & heat stress mitigation advisory for barn ventilation',
        '10-domain biosecurity assessment and weekly corrective actions',
      ],
    },
    {
      phaseNumber: '৫',
      phaseEn: 'PHASE 5 — INCLUSIVE DIGITAL ACCESS',
      phaseBn: 'পর্যায় ৫ — সার্বজনীন এক্সেস ও বেসিক ফোন নেটওয়ার্ক',
      badgeBn: 'দীর্ঘমেয়াদী লক্ষ্য',
      badgeEn: 'Long-Term Scale',
      isCurrent: false,
      icon: Phone,
      titleBn: 'টেলিকম USSD ডায়াল সার্ভিস, SMS ও অফলাইন ক্যাশিং',
      titleEn: 'Telecom USSD (*XXX#), SMS & Offline-First Access',
      itemsBn: [
        'যেকোনো বাটন ফোনে *XXX# ডায়াল করে আজকের কাজের তালিকা প্রদর্শন',
        'ইন্টারনেট সংযোগ ছাড়াই এসএমএস ও ভয়েস কল রিমাইন্ডার বার্তা',
        'লো-ব্যান্ডউইথ স্মার্টফোনে সম্পূর্ণ অফলাইন ডাটা এন্ট্রি ও ড্রাফটিং',
        'ওয়ান হেলথ কাঠামোর অধীনে এএমআর (অ্যান্টিবায়োটিক প্রতিরোধ) হ্রাস প্রত্যয়ন',
      ],
      itemsEn: [
        'Live telecom USSD (*XXX#) menu for low-cost 2G feature phones',
        'Automated SMS & voice call reminders without mobile data required',
        'Offline-first client caching for intermittent rural connectivity',
        'One Health antimicrobial stewardship & bio-defense certification',
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isBn ? 'স্ট্র্যাটেজিক রোডম্যাপ' : 'Strategic Product Roadmap'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {isBn ? 'খামার সুরক্ষা — ভবিষ্যৎ পর্যায়ক্রমিক রূপরেখা' : 'Khamar Shurokkha 5-Phase Roadmap'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          {isBn
            ? 'প্রতিযোগিতা ও উদ্ভাবন প্রোটোটাইপ থেকে বাংলাদেশের ক্ষুদ্র খামারিদের জন্য জাতীয় ওয়ান হেলথ প্রাণিসম্পদ সুরক্ষা প্ল্যাটফর্মে রূপান্তরের দায়িত্বশীল পরিকল্পনা।'
            : 'A staged roadmap scaling from academic advisor prototype to a nationwide One Health digital livestock management infrastructure in Bangladesh.'}
        </p>
      </div>

      {/* Explicit Boundary Disclaimers Banner */}
      <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300/80 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-amber-950">
            <h3 className="font-bold text-amber-900 text-base">
              {isBn
                ? 'দায়িত্বশীল প্রযুক্তি উদ্ভাবন — প্রোটোটাইপের বাস্তব সীমাবদ্ধতা'
                : 'Responsible Innovation — Prototype Boundaries & Disclaimers'}
            </h3>
            <p className="leading-relaxed text-xs sm:text-sm">
              {isBn
                ? 'বিশ্ববিদ্যালয় শিক্ষক, বিশেষজ্ঞ ও প্রতিযোগিতা বিচারকদের অবগতির জন্য স্পষ্টভাবে জানানো যাচ্ছে যে, খামার সুরক্ষা বর্তমানে সিমুলেটেড ডেটায় পরিচালিত একটি প্রোটোটাইপ। নিম্নলিখিত বিষয়গুলো এখনো লাইভ সরকারি সিস্টেমে যুক্ত হয়নি:'
                : 'For transparency with academic advisors and judges, Khamar Shurokkha explicitly discloses prototype operational boundaries:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
                <span className="font-bold block text-slate-900 mb-1">
                  {isBn ? '❌ লাইভ DLS সরকারি লিংক নেই' : '❌ No Live DLS Database'}
                </span>
                <span className="text-slate-600">
                  {isBn
                    ? 'সরকারি প্রাণিসম্পদ অধিদপ্তরের সার্ভারের সাথে সরাসরি সংযোগ নেই; এটি প্রোটোটাইপ সিমুলেশন।'
                    : 'The app is not yet piped into Ministry of Fisheries & Livestock servers.'}
                </span>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
                <span className="font-bold block text-slate-900 mb-1">
                  {isBn ? '❌ সার্বক্ষণিক ডাক্তার বা কলসেন্টার নেই' : '❌ No Real 24/7 Call Center'}
                </span>
                <span className="text-slate-600">
                  {isBn
                    ? 'অ্যাপে প্রদর্শিত হেল্পলাইনটি ডেমো সিমুলেশন। প্রকৃত জরুরি অবস্থায় স্থানীয় হাসপাতালে যান।'
                    : 'Hotline numbers are mock demonstrators; no live doctor call-center active.'}
                </span>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-amber-200">
                <span className="font-bold block text-slate-900 mb-1">
                  {isBn ? '❌ কোনো উন্মুক্ত পাবলিক ইনফেকশন ম্যাপ নেই' : '❌ No Public Outbreak Maps'}
                </span>
                <span className="text-slate-600">
                  {isBn
                    ? 'জনসাধারণের মধ্যে অযথা আতঙ্ক বা খামারির অর্থনৈতিক ক্ষতি এড়াতে উন্মুক্ত মানচিত্র বন্ধ রাখা হয়েছে।'
                    : 'Geospatial disease heatmaps are excluded to prevent farm stigmatization.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Phase Cards */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.phaseNumber}
              className={`rounded-3xl border p-6 transition-all ${
                phase.isCurrent
                  ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 shadow-xs opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      phase.isCurrent
                        ? 'bg-emerald-800 text-white shadow'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      {isBn ? phase.phaseBn : phase.phaseEn}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {isBn ? phase.titleBn : phase.titleEn}
                    </h3>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 w-fit ${
                    phase.isCurrent
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {phase.isCurrent && <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                  {isBn ? phase.badgeBn : phase.badgeEn}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(isBn ? phase.itemsBn : phase.itemsEn).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        phase.isCurrent ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* One Health Alignment Note */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-base text-white">
            {isBn ? 'ওয়ান হেলথ (One Health) নীতির সাথে সম্পূর্ণ সংগতিপূর্ণ' : 'Aligned with One Health Strategic Goals'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isBn
              ? 'গবাদিপশুর স্বাস্থ্য সুরক্ষা ও যথাসময়ে টিকাদান নিশ্চিত করার মাধ্যমে অপ্রয়োজনীয় অ্যান্টিবায়োটিক ব্যবহার হ্রাস পায়, যা অ্যান্টিমাইক্রোবিয়াল রেজিস্ট্যান্স (AMR) প্রতিরোধে সরাসরি ভূমিকা রাখে এবং মানব স্বাস্থ্য ও পরিবেশ রক্ষা করে।'
              : 'Timely vaccination and biosecurity prevent disease outbreaks, reducing indiscriminate antibiotic reliance, curbing AMR risks, and protecting human and animal health.'}
          </p>
        </div>
      </div>
    </div>
  );
};
