import React, { useState } from 'react';
import {
  AnimalProfile,
  FlockProfile,
  FarmProfile,
  CareRecord,
  ScheduledCareTask,
  HealthEventReport,
  Language,
  LivestockSpecies,
  PoultrySpecies,
} from '../types';
import { toBanglaNum } from '../translations';
import { AnimalDetailModal } from './AnimalDetailModal';
import { FlockDetailModal } from './FlockDetailModal';
import { IDCardModal } from './IDCardModal';
import { generateAnimalId, generateFlockId } from '../utils/careEngine';
import { ResilientImage } from './ui/ResilientImage';
import { PrivatePhotoField } from './ui/PrivatePhotoField';
import { getSpeciesFallbackImage, FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  Layers,
  PlusCircle,
  Search,
  QrCode,
  Sparkles,
  HeartPulse,
  Syringe,
  Pill,
  ChevronRight,
  Check,
  X,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AnimalsScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  careRecords: CareRecord[];
  scheduledTasks: ScheduledCareTask[];
  healthEvents: HealthEventReport[];
  lang: Language;
  isDemoActive: boolean;
  onAddAnimal: (newAnimal: AnimalProfile) => void;
  onAddFlock: (newFlock: FlockProfile) => void;
  onRecordMortality: (flockId: string, count: number) => void;
  onAskAIAboutAnimal: (animal: AnimalProfile) => void;
  onAskAIAboutFlock: (flock: FlockProfile) => void;
  onRequestVetForAnimal: (animal: AnimalProfile) => void;
  onRequestVetForFlock: (flock: FlockProfile) => void;
  onRecordCare: (targetId: string, type: 'vaccination' | 'deworming') => void;
}

