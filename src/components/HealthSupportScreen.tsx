import React, { useState, useEffect } from 'react';
import {
  VetConsultationRequest,
  AnimalProfile,
  FlockProfile,
  FarmProfile,
  Language,
  NavScreen,
  KhamarBondhuMessage,
} from '../types';
import { VetServicesScreen } from './VetServicesScreen';
import { AIAssistantScreen } from './AIAssistantScreen';
import {
  Stethoscope,
  MessageCircle,
  HeartPulse,
  Phone,
  Smartphone,
} from 'lucide-react';
import {
  KHAMAR_CONTACT_CONFIG,
  getKhamarPhoneDisplay,
  getKhamarUssdDisplay,
  getKhamarUssdShortLabel,
} from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';

interface HealthSupportScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  requests: VetConsultationRequest[];
  lang: Language;
  initialSubTab?: 'vet' | 'bondhu';
  onSubTabChange?: (tab: 'vet' | 'bondhu') => void;
  presetAnimal?: AnimalProfile | null;
  selectedContextTarget?: { id: string; name: string; species: string } | null;
  onSubmitRequest: (newReq: VetConsultationRequest) => void;
  onNavigate: (screen: NavScreen, topicKey?: string) => void;
  chatMessages?: KhamarBondhuMessage[];
  onUpdateChatMessages?: React.Dispatch<React.SetStateAction<KhamarBondhuMessage[]>>;
  onResetChatMessages?: () => void;
  isJudgeDemoActive?: boolean;
}

export const HealthSupportScreen: React.FC<HealthSupportScreenProps> = ({
  farm,
  animals,
  flocks,
  requests,
  lang,
  initialSubTab = 'vet',
  onSubTabChange,
  presetAnimal,
  selectedContextTarget,
  onSubmitRequest,
  onNavigate,
  chatMessages,
  onUpdateChatMessages,
  onResetChatMessages,
  isJudgeDemoActive = false,
}) => {
  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'vet' | 'bondhu'>(initialSubTab);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  const handleTabSwitch = (tab: 'vet' | 'bondhu') => {
    setActiveTab(tab);
    onSubTabChange?.(tab);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-12">
      {/* Header Hub Switcher */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-800 text-xs font-extrabold mb-1">
              <HeartPulse className="w-4 h-4 text-cyan-700" />
              <span>{isBn ? 'খামারির স্বাস্থ্য সহায়তা কেন্দ্র' : 'Farmer Health Support Center'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {isBn ? 'পশুচিকিৎসা ও খামার বন্ধু সহায়তা' : 'Veterinary Care & Khamar Bondhu'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isBn
                ? 'প্রাণী অসুস্থ হলে নিবন্ধিত পশুচিকিৎসকের পরামর্শ চান, অথবা দৈনন্দিন যত্ন বুঝতে খামার বন্ধুর সাহায্য নিন।'
                : 'Consult a veterinarian for sick animals, or ask Khamar Bondhu for simple care guides.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-cyan-50/70 p-1.5 rounded-2xl border border-cyan-100 shrink-0">
            <button
              onClick={() => handleTabSwitch('vet')}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'vet'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'পশুচিকিৎসা সেবা' : 'Veterinary Care'}</span>
            </button>

            <button
              onClick={() => handleTabSwitch('bondhu')}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'bondhu'
                  ? 'bg-[#166534] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'খামার বন্ধু' : 'Khamar Bondhu'}</span>
            </button>
          </div>
        </div>

        {/* Khamar Shurokkha Direct Contact & Official USSD Callout */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs text-emerald-950">
            <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-black">
                {isBn
                  ? `খামার সুরক্ষা সহায়তা নম্বর: ${getKhamarPhoneDisplay(lang)}`
                  : `Khamar Shurokkha Contact: ${getKhamarPhoneDisplay(lang)}`}
              </p>
              <p className="text-[11px] text-emerald-900">
                {isBn
                  ? `অফিসিয়াল USSD কোড: ${getKhamarUssdDisplay(lang)} · ইন্টারনেট ছাড়া ফিচার ফোনে খামার সুরক্ষা তথ্য ও সহায়তার জন্য নির্ধারিত।`
                  : `Official USSD Code: ${getKhamarUssdDisplay(lang)} · Planned offline feature-phone access for Khamar Shurokkha farm protection services.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <KhamarContactCallAction
              lang={lang}
              labelBn={
                KHAMAR_CONTACT_CONFIG.isPhoneConfigured
                  ? `কল: ${KHAMAR_CONTACT_CONFIG.officialPhone}`
                  : `কল (${KHAMAR_CONTACT_CONFIG.placeholderPhone})`
              }
              labelEn={
                KHAMAR_CONTACT_CONFIG.isPhoneConfigured
                  ? `Call: ${KHAMAR_CONTACT_CONFIG.officialPhone}`
                  : `Call (${KHAMAR_CONTACT_CONFIG.placeholderPhone})`
              }
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onNavigate('ussd_simulator')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>
                {isBn
                  ? `USSD সেবা (${getKhamarUssdShortLabel()})`
                  : `USSD Service (${getKhamarUssdShortLabel()})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Selected Service Tab */}
      {activeTab === 'vet' ? (
        <VetServicesScreen
          farm={farm}
          animals={animals}
          flocks={flocks}
          requests={requests}
          lang={lang}
          onSubmitRequest={onSubmitRequest}
          presetAnimal={presetAnimal}
        />
      ) : (
        <AIAssistantScreen
          farm={farm}
          animals={animals}
          flocks={flocks}
          lang={lang}
          onNavigate={onNavigate}
          selectedContextTarget={selectedContextTarget}
          messages={chatMessages}
          onUpdateMessages={onUpdateChatMessages}
          onResetMessages={onResetChatMessages}
          isJudgeDemoActive={isJudgeDemoActive}
        />
      )}
    </div>
  );
};
