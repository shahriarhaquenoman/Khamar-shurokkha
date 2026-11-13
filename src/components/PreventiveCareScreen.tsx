import React, { useState } from 'react';
import {
  ScheduledCareTask,
  CareRecord,
  AnimalProfile,
  FlockProfile,
  FarmProfile,
  Language,
} from '../types';
import { toBanglaNum } from '../translations';
import { AUTHORIZED_PROTOCOLS } from '../data/protocolData';
import {
  Calendar as CalendarIcon,
  Syringe,
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Filter,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface PreventiveCareScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  tasks: ScheduledCareTask[];
  records: CareRecord[];
  lang: Language;
  onCompleteTask: (taskId: string) => void;
  onAddCareRecord: (newRecord: CareRecord) => void;
  presetTarget?: { targetId?: string; type?: 'vaccination' | 'deworming' } | null;
  onClearPreset?: () => void;
}

export const PreventiveCareScreen: React.FC<PreventiveCareScreenProps> = ({
  farm,
  animals,
  flocks,
  tasks,
  records,
  lang,
  onCompleteTask,
  onAddCareRecord,
  presetTarget,
  onClearPreset,
}) => {
  const isBn = lang === 'bn';

  const [activeView, setActiveView] = useState<'calendar' | 'tasks' | 'records'>('tasks');
  const [careTypeFilter, setCareTypeFilter] = useState<'all' | 'vaccination' | 'deworming'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  // Record Care Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordCareType, setRecordCareType] = useState<'vaccination' | 'deworming'>('vaccination');
  const [recordTargetType, setRecordTargetType] = useState<'animal' | 'flock'>('animal');
  const [recordTargetId, setRecordTargetId] = useState<string>(animals[0]?.id || '');
  const [recordDisease, setRecordDisease] = useState('খুরারোগ (FMD)');
  const [recordProduct, setRecordProduct] = useState('');
  const [recordBatch, setRecordBatch] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [recordAdministeredBy, setRecordAdministeredBy] = useState(farm.ownerName || 'খামারি নিজে');
  const [recordNextDueDate, setRecordNextDueDate] = useState('');
  const [recordNotes, setRecordNotes] = useState('');

  // Handle Preset Target if triggered from Dashboard or Animal Details
  React.useEffect(() => {
    if (presetTarget) {
      if (presetTarget.type) {
        setRecordCareType(presetTarget.type);
      }
      if (presetTarget.targetId) {
        const isFlk = flocks.some((f) => f.id === presetTarget.targetId);
        setRecordTargetType(isFlk ? 'flock' : 'animal');
        setRecordTargetId(presetTarget.targetId);
      }
      setIsRecordModalOpen(true);
      if (onClearPreset) {
        onClearPreset();
      }
    }
  }, [presetTarget, flocks, onClearPreset]);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesCareType = careTypeFilter === 'all' || t.careType === careTypeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && t.status !== 'completed') ||
      (statusFilter === 'completed' && t.status === 'completed');
    return matchesCareType && matchesStatus;
  });

  const overdueCount = tasks.filter((t) => t.status === 'overdue').length;
  const dueSoonCount = tasks.filter((t) => t.status === 'due_soon').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CareRecord = {
      id: `care_rec_${Date.now()}`,
      farmId: farm.id,
      targetType: recordTargetType,
      targetId: recordTargetId,
      species: 'cattle', // default fallback
      careType: recordCareType,
      diseaseOrTarget: recordDisease,
      productName: recordProduct || undefined,
      batchNumber: recordBatch || undefined,
      dateAdministered: recordDate,
      administeredBy: recordAdministeredBy,
      nextDueDate: recordNextDueDate || undefined,
      notes: recordNotes || undefined,
    };
    onAddCareRecord(newRecord);
    setIsRecordModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-pink-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#DB2777] text-xs font-extrabold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4 text-[#DB2777]" />
            <span>{isBn ? 'প্রতিরোধমূলক প্রাণিস্বাস্থ্য' : 'Preventive Animal Health Management'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {isBn ? 'টিকা ও কৃমিনাশক ক্যালেন্ডার' : 'Vaccination & Deworming Calendar'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {isBn
              ? 'অনুমোদিত ভেটেরিনারি প্রটোকলভিত্তিক সময়সূচি, আসন্ন কার্যক্রম ও সম্পন্ন রেকর্ড'
              : 'Protocol-governed schedule, upcoming care tasks, and administered records'}
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="min-h-[46px] px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-extrabold shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-200" />
          <span>{isBn ? 'টিকা / কৃমিনাশক রেকর্ড করুন' : 'Record Care Event'}</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-red-900">
              {isBn ? 'সময়োত্তীর্ণ কাজ' : 'Overdue Tasks'}
            </span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-black text-red-950 tabular-nums">
            {toBanglaNum(overdueCount, lang)}
          </div>
          <span className="text-[10px] text-red-700 font-semibold">
            {isBn ? 'অবিলম্বে দৃষ্টি আকর্ষণ প্রয়োজন' : 'Immediate attention required'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-900">
              {isBn ? 'আজ / শীঘ্রই করণীয়' : 'Due Soon'}
            </span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-black text-amber-950 tabular-nums">
            {toBanglaNum(dueSoonCount, lang)}
          </div>
          <span className="text-[10px] text-amber-800 font-semibold">
            {isBn ? 'আগামী ৩ দিনের মধ্যে' : 'Within next 3 days'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-green-900">
              {isBn ? 'সম্পন্ন হয়েছে' : 'Completed'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="text-2xl font-black text-green-950 tabular-nums">
            {toBanglaNum(completedCount, lang)}
          </div>
          <span className="text-[10px] text-green-800 font-semibold">
            {isBn ? 'সফলভাবে নথিভুক্ত' : 'Successfully logged'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-900">
              {isBn ? 'মোট হিস্ট্রি রেকর্ড' : 'Total Care Records'}
            </span>
            <Syringe className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-black text-blue-950 tabular-nums">
            {toBanglaNum(records.length, lang)}
          </div>
          <span className="text-[10px] text-blue-800 font-semibold">
            {isBn ? 'আজীবন সুস্থতার দলিল' : 'Lifetime health logs'}
          </span>
        </div>
      </div>

      {/* View Switcher & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'tasks'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isBn ? 'কাজের তালিকা (Task Agenda)' : 'Task Agenda'}
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'calendar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isBn ? 'মাসিক ক্যালেন্ডার (Calendar)' : 'Monthly View'}
          </button>
          <button
            onClick={() => setActiveView('records')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'records'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isBn ? 'হিস্ট্রি লগ (History)' : 'Care History'}
          </button>
        </div>

        {/* Filter Selectors */}
        <div className="flex items-center gap-2">
          {/* Care Type Filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCareTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                careTypeFilter === 'all'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isBn ? 'সকল যত্ন' : 'All'}
            </button>
            <button
              onClick={() => setCareTypeFilter('vaccination')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                careTypeFilter === 'vaccination'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Syringe className="w-3 h-3" />
              <span>{isBn ? 'টিকা' : 'Vaccine'}</span>
            </button>
            <button
              onClick={() => setCareTypeFilter('deworming')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                careTypeFilter === 'deworming'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Pill className="w-3 h-3" />
              <span>{isBn ? 'কৃমিনাশক' : 'Deworm'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === 'tasks' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
              {isBn ? 'কোনো নির্ধারিত কাজ পাওয়া যায়নি।' : 'No tasks match current filter.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all ${
                    task.status === 'overdue'
                      ? 'border-rose-300 bg-rose-50/30'
                      : task.status === 'due_soon'
                      ? 'border-amber-300 bg-amber-50/30'
                      : task.status === 'completed'
                      ? 'border-slate-200 opacity-80'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          task.status === 'overdue'
                            ? 'bg-rose-600 text-white'
                            : task.status === 'due_soon'
                            ? 'bg-amber-500 text-white'
                            : task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.status === 'overdue' && <AlertTriangle className="w-3 h-3" />}
                        {task.status === 'due_soon' && <Clock className="w-3 h-3" />}
                        {task.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        <span>
                          {isBn
                            ? task.status === 'overdue'
                              ? 'সময়োত্তীর্ণ (জরুরি)'
                              : task.status === 'due_soon'
                              ? 'আজ/শীঘ্রই করণীয়'
                              : task.status === 'completed'
                              ? 'সম্পন্ন হয়েছে'
                              : 'আসন্ন'
                            : task.status.toUpperCase()}
                        </span>
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {isBn ? `তারিখ: ${toBanglaNum(task.dueDate, lang)}` : `Due: ${task.dueDate}`}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base">
                      {isBn ? task.titleBn : task.titleEn}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-bold text-emerald-900">{task.targetName}</span>
                      <span>·</span>
                      <span className="capitalize">{task.species}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isBn ? task.descriptionBn : task.descriptionEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                        task.careType === 'vaccination'
                          ? 'bg-pink-50 text-pink-900 border border-pink-200'
                          : 'bg-cyan-50 text-cyan-900 border border-cyan-200'
                      }`}
                    >
                      {task.careType === 'vaccination' ? (
                        <>
                          <Syringe className="w-3.5 h-3.5 text-[#DB2777]" />
                          <span>{isBn ? 'টিকাদান' : 'Vaccination'}</span>
                        </>
                      ) : (
                        <>
                          <Pill className="w-3.5 h-3.5 text-[#0891B2]" />
                          <span>{isBn ? 'কৃমিনাশক' : 'Deworming'}</span>
                        </>
                      )}
                    </span>

                    {task.status !== 'completed' ? (
                      <button
                        onClick={() => onCompleteTask(task.id)}
                        className="min-h-[40px] px-4 py-1.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'সম্পন্ন হয়েছে' : 'Mark Completed'}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isBn ? 'সম্পন্ন সম্পন্ন' : 'Logged'}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Monthly Calendar View */}
      {activeView === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">
              {isBn ? 'নভেম্বর ২০২৬ — খামার স্বাস্থ্য ক্যালেন্ডার' : 'November 2026 Care Calendar'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {isBn ? 'আজ ১১ই নভেম্বর' : 'Today: Nov 11'}
            </span>
          </div>

          {/* Faux Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map((d) => (
              <div key={d} className="font-bold text-slate-400 py-1">
                {d}
              </div>
            ))}

            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const hasTask = dayNum === 8 || dayNum === 11 || dayNum === 22 || dayNum === 28;
              const isOverdueDay = dayNum === 8;
              const isToday = dayNum === 11;

              return (
                <div
                  key={i}
                  className={`p-2 min-h-[64px] rounded-xl border text-left flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : isOverdueDay
                      ? 'bg-rose-50 border-rose-300'
                      : 'bg-slate-50/60 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${isToday ? 'text-emerald-900' : 'text-slate-700'}`}>
                    {toBanglaNum(dayNum, lang)}
                  </span>

                  {hasTask && (
                    <div
                      className={`text-[9px] p-1 rounded font-bold leading-tight truncate ${
                        isOverdueDay
                          ? 'bg-rose-600 text-white'
                          : isToday
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {dayNum === 8
                        ? 'কৃমিনাশক'
                        : dayNum === 11
                        ? 'IBD বুস্টার'
                        : dayNum === 22
                        ? 'FMD টিকা'
                        : 'ভেড়া কৃমি'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Records View */}
      {activeView === 'records' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            {isBn ? 'সম্পন্ন সমস্ত টিকাদান ও কৃমিনাশক রেজিস্ট্রি' : 'All Administered Care Records'}
          </h3>

          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {rec.diseaseOrTarget}
                    </span>
                    <span className="font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      {rec.targetId}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    ঔষধ: {rec.productName || 'সরকারি সরবরাহ'} · ব্যাচ: {rec.batchNumber || 'N/A'} · প্রয়োগকারী: {rec.administeredBy}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-emerald-800 font-bold">
                    {toBanglaNum(rec.dateAdministered, lang)}
                  </div>
                  {rec.nextDueDate && (
                    <div className="text-[10px] text-amber-800">
                      পরবর্তী: {toBanglaNum(rec.nextDueDate, lang)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECORD CARE EVENT MODAL */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>{isBn ? 'টিকা বা কৃমিনাশক প্রয়োগ লিপিবদ্ধ করুন' : 'Record Care Event'}</span>
              </h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-5 space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'সেবার ধরন' : 'Care Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecordCareType('vaccination')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      recordCareType === 'vaccination'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Syringe className="w-3.5 h-3.5" />
                    <span>{isBn ? 'টিকাদান (Vaccine)' : 'Vaccination'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecordCareType('deworming')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      recordCareType === 'deworming'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কৃমিনাশক (Deworming)' : 'Deworming'}</span>
                  </button>
                </div>
              </div>

              {/* Target selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'প্রাণী বা ফ্লক নির্বাচন করুন' : 'Select Animal / Flock'}
                </label>
                <select
                  value={recordTargetId}
                  onChange={(e) => setRecordTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <optgroup label={isBn ? 'স্বতন্ত্র প্রাণী' : 'Individual Animals'}>
                    {animals.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nameOrTag} ({a.id}) - {a.species}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={isBn ? 'পোল্ট্রি ফ্লক' : 'Poultry Flocks'}>
                    {flocks.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.batchName} ({f.id}) - {f.poultryType}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Disease or Vaccine Purpose with Quick Preset Pills */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  {isBn ? 'রোগ বা সেবার উদ্দেশ্য *' : 'Disease / Care Purpose *'}
                </label>
                <input
                  type="text"
                  value={recordDisease}
                  onChange={(e) => setRecordDisease(e.target.value)}
                  placeholder={isBn ? 'যেমন: খুরারোগ (FMD), পিপিআর, রাণীক্ষেত...' : 'e.g. FMD, PPR, Newcastle'}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none mb-2"
                />

                {/* Quick Preset Pills for Zero-Typing */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {recordCareType === 'vaccination'
                    ? [
                        'খুরারোগ (FMD)',
                        'গলাফুলা (HS)',
                        'তড়কা (Anthrax)',
                        'পিপিআর (PPR)',
                        'রাণীক্ষেত (BCRDV)',
                        'গামবোরো (IBD)',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setRecordDisease(item)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            recordDisease === item
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item}
                        </button>
                      ))
                    : [
                        'কলিজাকৃমিনাশক',
                        'গোলকৃমিনাশক',
                        'ফিতাকৃমিনাশক',
                        'মৌসুমী কৃমিনাশক পর্যালোচনা',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setRecordDisease(item)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            recordDisease === item
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                </div>
              </div>

              {/* Product and Batch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isBn ? 'ভ্যাকসিন / ওষুধের নাম' : 'Product Name'}
                  </label>
                  <input
                    type="text"
                    value={recordProduct}
                    onChange={(e) => setRecordProduct(e.target.value)}
                    placeholder="Aftovaxpur / LRI"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isBn ? 'ব্যাচ নম্বর (যদি থাকে)' : 'Batch No (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={recordBatch}
                    onChange={(e) => setRecordBatch(e.target.value)}
                    placeholder="FMD-24-..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Date Administered & Administered By */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isBn ? 'প্রয়োগের তারিখ' : 'Date Administered'}
                  </label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isBn ? 'প্রয়োগকারী কর্মকর্তা / খামারি' : 'Administered By'}
                  </label>
                  <input
                    type="text"
                    value={recordAdministeredBy}
                    onChange={(e) => setRecordAdministeredBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold min-h-[48px]"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs font-black shadow-md transition-all min-h-[48px]"
                >
                  {isBn ? '✓ রেকর্ড সংরক্ষণ করুন' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