export const AnimalsScreen: React.FC<AnimalsScreenProps> = ({
  farm,
  animals,
  flocks,
  careRecords,
  scheduledTasks,
  healthEvents,
  lang,
  isDemoActive,
  onAddAnimal,
  onAddFlock,
  onRecordMortality,
  onAskAIAboutAnimal,
  onAskAIAboutFlock,
  onRequestVetForAnimal,
  onRequestVetForFlock,
  onRecordCare,
}) => {
  const isBn = lang === 'bn';

  const [activeTab, setActiveTab] = useState<'individual' | 'flocks'>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciesFilter, setSelectedSpeciesFilter] = useState<string>('all');

  // Selected modals
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalProfile | null>(null);
  const [selectedFlock, setSelectedFlock] = useState<FlockProfile | null>(null);
  const [idCardTarget, setIdCardTarget] = useState<{
    item: AnimalProfile | FlockProfile;
    type: 'animal' | 'flock';
  } | null>(null);

  // Wizard Modals
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [isAddFlockOpen, setIsAddFlockOpen] = useState(false);

  // New Animal Form State (Minimal Typing UI)
  const [newAnimalSpecies, setNewAnimalSpecies] = useState<LivestockSpecies>('cattle');
  const [newAnimalName, setNewAnimalName] = useState('');
  const [newAnimalBreed, setNewAnimalBreed] = useState('');
  const [newAnimalSex, setNewAnimalSex] = useState<'male' | 'female'>('female');
  const [newAnimalAgeMonths, setNewAnimalAgeMonths] = useState(12);
  const [newAnimalTag, setNewAnimalTag] = useState('');
  const [newAnimalPhotoUrl, setNewAnimalPhotoUrl] = useState<string | undefined>();

  // New Flock Form State (Minimal Typing UI)
  const [newFlockType, setNewFlockType] = useState<PoultrySpecies>('chicken_broiler');
  const [newFlockBatchName, setNewFlockBatchName] = useState('');
  const [newFlockBirdCount, setNewFlockBirdCount] = useState(1000);
  const [newFlockPlacementDate, setNewFlockPlacementDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newFlockHousing, setNewFlockHousing] = useState<'litter_floor' | 'cages' | 'free_range'>('litter_floor');

  // Filtered lists
  const filteredAnimals = animals.filter((a) => {
    const matchesSpecies = selectedSpeciesFilter === 'all' || a.species === selectedSpeciesFilter;
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nameOrTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.tagNumber && a.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpecies && matchesSearch;
  });

  const filteredFlocks = flocks.filter((f) => {
    const matchesSpecies = selectedSpeciesFilter === 'all' || f.poultryType === selectedSpeciesFilter;
    const matchesSearch =
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.batchName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  // Handle Animal Submit
  const handleSaveNewAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = generateAnimalId(newAnimalSpecies, animals.length);
    const created: AnimalProfile = {
      id: newId,
      farmId: farm.id,
      species: newAnimalSpecies,
      nameOrTag: newAnimalName || `${newAnimalBreed || (newAnimalSpecies === 'cattle' ? 'গরু' : newAnimalSpecies === 'buffalo' ? 'মহিষ' : newAnimalSpecies === 'goat' ? 'ছাগল' : 'ভেড়া')} (${newId})`,
      tagNumber: newAnimalTag || undefined,
      breed: newAnimalBreed || (isBn ? 'দেশী উন্নত জাত' : 'Native cross'),
      sex: newAnimalSex,
      estimatedAgeMonths: Number(newAnimalAgeMonths) || 12,
      healthStatus: 'healthy',
      photoUrl: newAnimalPhotoUrl,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddAnimal(created);
    setIsAddAnimalOpen(false);
    setNewAnimalName('');
    setNewAnimalBreed('');
    setNewAnimalTag('');
    setNewAnimalPhotoUrl(undefined);
    setNewAnimalAgeMonths(12);
  };

  // Handle Flock Submit
  const handleSaveNewFlock = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = generateFlockId(flocks.length);
    const count = Number(newFlockBirdCount) || 500;
    const typeLabel = newFlockType === 'chicken_broiler' ? 'ব্রয়লার' : newFlockType === 'chicken_sonali' ? 'সোনালী' : newFlockType === 'chicken_layer' ? 'লেয়ার' : 'হাঁস';

    const created: FlockProfile = {
      id: newId,
      farmId: farm.id,
      poultryType: newFlockType,
      batchName: newFlockBatchName || `${typeLabel} ব্যাচ নং ${toBanglaNum(flocks.length + 1, lang)}`,
      initialBirdCount: count,
      currentBirdCount: count,
      placementDate: newFlockPlacementDate,
      ageDays: 1,
      purpose: newFlockType === 'chicken_layer' ? 'egg' : 'meat',
      housingType: newFlockHousing,
      mortalityCount: 0,
      healthStatus: 'normal',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddFlock(created);
    setIsAddFlockOpen(false);
    setNewFlockBatchName('');
    setNewFlockBirdCount(1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-cyan-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-800 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-cyan-700" />
            <span>{isBn ? 'প্রাণী ও পোল্ট্রি খতিয়ান' : 'Livestock & Flock Registry'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isBn ? 'আমার খামারের পশুপাখি' : 'My Registered Animals'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 tabular-nums">
            {isBn
              ? `${farm.name} · মোট গবাদিপশু: ${toBanglaNum(animals.length, lang)}টি, পোল্ট্রি ব্যাচ: ${toBanglaNum(flocks.length, lang)}টি`
              : `${farm.name} · ${animals.length} animals & ${flocks.length} poultry flocks`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddAnimalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-[#166534] hover:bg-emerald-900 active:scale-95 text-white text-xs font-black shadow-sm transition-all flex items-center gap-2 min-h-[48px] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>{isBn ? '+ নতুন প্রাণী যোগ' : '+ Add Animal'}</span>
          </button>
          <button
            onClick={() => setIsAddFlockOpen(true)}
            className="px-4 py-3 rounded-2xl bg-[#D97706] hover:bg-amber-700 active:scale-95 text-white text-xs font-black shadow-sm transition-all flex items-center gap-2 min-h-[48px] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-100" />
            <span>{isBn ? '+ পোল্ট্রি ব্যাচ যোগ' : '+ Add Flock'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Switcher & Large Species Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
        {/* Tab Switcher: Individual Animals vs Poultry Flocks */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('individual');
              setSelectedSpeciesFilter('all');
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              activeTab === 'individual'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🐄 {isBn ? 'গবাদিপশু (গরু, মহিষ, ছাগল, ভেড়া)' : 'Individual Animals'}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'individual' ? 'bg-white/20' : 'bg-slate-200 text-slate-800'}`}>
              {toBanglaNum(animals.length, lang)}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flocks');
              setSelectedSpeciesFilter('all');
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 min-h-[48px] ${
              activeTab === 'flocks'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🐓 {isBn ? 'পোল্ট্রি ব্যাচ (মুরগি ও হাঁস)' : 'Poultry Flocks'}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'flocks' ? 'bg-white/20' : 'bg-slate-200 text-slate-800'}`}>
              {toBanglaNum(flocks.length, lang)}
            </span>
          </button>
        </div>

        {/* Species Filter Tiles (Large Touch-Friendly) */}
        {activeTab === 'individual' && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedSpeciesFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                selectedSpeciesFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'সকল প্রাণী' : 'All'} ({toBanglaNum(animals.length, lang)})
            </button>
            <button
              onClick={() => setSelectedSpeciesFilter('cattle')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
                selectedSpeciesFilter === 'cattle'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🐄 {isBn ? 'গরু' : 'Cattle'}</span>
              <span className="text-[11px] opacity-80">({toBanglaNum(animals.filter(a => a.species === 'cattle').length, lang)})</span>
            </button>
            <button
              onClick={() => setSelectedSpeciesFilter('buffalo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
                selectedSpeciesFilter === 'buffalo'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🐃 {isBn ? 'মহিষ' : 'Buffalo'}</span>
              <span className="text-[11px] opacity-80">({toBanglaNum(animals.filter(a => a.species === 'buffalo').length, lang)})</span>
            </button>
            <button
              onClick={() => setSelectedSpeciesFilter('goat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
                selectedSpeciesFilter === 'goat'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🐐 {isBn ? 'ছাগল' : 'Goat'}</span>
              <span className="text-[11px] opacity-80">({toBanglaNum(animals.filter(a => a.species === 'goat').length, lang)})</span>
            </button>
            <button
              onClick={() => setSelectedSpeciesFilter('sheep')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
                selectedSpeciesFilter === 'sheep'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🐑 {isBn ? 'ভেড়া' : 'Sheep'}</span>
              <span className="text-[11px] opacity-80">({toBanglaNum(animals.filter(a => a.species === 'sheep').length, lang)})</span>
            </button>
          </div>
        )}

        {/* Search Input for Quick Lookup */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'নাম, আইডি বা ট্যাগ নম্বর দিয়ে খুঁজুন (যেমন: লাল বাহাদুর, KS-CAT)...' : 'Search by ID, name, or tag...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* 3. Cards Grid: Individual Animals */}
      {activeTab === 'individual' ? (
        filteredAnimals.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="text-4xl">🔍</div>
            <p className="text-slate-600 text-sm font-medium">
              {isBn ? 'এই ক্যাটাগরিতে কোনো প্রাণী পাওয়া যায়নি।' : 'No registered animals found.'}
            </p>
            <button
              onClick={() => setIsAddAnimalOpen(true)}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
            >
              {isBn ? 'নতুন প্রাণী যোগ করুন' : 'Add Animal'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnimals.map((animal) => {
              const latestVaccine = careRecords
                .filter((r) => r.targetId === animal.id && r.careType === 'vaccination')
                .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())[0];

              return (
                <div
                  key={animal.id}
                  className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-emerald-500/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Bar: ID and Health Status */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-xl border border-emerald-300">
                        {animal.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          animal.healthStatus === 'healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : animal.healthStatus === 'needs_attention'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {animal.healthStatus === 'healthy' ? (isBn ? '✓ সুস্থ ও ভালো' : 'Healthy') : (isBn ? 'নজর প্রয়োজন' : animal.healthStatus)}
                      </span>
                    </div>

                    {/* Animal Info with Avatar */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-18 h-18 rounded-2xl overflow-hidden bg-cyan-50 border border-cyan-200 shrink-0">
                        <ResilientImage
                          src={animal.photoUrl || getSpeciesFallbackImage(animal.species).src}
                          fallbackSrc={getSpeciesFallbackImage(animal.species).src}
                          alt={animal.nameOrTag}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h3 className="font-black text-slate-900 text-lg leading-tight truncate">
                          {animal.nameOrTag}
                        </h3>
                        <div className="text-xs font-semibold text-slate-700 truncate">
                          {animal.breed}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {animal.sex === 'male' ? (isBn ? 'পুরুষ ষাঁড়/খাসি' : 'Male') : (isBn ? 'স্ত্রী গাভী/ছাগী' : 'Female')} · {toBanglaNum(animal.estimatedAgeMonths, lang)} {isBn ? 'মাস বয়স' : 'mo'}
                        </div>
                        {animal.tagNumber && (
                          <div className="text-[11px] font-mono text-emerald-800 font-semibold">
                            ট্যাগ: {animal.tagNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mini Vaccination Status Pill */}
                    {latestVaccine && (
                      <div
                        className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-xl border ${
                          latestVaccine.status === 'missed'
                            ? 'bg-rose-50 text-rose-900 border-rose-200'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {latestVaccine.status === 'missed' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">
                          <strong>{latestVaccine.status === 'missed' ? (isBn ? 'মিস:' : 'Missed:') : (isBn ? 'সর্বশেষ টিকা:' : 'Last Vaccine:')}</strong>{' '}
                          {latestVaccine.diseaseOrTarget}
                        </span>
                      </div>
                    )}
                  </div>

                {/* Tactile Action Bar for Rural Farmers */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => onRecordCare(animal.id, 'vaccination')}
                    className="px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1 min-h-[40px]"
                    title={isBn ? 'টিকা দিন' : 'Vaccinate'}
                  >
                    <span>💉 {isBn ? 'টিকা' : 'Vaccine'}</span>
                  </button>

                  <button
                    onClick={() => onRecordCare(animal.id, 'deworming')}
                    className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 text-xs font-bold transition-all flex items-center gap-1 min-h-[40px]"
                    title={isBn ? 'কৃমিনাশক খাওয়ান' : 'Deworm'}
                  >
                    <span>💊 {isBn ? 'কৃমি' : 'Deworm'}</span>
                  </button>

                  <button
                    onClick={() => setIdCardTarget({ item: animal, type: 'animal' })}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                    title={isBn ? 'ডিজিটাল কার্ড' : 'Card'}
                  >
                    <QrCode className="w-4 h-4 text-slate-700" />
                  </button>

                  <button
                    onClick={() => setSelectedAnimal(animal)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1 min-h-[40px]"
                  >
                    <span>{isBn ? 'ফাইল' : 'Profile'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )
      ) : (
        /* Poultry Flocks Tab */
        filteredFlocks.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="text-4xl">🐓</div>
            <p className="text-slate-600 text-sm font-medium">
              {isBn ? 'কোনো পোল্ট্রি ফ্লক পাওয়া যায়নি।' : 'No flocks found.'}
            </p>
            <button
              onClick={() => setIsAddFlockOpen(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
            >
              {isBn ? 'নতুন পোল্ট্রি ব্যাচ যোগ করুন' : 'Add Flock'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFlocks.map((flock) => {
              const latestFlockVaccine = careRecords
                .filter((r) => r.targetId === flock.id && r.careType === 'vaccination')
                .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())[0];

              return (
                <div
                  key={flock.id}
                  className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-300">
                        {flock.id}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {isBn ? 'সক্রিয় ব্যাচ' : flock.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-18 h-18 rounded-2xl bg-amber-100/70 border border-amber-200 overflow-hidden shrink-0">
                        <ResilientImage
                          src={flock.poultryType === 'duck' ? FARM_VISUAL_ASSETS.waterFeedCare : FARM_VISUAL_ASSETS.poultryBiosecurity}
                          alt={flock.batchName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h3 className="font-black text-slate-900 text-lg leading-tight truncate">
                          {flock.batchName}
                        </h3>
                        <div className="text-xs font-bold text-slate-800">
                          {toBanglaNum(flock.currentBirdCount, lang)} {isBn ? 'টি জীবিত পাখি' : 'live birds'}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {isBn ? `বয়স: ${toBanglaNum(flock.ageDays, lang)} দিন` : `${flock.ageDays} days old`} · {flock.housingType === 'litter_floor' ? 'তুষের লিটার' : 'খাঁচা'}
                        </div>
                        <div className="text-[11px] text-rose-700 font-semibold">
                          {isBn ? `মোট মৃত্যু: ${toBanglaNum(flock.mortalityCount, lang)}টি` : `Mortality: ${flock.mortalityCount}`}
                        </div>
                      </div>
                    </div>

                    {/* Mini Vaccination Status Pill */}
                    {latestFlockVaccine && (
                      <div
                        className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-xl border ${
                          latestFlockVaccine.status === 'missed'
                            ? 'bg-rose-50 text-rose-900 border-rose-200'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {latestFlockVaccine.status === 'missed' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="truncate">
                          <strong>{latestFlockVaccine.status === 'missed' ? (isBn ? 'মিস:' : 'Missed:') : (isBn ? 'সর্বশেষ টিকা:' : 'Last Vaccine:')}</strong>{' '}
                          {latestFlockVaccine.diseaseOrTarget}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tactile Action Bar for Flock */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onRecordCare(flock.id, 'vaccination')}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1 min-h-[40px]"
                    >
                      <span>💉 {isBn ? 'টিকা দিন' : 'Vaccine'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedFlock(flock)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1 min-h-[40px] ml-auto"
                    >
                      <span>{isBn ? 'বিস্তারিত খতিয়ান' : 'Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* MODAL: ADD ANIMAL WIZARD (Minimal Typing - Large Visual Selectors) */}
      {isAddAnimalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-700" />
                <span>{isBn ? 'নতুন প্রাণী নিবন্ধন (গরু, মহিষ, ছাগল বা ভেড়া)' : 'Register New Livestock'}</span>
              </h3>
              <button
                onClick={() => setIsAddAnimalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAnimal} className="p-5 space-y-4 overflow-y-auto">
              {/* Species Tap Tiles */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {isBn ? '১. প্রাণীর প্রজাতি নির্বাচন করুন *' : '1. Select Species *'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cattle', nameBn: 'গরু', icon: '🐄' },
                    { id: 'buffalo', nameBn: 'মহিষ', icon: '🐃' },
                    { id: 'goat', nameBn: 'ছাগল', icon: '🐐' },
                    { id: 'sheep', nameBn: 'ভেড়া', icon: '🐑' },
                  ].map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setNewAnimalSpecies(sp.id as LivestockSpecies)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                        newAnimalSpecies === sp.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{sp.icon}</span>
                      <span className="text-xs">{sp.nameBn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sex Tap Tiles */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {isBn ? '২. লিঙ্গ নির্বাচন করুন *' : '2. Sex *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAnimalSex('female')}
                    className={`py-3 px-4 rounded-2xl border-2 text-center transition-all font-bold text-xs ${
                      newAnimalSex === 'female'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    ♀ {isBn ? 'স্ত্রী (গাভী / ছাগী / বকনা)' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAnimalSex('male')}
                    className={`py-3 px-4 rounded-2xl border-2 text-center transition-all font-bold text-xs ${
                      newAnimalSex === 'male'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    ♂ {isBn ? 'পুরুষ (ষাঁড় / খাসি / দামড়া)' : 'Male'}
                  </button>
                </div>
              </div>

              {/* Age Presets & Stepper (No Typing Needed) */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {isBn ? '৩. বয়স নির্বাচন করুন (মাসে) *' : '3. Estimated Age (Months) *'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewAnimalAgeMonths((prev) => Math.max(1, prev - 1))}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center font-bold text-slate-800 text-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center font-black text-slate-900 text-lg">
                    {toBanglaNum(newAnimalAgeMonths, lang)} {isBn ? 'মাস' : 'months'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewAnimalAgeMonths((prev) => prev + 1)}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center font-bold text-slate-800 text-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Age Pills */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[6, 12, 18, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setNewAnimalAgeMonths(m)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        newAnimalAgeMonths === m
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {toBanglaNum(m, lang)}ম
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Ear Tag (Optional) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isBn ? 'নাম বা পরিচয় (ঐচ্ছিক)' : 'Name / Tag'}
                  </label>
                  <input
                    type="text"
                    value={newAnimalName}
                    onChange={(e) => setNewAnimalName(e.target.value)}
                    placeholder={isBn ? 'যেমন: লাল বাহাদুর' : 'e.g. Lal Bahadur'}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isBn ? 'কানের ট্যাগ নম্বর (যদি থাকে)' : 'Ear Tag (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newAnimalTag}
                    onChange={(e) => setNewAnimalTag(e.target.value)}
                    placeholder="BD-HBJ-..."
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <PrivatePhotoField
                alt={newAnimalName || (isBn ? 'প্রাণীর ছবি' : 'Animal photo')}
                disabled={isDemoActive}
                lang={lang}
                onChange={setNewAnimalPhotoUrl}
                value={newAnimalPhotoUrl}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAnimalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold min-h-[48px]"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs font-black shadow-md transition-all min-h-[48px]"
                >
                  {isBn ? '✓ আইডি তৈরি ও সংরক্ষণ' : 'Generate ID & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FLOCK WIZARD (Minimal Typing - Preset Tiles) */}
      {isAddFlockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-600" />
                <span>{isBn ? 'নতুন পোল্ট্রি ফ্লক/ব্যাচ নিবন্ধন' : 'Register Poultry Flock'}</span>
              </h3>
              <button
                onClick={() => setIsAddFlockOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewFlock} className="p-5 space-y-4 overflow-y-auto">
              {/* Poultry Type Tiles */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {isBn ? '১. পোল্ট্রির প্রকার নির্বাচন করুন *' : '1. Poultry Type *'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'chicken_broiler', nameBn: 'ব্রয়লার', icon: '🍗' },
                    { id: 'chicken_sonali', nameBn: 'সোনালী', icon: '🥚' },
                    { id: 'chicken_layer', nameBn: 'লেয়ার', icon: '🐔' },
                    { id: 'duck', nameBn: 'হাঁস', icon: '🦆' },
                  ].map((pt) => (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => setNewFlockType(pt.id as PoultrySpecies)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                        newFlockType === pt.id
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-black shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{pt.icon}</span>
                      <span className="text-xs">{pt.nameBn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bird Count Presets & Stepper */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {isBn ? '২. বাচ্চার সংখ্যা *' : '2. Chick / Bird Count *'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewFlockBirdCount((prev) => Math.max(50, prev - 100))}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center font-bold text-slate-800 text-lg"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center font-black text-slate-900 text-lg">
                    {toBanglaNum(newFlockBirdCount, lang)} {isBn ? 'টি বাচ্চা' : 'birds'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewFlockBirdCount((prev) => prev + 100)}
                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center font-bold text-slate-800 text-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Count Pills */}
                <div className="flex items-center gap-2 mt-2">
                  {[500, 1000, 1200, 2000].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setNewFlockBirdCount(cnt)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        newFlockBirdCount === cnt
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {toBanglaNum(cnt, lang)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Housing System */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  {isBn ? '৩. বাসস্থান পদ্ধতি' : '3. Housing System'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFlockHousing('litter_floor')}
                    className={`py-3 px-3 rounded-2xl border-2 text-center text-xs font-bold ${
                      newFlockHousing === 'litter_floor'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-black'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    🌾 {isBn ? 'তুষের মেঝে (Deep Litter)' : 'Deep Litter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFlockHousing('cages')}
                    className={`py-3 px-3 rounded-2xl border-2 text-center text-xs font-bold ${
                      newFlockHousing === 'cages'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-black'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    🏗️ {isBn ? 'মাচা / খাঁচা (Cages)' : 'Slatted / Cages'}
                  </button>
                </div>
              </div>

              {/* Batch Name (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isBn ? 'ব্যাচের নাম (ঐচ্ছিক)' : 'Batch Name'}
                </label>
                <input
                  type="text"
                  value={newFlockBatchName}
                  onChange={(e) => setNewFlockBatchName(e.target.value)}
                  placeholder={isBn ? 'যেমন: ব্রয়লার ব্যাচ ০৫' : 'e.g. Broiler Batch 05'}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFlockOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold min-h-[48px]"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white rounded-2xl text-xs font-black shadow-md transition-all min-h-[48px]"
                >
                  {isBn ? '✓ ফ্লক আইডি তৈরি ও সংরক্ষণ' : 'Generate Batch ID & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INDIVIDUAL ANIMAL DETAIL */}
      <AnimalDetailModal
        animal={selectedAnimal}
        farm={farm}
        careRecords={careRecords}
        scheduledTasks={scheduledTasks}
        healthEvents={healthEvents}
        isOpen={Boolean(selectedAnimal)}
        onClose={() => setSelectedAnimal(null)}
        lang={lang}
        onAskAIAboutAnimal={onAskAIAboutAnimal}
        onRequestVetForAnimal={onRequestVetForAnimal}
        onRecordCare={onRecordCare}
      />

      {/* MODAL: FLOCK DETAIL */}
      <FlockDetailModal
        flock={selectedFlock}
        farm={farm}
        careRecords={careRecords}
        scheduledTasks={scheduledTasks}
        isOpen={Boolean(selectedFlock)}
        onClose={() => setSelectedFlock(null)}
        lang={lang}
        onAskAIAboutFlock={onAskAIAboutFlock}
        onRequestVetForFlock={onRequestVetForFlock}
        onRecordMortality={onRecordMortality}
        onRecordCare={onRecordCare}
      />

      {/* MODAL: DIGITAL ID CARD (PRINTABLE) */}
      {idCardTarget && (
        <IDCardModal
          item={idCardTarget.item}
          farm={farm}
          type={idCardTarget.type}
          isOpen={Boolean(idCardTarget)}
          onClose={() => setIdCardTarget(null)}
          lang={lang}
        />
      )}
    </div>
  );
};
