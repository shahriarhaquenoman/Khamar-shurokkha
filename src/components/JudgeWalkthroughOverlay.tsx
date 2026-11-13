import React from 'react';
import { Language } from '../types';
import { JUDGE_WALKTHROUGH_STEPS } from '../data/judgeDemoDataset';
import { toBanglaNum } from '../translations';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
  LogOut,
  X,
} from 'lucide-react';

interface JudgeWalkthroughOverlayProps {
  lang: Language;
  isJudgeDemoActive: boolean;
  isWalkthroughOpen: boolean;
  stepIndex: number;
  onToggleWalkthrough: (open: boolean) => void;
  onSelectStep: (newIndex: number) => void;
  onExitJudgeDemo: () => void;
}

export const JudgeWalkthroughOverlay: React.FC<JudgeWalkthroughOverlayProps> = ({
  lang,
  isJudgeDemoActive,
  isWalkthroughOpen,
  stepIndex,
  onToggleWalkthrough,
  onSelectStep,
  onExitJudgeDemo,
}) => {
  if (!isJudgeDemoActive) return null;

  const isBn = lang === 'bn';
  const totalSteps = JUDGE_WALKTHROUGH_STEPS.length;
  const clampedIndex = Math.max(0, Math.min(stepIndex, totalSteps - 1));
  const currentStep = JUDGE_WALKTHROUGH_STEPS[clampedIndex];

  return (
    <>
      {/* Persistent Top Competition Judge Demo Bar */}
      <div
        role="region"
        aria-label={isBn ? 'বিচারক ডেমো মোড বার' : 'Judge Demonstration Mode Banner'}
        className="bg-indigo-950 text-white border-b border-indigo-700 px-3 sm:px-6 py-2"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <Award className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="tracking-wide">
              {isBn
                ? 'JUDGE DEMONSTRATION MODE — SAMPLE DATA (বিচারক ডেমো — শুধুমাত্র নমুনা তথ্য)'
                : 'JUDGE DEMONSTRATION MODE — SAMPLE DATA'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWalkthrough(!isWalkthroughOpen)}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>
                {isWalkthroughOpen
                  ? isBn ? 'ওয়াকথ্রু লুকান' : 'Hide Tour'
                  : isBn ? 'গাইডেড ওয়াকথ্রু (৭ ধাপ)' : 'Guided Tour (7 Steps)'}
              </span>
            </button>

            <button
              type="button"
              onClick={onExitJudgeDemo}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'ডেমো থেকে বের হন' : 'Exit Demo Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Non-Blocking Guided Walkthrough Card */}
      {isWalkthroughOpen && currentStep && (
        <aside
          aria-label={isBn ? 'বিচারক গাইডেড ওয়াকথ্রু' : 'Judge Guided Walkthrough'}
          className="fixed left-3 right-3 sm:left-6 sm:right-auto bottom-[76px] md:bottom-6 z-30 sm:w-[400px] bg-white rounded-2xl border-2 border-indigo-600 shadow-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white text-xs font-extrabold tabular-nums">
                {isBn
                  ? `ধাপ ${toBanglaNum(currentStep.stepNumber, lang)} / ${toBanglaNum(totalSteps, lang)}`
                  : `Step ${currentStep.stepNumber} / ${totalSteps}`}
              </span>
              <span className="text-xs font-bold text-indigo-800">
                {isBn ? 'বিচারক ওয়াকথ্রু' : 'Judge Tour'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onToggleWalkthrough(false)}
              aria-label={isBn ? 'ওয়াকথ্রু বন্ধ করুন' : 'Close walkthrough'}
              className="min-w-[36px] min-h-[36px] rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              {isBn ? currentStep.titleBn : currentStep.titleEn}
            </h3>
            <p className="text-xs font-bold text-indigo-700">
              {isBn ? currentStep.subtitleBn : currentStep.subtitleEn}
            </p>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {isBn ? currentStep.talkingPointBn : currentStep.talkingPointEn}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectStep(Math.max(0, clampedIndex - 1))}
              disabled={clampedIndex === 0}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isBn ? 'পূর্ববর্তী' : 'Prev'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectStep(clampedIndex)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-extrabold cursor-pointer"
            >
              {isBn ? 'এই পাতায় যান' : 'View Screen'}
            </button>

            {clampedIndex < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => onSelectStep(clampedIndex + 1)}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleWalkthrough(false)}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-extrabold cursor-pointer"
              >
                {isBn ? 'স্বাধীনভাবে ঘুরুন' : 'Explore Freely'}
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
};
