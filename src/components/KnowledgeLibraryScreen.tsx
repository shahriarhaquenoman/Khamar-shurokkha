import React, { useState, useEffect } from 'react';
import { KnowledgeArticle, KnowledgeCategory, Language, NavScreen } from '../types';
import { KNOWLEDGE_ARTICLES } from '../data/knowledgeArticles';
import { KnowledgeIllustration } from './BiosecurityIllustrations';
import { ResilientImage } from './ui/ResilientImage';
import { getKnowledgeTopicImage } from '../lib/visualAssets';
import { toBanglaNum } from '../translations';
import {
  BookOpen,
  ShieldCheck,
  Syringe,
  AlertTriangle,
  Droplets,
  ThermometerSun,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  Package,
  Info,
  Smartphone,
} from 'lucide-react';
import {
  getKhamarPhoneShortLabel,
  getKhamarUssdShortLabel,
} from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';

interface KnowledgeLibraryScreenProps {
  lang: Language;
  initialTopicKey?: string | null;
  onClearInitialTopic?: () => void;
  onNavigate: (screen: NavScreen) => void;
}

const CATEGORIES: {
  id: 'all' | KnowledgeCategory;
  labelBn: string;
  labelEn: string;
  icon: React.ReactNode;
}[] = [
  { id: 'all', labelBn: 'সব নির্দেশিকা', labelEn: 'All Guides', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'daily_hygiene', labelBn: 'প্রতিদিনের পরিচ্ছন্নতা', labelEn: 'Daily Hygiene', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'vaccine_deworming', labelBn: 'টিকা ও কৃমিনাশক', labelEn: 'Vaccines & Deworming', icon: <Syringe className="w-4 h-4" /> },
  { id: 'quarantine', labelBn: 'নতুন ও অসুস্থ প্রাণী পৃথক রাখা', labelEn: 'Quarantine', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'feed_water', labelBn: 'নিরাপদ খাবার ও পানি', labelEn: 'Feed & Water', icon: <Droplets className="w-4 h-4" /> },
  { id: 'seasonal_care', labelBn: 'গরম, বর্ষা ও শীতের যত্ন', labelEn: 'Seasonal Care', icon: <ThermometerSun className="w-4 h-4" /> },
  { id: 'emergency_vet', labelBn: 'কখন ডাক্তারের সাহায্য নেবেন', labelEn: 'When to Call Vet', icon: <Stethoscope className="w-4 h-4" /> },
];

