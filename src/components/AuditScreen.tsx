import React, { useState, useMemo } from 'react';
import { BiosecurityDomain, AuditResponse, AuditItemAnswer, Language, FarmProfile } from '../types';
import { BIOSECURITY_DOMAINS, isDomainApplicableToFarm, getLocalizedDomainContent } from '../data/biosecurityQuestions';
import { t, toBanglaNum } from '../translations';
import { TopicIllustration } from './BiosecurityIllustrations';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  FileCheck2,
} from 'lucide-react';

interface AuditScreenProps {
  farm?: FarmProfile;
  answers: Record<string, AuditItemAnswer>;
  onAnswer: (domainId: string, response: AuditResponse) => void;
  onCompleteAudit: () => void;
  lang: Language;
}

export const AuditScreen: React.FC<AuditScreenProps> = ({
  farm,
  answers,
  onAnswer,
  onCompleteAudit,
  lang,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewSummary, setShowReviewSummary] = useState(false);

  const applicableDomains = useMemo(
    () => BIOSECURITY_DOMAINS.filter((d) => isDomainApplicableToFarm(d, farm)),
    [farm]
  );

  const safeIndex = Math.min(currentIndex, Math.max(0, applicableDomains.length - 1));
  const currentDomain = applicableDomains[safeIndex] || BIOSECURITY_DOMAINS[0];
  const localizedDomain = getLocalizedDomainContent(currentDomain, farm);
  const currentAnswer = answers[currentDomain.id]?.response;

  const totalQuestions = applicableDomains.length;
  const answeredCount = applicableDomains.filter((d) => Boolean(answers[d.id])).length;
  const progressPercent = Math.round((answeredCount / Math.max(1, totalQuestions)) * 100);

  const goodCount = Object.values(answers).filter((a) => a.response === 'good').length;
  const partialCount = Object.values(answers).filter((a) => a.response === 'partial').length;
  const missingCount = Object.values(answers).filter((a) => a.response === 'missing').length;

  const handleSelect = (response: AuditResponse) => {
    onAnswer(currentDomain.id, response);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowReviewSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Top Status & Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900">
                {lang === 'bn' ? 'খামারের জীব-নিরাপত্তা পরীক্ষা (খুঁজে দেখি)' : 'Farm Biosecurity Check (Identify)'}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'bn'
                ? 'খামারের প্রযোজ্য পয়েন্টগুলো পরীক্ষা করে আজকের অগ্রাধিকারমূলক কাজের তালিকা তৈরি করুন'
                : 'Check applicable farm biosecurity points to build your action list'}
            </p>
          </div>

          <button
            onClick={() => setShowReviewSummary(!showReviewSummary)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 min-h-[38px] flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সারসংক্ষেপ' : 'Summary'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              {lang === 'bn' ? 'প্রশ্ন' : 'Question'}: {toBanglaNum(currentIndex + 1, lang)} / {toBanglaNum(totalQuestions, lang)}
            </span>
            <span className="text-emerald-800">
              {toBanglaNum(progressPercent, lang)}% {lang === 'bn' ? 'সম্পন্ন' : 'Completed'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Review Summary Modal View */}
      {showReviewSummary ? (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'bn' ? 'পরীক্ষার উত্তর সারসংক্ষেপ ও চূড়ান্তকরণ' : 'Audit Review & Finalization'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'bn'
                  ? 'সবগুলো উত্তর পর্যালোচনা করে "পরীক্ষা সম্পন্ন করুন" বোতাম চাপুন'
                  : 'Review responses before submitting to generate your weekly action plan'}
              </p>
            </div>
            <button
              onClick={() => setShowReviewSummary(false)}
              className="text-xs text-emerald-800 font-bold underline"
            >
              {lang === 'bn' ? 'প্রশ্নে ফিরে যান' : 'Back to questions'}
            </button>
          </div>

          {/* Counts overview */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 block">{t(lang, 'goodPractices')}</span>
              <span className="text-xl font-bold text-emerald-950">{toBanglaNum(goodCount, lang)}</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-900 block">{t(lang, 'partialPractices')}</span>
              <span className="text-xl font-bold text-amber-950">{toBanglaNum(partialCount, lang)}</span>
            </div>
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
              <span className="text-xs font-bold text-rose-900 block">{t(lang, 'missingPractices')}</span>
              <span className="text-xl font-bold text-rose-950">{toBanglaNum(missingCount, lang)}</span>
            </div>
          </div>

          {/* List of applicable items */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {applicableDomains.map((domain, idx) => {
              const res = answers[domain.id]?.response;
              const loc = getLocalizedDomainContent(domain, farm);
              return (
                <div
                  key={domain.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowReviewSummary(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">
                    {toBanglaNum(idx + 1, lang)}. {lang === 'bn' ? loc.titleBn : loc.titleEn}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    res === 'good'
                      ? 'bg-emerald-100 text-emerald-800'
                      : res === 'partial'
                      ? 'bg-amber-100 text-amber-800'
                      : res === 'missing'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {res === 'good'
                      ? t(lang, 'responseGood')
                      : res === 'partial'
                      ? t(lang, 'responsePartial')
                      : res === 'missing'
                      ? t(lang, 'responseMissing')
                      : (lang === 'bn' ? 'উত্তর নেই' : 'Unanswered')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={onCompleteAudit}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 min-h-[48px]"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>{lang === 'bn' ? 'পরীক্ষা চূড়ান্ত করুন ও করণীয় প্ল্যান তৈরি করুন' : 'Finalize Audit & Generate Action Plan'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Single Question Card */
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {lang === 'bn' ? 'পর্যবেক্ষণ পয়েন্ট' : 'Check'} {toBanglaNum(safeIndex + 1, lang)}: {lang === 'bn' ? localizedDomain.titleBn : localizedDomain.titleEn}
            </span>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              currentDomain.riskSeverity === 'critical'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {currentDomain.riskSeverity === 'critical' ? (lang === 'bn' ? 'জরুরি ঝুঁকি' : 'Critical') : (lang === 'bn' ? 'উচ্চ ঝুঁকি' : 'High Priority')}
            </span>
          </div>

          {/* Educational Visual Illustration */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <TopicIllustration topicOrder={currentDomain.order} className="w-full h-36 sm:h-40" />
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {lang === 'bn' ? localizedDomain.questionBn : localizedDomain.questionEn}
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <strong className="text-slate-800">{lang === 'bn' ? 'কেন গুরুত্বপূর্ণ: ' : 'Why it matters: '}</strong>
              {lang === 'bn' ? localizedDomain.explanationBn : localizedDomain.explanationEn}
            </p>
          </div>

          {/* 3 Clear Response Options */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-xs font-bold text-slate-700">
              {lang === 'bn' ? 'আপনার খামারের বর্তমান অবস্থা নির্বাচন করুন:' : 'Select farm baseline condition:'}
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* 1. Good */}
              <button
                type="button"
                onClick={() => handleSelect('good')}
                className={`w-full min-h-[50px] p-3 rounded-2xl border text-left font-bold transition-all active:scale-[0.99] flex items-center justify-between ${
                  currentAnswer === 'good'
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                    : 'border-emerald-200 bg-emerald-50/60 text-emerald-950 hover:bg-emerald-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${currentAnswer === 'good' ? 'text-white' : 'text-emerald-700'}`} />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold">{t(lang, 'responseGood')}</span>
                    <span className={`block text-[11px] font-normal ${currentAnswer === 'good' ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      {t(lang, 'responseGoodSub')}
                    </span>
                  </div>
                </div>
              </button>

              {/* 2. Partial */}
              <button
                type="button"
                onClick={() => handleSelect('partial')}
                className={`w-full min-h-[50px] p-3 rounded-2xl border text-left font-bold transition-all active:scale-[0.99] flex items-center justify-between ${
                  currentAnswer === 'partial'
                    ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                    : 'border-amber-200 bg-amber-50/60 text-amber-950 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${currentAnswer === 'partial' ? 'text-white' : 'text-amber-700'}`} />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold">{t(lang, 'responsePartial')}</span>
                    <span className={`block text-[11px] font-normal ${currentAnswer === 'partial' ? 'text-amber-100' : 'text-amber-800'}`}>
                      {t(lang, 'responsePartialSub')}
                    </span>
                  </div>
                </div>
              </button>

              {/* 3. Missing */}
              <button
                type="button"
                onClick={() => handleSelect('missing')}
                className={`w-full min-h-[50px] p-3 rounded-2xl border text-left font-bold transition-all active:scale-[0.99] flex items-center justify-between ${
                  currentAnswer === 'missing'
                    ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                    : 'border-rose-200 bg-rose-50/60 text-rose-950 hover:bg-rose-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <XCircle className={`w-5 h-5 flex-shrink-0 ${currentAnswer === 'missing' ? 'text-white' : 'text-rose-700'}`} />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold">{t(lang, 'responseMissing')}</span>
                    <span className={`block text-[11px] font-normal ${currentAnswer === 'missing' ? 'text-rose-100' : 'text-rose-800'}`}>
                      {t(lang, 'responseMissingSub')}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Practical Tip Callout */}
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{lang === 'bn' ? 'ব্যবহারিক পরামর্শ: ' : 'Practical Tip: '}</span>
              <span>{lang === 'bn' ? localizedDomain.practicalTipBn : localizedDomain.practicalTipEn}</span>
            </div>
          </div>

          {/* Navigation Buttons: Previous / Next / Complete */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all min-h-[44px] ${
                currentIndex === 0
                  ? 'opacity-40 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t(lang, 'prevBtn')}</span>
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs min-h-[44px]"
              >
                <span>{t(lang, 'nextBtn')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowReviewSummary(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md min-h-[44px]"
              >
                <span>{lang === 'bn' ? 'সারসংক্ষেপ দেখুন' : 'Review & Submit'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
