import React, { useState } from 'react';
import {
  FlockProfile,
  FarmProfile,
  CareRecord,
  ScheduledCareTask,
  Language,
} from '../types';
import { toBanglaNum } from '../translations';
import { IDCardModal } from './IDCardModal';
import { VaccinationHistoryCard } from './VaccinationHistoryCard';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  X,
  Syringe,
  QrCode,
  Sparkles,
  HeartPulse,
  PlusCircle,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface FlockDetailModalProps {
  flock: FlockProfile | null;
  farm: FarmProfile;
  careRecords: CareRecord[];
  scheduledTasks: ScheduledCareTask[];
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAskAIAboutFlock: (flock: FlockProfile) => void;
  onRequestVetForFlock: (flock: FlockProfile) => void;
  onRecordMortality: (flockId: string, count: number) => void;
  onRecordCare: (targetId: string, type: 'vaccination' | 'deworming') => void;
}

export const FlockDetailModal: React.FC<FlockDetailModalProps> = ({
  flock,
  farm,
  careRecords,
  scheduledTasks,
  isOpen,
  onClose,
  lang,
  onAskAIAboutFlock,
  onRequestVetForFlock,
  onRecordMortality,
  onRecordCare,
}) => {
  if (!isOpen || !flock) return null;

  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'overview' | 'vaccination' | 'mortality'>('overview');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [mortalityInput, setMortalityInput] = useState('');

  const flockVaccines = careRecords.filter(
    (r) => r.targetId === flock.id && r.careType === 'vaccination'
  );
  const flockTasks = scheduledTasks.filter((t) => t.targetId === flock.id);

  const handleAddMortality = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(mortalityInput, 10);
    if (!isNaN(count) && count > 0) {
      onRecordMortality(flock.id, count);
      setMortalityInput('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 overflow-hidden shrink-0">
                <ResilientImage
                  src={flock.poultryType === 'duck' ? FARM_VISUAL_ASSETS.waterFeedCare : FARM_VISUAL_ASSETS.poultryBiosecurity}
                  alt={flock.batchName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {flock.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                    {flock.status}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {flock.batchName}
                </h2>

                <p className="text-xs text-slate-300">
                  {flock.poultryType} · {toBanglaNum(flock.currentBirdCount, lang)} {isBn ? 'টি পাখি' : 'birds'} · {isBn ? `বয়স: ${toBanglaNum(flock.ageDays, lang)} দিন` : `${flock.ageDays} days old`}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsIDCardOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'ফ্লক আইডি কার্ড' : 'Flock ID Card'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onAskAIAboutFlock(flock);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{isBn ? 'AI সহায়ককে জিজ্ঞাসা' : 'Ask AI'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onRequestVetForFlock(flock);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <HeartPulse className="w-3.5 h-3.5 text-teal-300" />
                <span>{isBn ? 'ভেটেরিনারি পরামর্শ' : 'Request Vet'}</span>
              </button>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 pt-2 flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isBn ? 'ব্যাচ তথ্য ও সংখ্যা' : 'Batch Details'}
            </button>
            <button
              onClick={() => setActiveTab('vaccination')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'vaccination'
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>{isBn ? 'টিকাদান রেকর্ড' : 'Vaccination'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700">
                {flockVaccines.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('mortality')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'mortality'
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isBn ? 'মৃত্যুহার লগ (Mortality)' : 'Mortality Log'}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'পোল্ট্রির ধরন' : 'Type'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {flock.poultryType}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'বর্তমান সংখ্যা' : 'Current Birds'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {toBanglaNum(flock.currentBirdCount, lang)} / {toBanglaNum(flock.initialBirdCount, lang)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'বাচ্চা তোলার তারিখ' : 'Placement Date'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {toBanglaNum(flock.placementDate, lang)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'হ্যাচারি / উৎস' : 'Hatchery'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {flock.sourceSupplier || 'Local'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'বাসস্থান পদ্ধতি' : 'Housing'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {flock.housingType === 'litter_floor' ? (isBn ? 'তুষের লিটার শেড' : 'Litter floor') : 'Cages'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'মোট মৃত্যুহার' : 'Mortality'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {toBanglaNum(flock.mortalityCount, lang)} {isBn ? 'টি পাখি' : 'birds'} ({((flock.mortalityCount / flock.initialBirdCount) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {flock.notes && (
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                    <strong className="block mb-1">{isBn ? 'ব্যাচ সম্পর্কিত নোট:' : 'Batch Notes:'}</strong>
                    {flock.notes}
                  </div>
                )}

                {/* Visual Vaccination History Summary Card (Timeline of last 3 administered/missed vaccines) */}
                <VaccinationHistoryCard
                  targetId={flock.id}
                  targetType="flock"
                  careRecords={careRecords}
                  scheduledTasks={scheduledTasks}
                  lang={lang}
                  onRecordCare={() => {
                    onClose();
                    onRecordCare(flock.id, 'vaccination');
                  }}
                />

                {/* Flock upcoming care tasks */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {isBn ? 'এই ব্যাচের নির্ধারিত টিকাদান কার্যক্রম:' : 'Scheduled Batch Tasks:'}
                  </h4>
                  {flockTasks.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      {isBn ? 'কোনো আসন্ন কাজ নির্ধারিত নেই।' : 'No pending tasks for this flock.'}
                    </p>
                  ) : (
                    flockTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {isBn ? t.titleBn : t.titleEn}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {isBn ? `তারিখ: ${toBanglaNum(t.dueDate, lang)}` : `Due: ${t.dueDate}`}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'due_soon'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'vaccination' && (
              <div className="space-y-4">
                {/* Visual Vaccination History Timeline Summary Card */}
                <VaccinationHistoryCard
                  targetId={flock.id}
                  targetType="flock"
                  careRecords={careRecords}
                  scheduledTasks={scheduledTasks}
                  lang={lang}
                  onRecordCare={() => {
                    onClose();
                    onRecordCare(flock.id, 'vaccination');
                  }}
                />

                <div className="flex items-center justify-between pt-2 pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700">
                    {isBn ? 'সম্পন্ন হওয়া সকল টিকাদান ইতিহাস' : 'All Administered Batch Vaccines'}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onRecordCare(flock.id, 'vaccination');
                    }}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? 'টিকা রেকর্ড যোগ করুন' : 'Record Vaccine'}</span>
                  </button>
                </div>

                {flockVaccines.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    {isBn ? 'কোনো টিকা রেকর্ড পাওয়া যায়নি।' : 'No records yet.'}
                  </div>
                ) : (
                  flockVaccines.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{v.diseaseOrTarget}</span>
                        <span className="text-emerald-700 font-semibold">{toBanglaNum(v.dateAdministered, lang)}</span>
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        ভ্যাকসিন: {v.productName || 'BCRDV'} · প্রয়োগকারী: {v.administeredBy}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'mortality' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">
                    {isBn ? 'আজকের মৃত পাখির সংখ্যা লিপিবদ্ধ করুন:' : 'Log Today\'s Mortality:'}
                  </h4>
                  <form onSubmit={handleAddMortality} className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={mortalityInput}
                      onChange={(e) => setMortalityInput(e.target.value)}
                      placeholder={isBn ? 'মৃত পাখির সংখ্যা...' : 'Number of dead birds...'}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!mortalityInput}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {isBn ? 'লগ সংরক্ষণ করুন' : 'Record Mortality'}
                    </button>
                  </form>
                  <p className="text-[11px] text-slate-500">
                    {isBn
                      ? '* সংখ্যা যোগ করলে বর্তমান ফ্লকের জীবিত পাখির মোট সংখ্যা থেকে স্বয়ংক্রিয়ভাবে বিয়োগ হবে।'
                      : '* Entering dead bird count automatically updates live flock population.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <IDCardModal
        item={flock}
        farm={farm}
        type="flock"
        isOpen={isIDCardOpen}
        onClose={() => setIsIDCardOpen(false)}
        lang={lang}
      />
    </>
  );
};