export const KnowledgeLibraryScreen: React.FC<KnowledgeLibraryScreenProps> = ({
  lang,
  initialTopicKey,
  onClearInitialTopic,
  onNavigate,
}) => {
  const isBn = lang === 'bn';
  const [selectedCategory, setSelectedCategory] = useState<'all' | KnowledgeCategory>('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    if (initialTopicKey) {
      const matched = KNOWLEDGE_ARTICLES.find(
        (a) => a.topicKey === initialTopicKey || a.id === initialTopicKey || a.category === initialTopicKey
      );
      if (matched) {
        setSelectedArticle(matched);
      }
      onClearInitialTopic?.();
    }
  }, [initialTopicKey, onClearInitialTopic]);

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  if (selectedArticle) {
    return (
      <div className="space-y-5 pb-12 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedArticle(null)}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'সব নির্দেশিকায় ফিরে যান' : 'Back to All Guides'}</span>
        </button>

        <article className="bg-white rounded-3xl border border-indigo-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 bg-indigo-50/70 border-b border-indigo-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl overflow-hidden border border-indigo-200 bg-white h-44">
                <ResilientImage
                  src={getKnowledgeTopicImage(selectedArticle.category).src}
                  alt={isBn ? selectedArticle.titleBn : selectedArticle.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <KnowledgeIllustration
                  illustrationKey={selectedArticle.illustrationKey}
                  className="w-full h-44 rounded-2xl border border-indigo-200 bg-white"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {isBn ? selectedArticle.titleBn : selectedArticle.titleEn}
            </h1>
            <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
              {isBn ? selectedArticle.summaryBn : selectedArticle.summaryEn}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{isBn ? selectedArticle.reviewStatusBn : selectedArticle.reviewStatusEn}</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h2 className="text-sm font-extrabold text-indigo-900 mb-1.5">
                {isBn ? 'কেন এটি খামারের জন্য জরুরি?' : 'Why Is This Important for Your Farm?'}
              </h2>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {isBn ? selectedArticle.whyImportantBn : selectedArticle.whyImportantEn}
              </p>
            </section>

            {selectedArticle.materialsBn && (
              <section className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Package className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-extrabold text-amber-950">
                    {isBn ? 'কী কী লাগবে?' : 'What You Need'}
                  </h2>
                  <p className="text-sm text-amber-900 font-medium mt-1">
                    {isBn ? selectedArticle.materialsBn : selectedArticle.materialsEn}
                  </p>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-base font-extrabold text-slate-900 mb-3">
                {isBn ? 'সহজ ধাপে করণীয়' : 'Simple Step-by-Step Guide'}
              </h2>
              <div className="space-y-3">
                {(isBn ? selectedArticle.stepsBn : selectedArticle.stepsEn).map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100"
                  >
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums">
                      {toBanglaNum(idx + 1, lang)}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {selectedArticle.warningBn && (
              <section className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-rose-900 leading-relaxed">
                  {isBn ? selectedArticle.warningBn : selectedArticle.warningEn}
                </p>
              </section>
            )}

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('health_support')}
                className="min-h-[48px] px-5 py-3 bg-[#166534] hover:bg-emerald-900 text-white rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{isBn ? 'প্রয়োজনে ডাক্তার বা খামার বন্ধুর সাহায্য নিন' : 'Get Vet or Khamar Bondhu Help'}</span>
              </button>
              <KhamarContactCallAction
                lang={lang}
                labelBn={`খামার সুরক্ষা কল: ${getKhamarPhoneShortLabel(lang)}`}
                labelEn={`Khamar Shurokkha Contact: ${getKhamarPhoneShortLabel(lang)}`}
                className="min-h-[48px] px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => onNavigate('ussd_simulator')}
                className="min-h-[48px] px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-sm font-extrabold flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-blue-700" />
                <span>
                  {isBn
                    ? `অফলাইন USSD কোড (${getKhamarUssdShortLabel()})`
                    : `Offline USSD (${getKhamarUssdShortLabel()})`}
                </span>
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl border border-indigo-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-indigo-600 shrink-0" />
              <span>{isBn ? 'শিখি — সহজ খামার জ্ঞানভান্ডার' : 'Learn — Practical Farm Guide'}</span>
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {isBn
                ? 'ছবি ও সহজ ভাষায় খামার পরিচ্ছন্নতা, টিকা, কোয়ারেন্টাইন, খাবার-পানি ও জরুরি করণীয় শিখুন।'
                : 'Simple illustrated guides on farm hygiene, vaccination, quarantine, clean water, and emergency care.'}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-xl self-start">
            {isBn
              ? 'প্রাথমিক নির্দেশিকা — আনুষ্ঠানিক DLS/ভেট রিভিউয়ের জন্য প্রস্তুত'
              : 'Educational Draft — Ready for Official DLS/Vet Review'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                }`}
              >
                {cat.icon}
                <span>{isBn ? cat.labelBn : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-36 rounded-2xl mb-4 border border-indigo-100 overflow-hidden bg-indigo-50/40">
                <ResilientImage
                  src={getKnowledgeTopicImage(article.category).src}
                  alt={isBn ? article.titleBn : article.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                {isBn ? article.titleBn : article.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {isBn ? article.summaryBn : article.summaryEn}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{toBanglaNum(article.stepsBn.length, lang)} {isBn ? 'টি সহজ ধাপ' : 'simple steps'}</span>
              </span>
              <button
                onClick={() => setSelectedArticle(article)}
                className="min-h-[44px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer"
              >
                {isBn ? 'বিস্তারিত পড়ুন' : 'Read Guide'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
