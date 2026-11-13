import React, { useState } from 'react';
import {
  AnimalProfile,
  FarmProfile,
  CareRecord,
  ScheduledCareTask,
  HealthEventReport,
  Language,
} from '../types';
import { toBanglaNum } from '../translations';
import { IDCardModal } from './IDCardModal';
import { VaccinationHistoryCard } from './VaccinationHistoryCard';
import { ResilientImage } from './ui/ResilientImage';
import { getSpeciesFallbackImage } from '../lib/visualAssets';
import {
  X,
  Syringe,
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  HeartPulse,
  Calendar,
  Layers,
  FileText,
  Activity,
  PlusCircle,
  Tag,
} from 'lucide-react';

interface AnimalDetailModalProps {
  animal: AnimalProfile | null;
  farm: FarmProfile;
  careRecords: CareRecord[];
  scheduledTasks: ScheduledCareTask[];
  healthEvents: HealthEventReport[];
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAskAIAboutAnimal: (animal: AnimalProfile) => void;
  onRequestVetForAnimal: (animal: AnimalProfile) => void;
  onRecordCare: (targetId: string, type: 'vaccination' | 'deworming') => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  animal,
  farm,
  careRecords,
  scheduledTasks,
  healthEvents,
  isOpen,
  onClose,
  lang,
  onAskAIAboutAnimal,
  onRequestVetForAnimal,
  onRecordCare,
}) => {
  if (!isOpen || !animal) return null;

  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'overview' | 'vaccination' | 'deworming' | 'history'>('overview');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);

  // Filter records for this animal
  const animalVaccines = careRecords.filter(
    (r) => r.targetId === animal.id && r.careType === 'vaccination'
  );
  const animalDeworming = careRecords.filter(
    (r) => r.targetId === animal.id && r.careType === 'deworming'
  );
  const animalTasks = scheduledTasks.filter((t) => t.targetId === animal.id);
  const animalEvents = healthEvents.filter((e) => e.targetId === animal.id);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-cyan-400/50 shrink-0">
                <ResilientImage
                  src={animal.photoUrl || getSpeciesFallbackImage(animal.species).src}
                  fallbackSrc={getSpeciesFallbackImage(animal.species).src}
                  alt={animal.nameOrTag}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {animal.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      animal.healthStatus === 'healthy'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : animal.healthStatus === 'needs_attention'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {isBn
                      ? animal.healthStatus === 'healthy'
                        ? 'সুস্থ ও স্বাভাবিক'
                        : animal.healthStatus === 'needs_attention'
                        ? 'নজরদারি প্রয়োজন'
                        : 'অসুস্থ'
                      : animal.healthStatus.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {animal.nameOrTag}
                </h2>

                <p className="text-xs text-slate-300">
                  {animal.breed} · {animal.sex === 'male' ? (isBn ? 'পুরুষ' : 'Male') : (isBn ? 'স্ত্রী' : 'Female')} · {toBanglaNum(animal.estimatedAgeMonths, lang)} {isBn ? 'মাস বয়স' : 'months'}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons on Header */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsIDCardOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'ডিজিটাল আইডি কার্ড' : 'Digital ID Card'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onAskAIAboutAnimal(animal);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{isBn ? 'AI সহায়ককে জিজ্ঞাসা' : 'Ask AI About This Animal'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onRequestVetForAnimal(animal);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <HeartPulse className="w-3.5 h-3.5 text-teal-300" />
                <span>{isBn ? 'ভেটেরিনারি পরামর্শ' : 'Request Vet'}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 pt-2 flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isBn ? 'পরিচিতি ও অবস্থা' : 'Overview'}
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
              <span>{isBn ? 'টিকাদান ইতিহাস' : 'Vaccination'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700">
                {animalVaccines.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('deworming')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'deworming'
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>{isBn ? 'কৃমিনাশক পর্যালোচনা' : 'Deworming'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700">
                {animalDeworming.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-emerald-700 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {isBn ? 'স্বাস্থ্য ইতিহাস' : 'Health Events'}
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'প্রজাতি' : 'Species'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {animal.species}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'জাত / জাতের ধরন' : 'Breed'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {animal.breed}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'ট্যাগ নম্বর' : 'Tag Number'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {animal.tagNumber || 'N/A'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'জন্ম তারিখ / বয়স' : 'Age'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {toBanglaNum(animal.estimatedAgeMonths, lang)} {isBn ? 'মাস' : 'months'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'উৎপাদন পর্যায়' : 'Production Stage'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {animal.productionStage || 'General'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {isBn ? 'নিবন্ধনের তারিখ' : 'Registered Date'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {toBanglaNum(animal.createdAt, lang)}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {animal.notes && (
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <span className="text-xs font-bold text-emerald-900 block">
                      {isBn ? 'খামারির পর্যবেক্ষণ নোট:' : 'Farmer Notes:'}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {animal.notes}
                    </p>
                  </div>
                )}

                {/* Visual Vaccination History Summary Card (Timeline of last 3 administered/missed vaccines) */}
                <VaccinationHistoryCard
                  targetId={animal.id}
                  targetType="animal"
                  careRecords={careRecords}
                  scheduledTasks={scheduledTasks}
                  lang={lang}
                  onRecordCare={() => {
                    onClose();
                    onRecordCare(animal.id, 'vaccination');
                  }}
                />

                {/* Active Care Reminders for this animal */}
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {isBn ? 'এই প্রাণীর নির্ধারিত ভবিষ্যৎ যত্ন:' : 'Upcoming Care Schedule:'}
                  </h4>
                  {animalTasks.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      {isBn ? 'কোনো আসন্ন কাজ নির্ধারিত নেই।' : 'No pending tasks for this animal.'}
                    </p>
                  ) : (
                    animalTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {isBn ? t.titleBn : t.titleEn}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {isBn ? `নির্ধারিত তারিখ: ${toBanglaNum(t.dueDate, lang)}` : `Due: ${t.dueDate}`}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'overdue'
                              ? 'bg-rose-100 text-rose-800'
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

            {/* 2. VACCINATION TAB */}
            {activeTab === 'vaccination' && (
              <div className="space-y-4">
                {/* Visual Vaccination History Timeline Summary Card */}
                <VaccinationHistoryCard
                  targetId={animal.id}
                  targetType="animal"
                  careRecords={careRecords}
                  scheduledTasks={scheduledTasks}
                  lang={lang}
                  onRecordCare={() => {
                    onClose();
                    onRecordCare(animal.id, 'vaccination');
                  }}
                />

                <div className="flex items-center justify-between pt-2 pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700">
                    {isBn ? 'সকল সম্পন্ন হওয়া টিকাদান বিবরণী' : 'All Administered Records'}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onRecordCare(animal.id, 'vaccination');
                    }}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? 'টিকা রেকর্ড যোগ করুন' : 'Record Vaccine'}</span>
                  </button>
                </div>

                {animalVaccines.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    {isBn ? 'কোনো টিকাদান রেকর্ড এখনো নথিভুক্ত করা হয়নি।' : 'No vaccination records yet.'}
                  </div>
                ) : (
                  animalVaccines.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {v.diseaseOrTarget}
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          {isBn ? `তারিখ: ${toBanglaNum(v.dateAdministered, lang)}` : v.dateAdministered}
                        </span>
                      </div>
                      <div className="text-slate-600 grid grid-cols-2 gap-1 text-[11px]">
                        <div>ঔষধ/ভ্যাকসিন: {v.productName || 'সরকারি সরবরাহ'}</div>
                        <div>ব্যাচ নং: {v.batchNumber || 'N/A'}</div>
                        <div>প্রয়োগকারী: {v.administeredBy}</div>
                        {v.nextDueDate && (
                          <div className="text-amber-800 font-semibold">
                            পরবর্তী ডোজ: {toBanglaNum(v.nextDueDate, lang)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. DEWORMING TAB */}
            {activeTab === 'deworming' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-slate-700">
                    {isBn ? 'কৃমিনাশক পর্যালোচনা ও চিকিৎসা রেকর্ড' : 'Deworming Log'}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onRecordCare(animal.id, 'deworming');
                    }}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কৃমিনাশক রেকর্ড করুন' : 'Record Deworming'}</span>
                  </button>
                </div>

                {animalDeworming.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    {isBn ? 'কোনো কৃমিনাশক প্রয়োগ রেকর্ড নেই।' : 'No deworming records yet.'}
                  </div>
                ) : (
                  animalDeworming.map((d) => (
                    <div
                      key={d.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {d.diseaseOrTarget}
                        </span>
                        <span className="text-slate-600">
                          {toBanglaNum(d.dateAdministered, lang)}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        ঔষধ: {d.productName || 'অনুমোদিত কৃমিনাশক'} · প্রয়োগকারী: {d.administeredBy}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 4. HEALTH HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  {isBn ? 'স্বাস্থ্য ঘটনা ও লক্ষণ পর্যবেক্ষণ' : 'Reported Symptoms & Vet Events'}
                </span>

                {animalEvents.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    {isBn ? 'এই প্রাণীর কোনো অসুস্থতার ইতিহাস নেই।' : 'No illness history recorded.'}
                  </div>
                ) : (
                  animalEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {toBanglaNum(evt.reportedDate, lang)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {evt.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-slate-700">
                        <strong>লক্ষণসমূহ:</strong> {evt.symptoms.join(', ')}
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {evt.description}
                      </p>
                      {evt.vetNotes && (
                        <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-[11px] text-teal-900">
                          <strong>ভেটেরিনারি নোট:</strong> {evt.vetNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      <IDCardModal
        item={animal}
        farm={farm}
        type="animal"
        isOpen={isIDCardOpen}
        onClose={() => setIsIDCardOpen(false)}
        lang={lang}
      />
    </>
  );
};
