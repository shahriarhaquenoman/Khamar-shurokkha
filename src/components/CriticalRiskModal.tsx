import React from 'react';
import { CriticalAlert, Language } from '../types';
import { ShieldAlert, X, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CriticalRiskModalProps {
  alerts: CriticalAlert[];
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onGoToPlanner: () => void;
}

export const CriticalRiskModal: React.FC<CriticalRiskModalProps> = ({
  alerts,
  isOpen,
  onClose,
  lang,
  onGoToPlanner,
}) => {
  if (!isOpen || alerts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-rose-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Warning Banner */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 uppercase">
                {lang === 'bn' ? 'জরুরি ঝুঁকি নির্দেশনা' : 'Critical Biosecurity Safeguard'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-rose-950 mt-1">
                {alerts[0][lang === 'bn' ? 'titleBn' : 'titleEn']}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {/* Why it matters */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{lang === 'bn' ? 'কেন এটি তাৎক্ষণিক সমাধান প্রয়োজন:' : 'Why Immediate Action is Required:'}</span>
            </h4>
            <p className="text-slate-700">
              {alerts[0][lang === 'bn' ? 'whyItMattersBn' : 'whyItMattersEn']}
            </p>
          </div>

          {/* Immediate Steps */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">
              {lang === 'bn' ? 'তাৎক্ষণিক করণীয় পদক্ষেপসমূহ:' : 'Immediate Safeguard Steps:'}
            </h4>
            <div className="space-y-2">
              {alerts[0][lang === 'bn' ? 'immediateStepsBn' : 'immediateStepsEn'].map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/50 border border-rose-100">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Veterinary Escalation Guidance (Strict Scientific Guardrail) */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-amber-950">
            <h4 className="font-bold mb-1 flex items-center gap-1.5">
              <span>{lang === 'bn' ? 'পশু চিকিৎসক পরামর্শ সংক্রান্ত নীতি:' : 'Veterinary Consultation Policy:'}</span>
            </h4>
            <p className="text-[11px] text-amber-900">
              {alerts[0][lang === 'bn' ? 'vetGuidanceBn' : 'vetGuidanceEn']}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs min-h-[46px]"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToPlanner();
            }}
            className="flex-[2] py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[46px] shadow-sm"
          >
            <span>{lang === 'bn' ? 'সাপ্তাহিক অ্যাকশন প্ল্যানে যান' : 'Go to Action Plan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
