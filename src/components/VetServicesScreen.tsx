import React, { useState } from 'react';
import {
  VetConsultationRequest,
  AnimalProfile,
  FlockProfile,
  FarmProfile,
  Language,
  ConsultationStatus,
} from '../types';
import { toBanglaNum } from '../translations';
import { StatusBadge } from './ui/StatusBadge';
import { ResilientImage } from './ui/ResilientImage';
import { PrivatePhotoField } from './ui/PrivatePhotoField';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  KHAMAR_CONTACT_CONFIG,
  getKhamarPhoneShortLabel,
  getKhamarUssdShortLabel,
} from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';
import {
  HeartPulse,
  PhoneCall,
  Video,
  MapPin,
  Clock,
  PlusCircle,
  User,
  ShieldCheck,
  Building2,
  X,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface VetServicesScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  requests: VetConsultationRequest[];
  lang: Language;
  isDemoActive: boolean;
  onSubmitRequest: (newReq: VetConsultationRequest) => void;
  presetAnimal?: AnimalProfile | null;
}

const SYMPTOM_CHIPS_BN = [
  'খাবার খাচ্ছে না',
  'জ্বর বা গা গরম',
  'পাতলা পায়খানা',
  'শ্বাসকষ্ট বা কাশি',
  'দুধ বা ডিম কমেছে',
  'ঝিমানো বা দুর্বল',
];

const SYMPTOM_CHIPS_EN = [
  'Not eating',
  'Fever',
  'Diarrhea',
  'Breathing trouble',
  'Drop in milk/eggs',
  'Dull or weak',
];

export const VetServicesScreen: React.FC<VetServicesScreenProps> = ({
  farm,
  animals,
  flocks,
  requests,
  lang,
  isDemoActive,
  onSubmitRequest,
  presetAnimal,
}) => {
  const isBn = lang === 'bn';

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(Boolean(presetAnimal));
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    presetAnimal?.id || animals[0]?.id || flocks[0]?.id || ''
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [consultType, setConsultType] = useState<'phone_call' | 'online_consultation' | 'in_person_visit'>('phone_call');
  const [selectedHospital, setSelectedHospital] = useState('vet_demo_01');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState('সকাল ৯টা – দুপুর ১টা');
  const [consultDesc, setConsultDesc] = useState('');
  const [consultPhotoUrl, setConsultPhotoUrl] = useState<string | undefined>();
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // Explicitly labeled Demo Veterinary Directory for Khamar Shurokkha support (no fake verified claims)
  const localVetDirectory = [
    {
      id: 'vet_demo_01',
      name: 'খামার সুরক্ষা প্রাথমিক পশুচিকিৎসা ডেস্ক (নমুনা)',
      title: 'খামার সুরক্ষা পশুস্বাস্থ্য পরামর্শ প্রোফাইল',
      hospital: `খামার সুরক্ষা আঞ্চলিক সহায়তা কেন্দ্র — ${farm.upazila.split('(')[0].trim()}`,
      bvcStatusBn: 'নমুনা প্রোফাইল — নিবন্ধিত ভেট তালিকাভুক্তি যুক্ত হচ্ছে',
      bvcStatusEn: 'Demo Profile — Partner vet verification pending',
      hours: 'সকাল ৯:০০ - বিকাল ৫:০০',
      isDemo: true,
    },
    {
      id: 'vet_demo_02',
      name: 'খামার সুরক্ষা বিশেষজ্ঞ পরামর্শ ডেস্ক (নমুনা)',
      title: 'খামার সুরক্ষা জরুরি ও ফলোআপ সহায়তা',
      hospital: `খামার সুরক্ষা জেলা সহায়তা ডেস্ক — ${farm.district.split('(')[0].trim()}`,
      bvcStatusBn: 'নমুনা প্রোফাইল — নিবন্ধিত ভেট তালিকাভুক্তি যুক্ত হচ্ছে',
      bvcStatusEn: 'Demo Profile — Partner vet verification pending',
      hours: 'সকাল ৯:০০ - রাত ৮:০০',
      isDemo: true,
    },
  ];

  const toggleSymptom = (chip: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(chip) ? prev.filter((s) => s !== chip) : [...prev, chip]
    );
  };

  const getStatusDisplay = (status: ConsultationStatus) => {
    switch (status) {
      case 'submitted':
        return {
          variant: 'upcoming' as const,
          labelBn: 'অনুরোধ জমা হয়েছে',
          labelEn: 'Request Submitted',
        };
      case 'waiting_review':
        return {
          variant: 'due_soon' as const,
          labelBn: 'ডাক্তারের উত্তরের অপেক্ষায়',
          labelEn: 'Awaiting Doctor Response',
        };
      case 'accepted':
      case 'scheduled':
      case 'confirmed':
        return {
          variant: 'confirmed' as const,
          labelBn: 'সময় নিশ্চিত হয়েছে',
          labelEn: 'Confirmed',
        };
      case 'rescheduled':
        return {
          variant: 'rescheduled' as const,
          labelBn: 'সময় পরিবর্তন হয়েছে',
          labelEn: 'Rescheduled',
        };
      case 'cancelled':
        return {
          variant: 'overdue' as const,
          labelBn: 'বাতিল হয়েছে',
          labelEn: 'Cancelled',
        };
      case 'completed':
        return {
          variant: 'completed' as const,
          labelBn: 'পরামর্শ সম্পন্ন',
          labelEn: 'Completed',
        };
      default:
        return {
          variant: 'upcoming' as const,
          labelBn: 'অনুরোধ জমা হয়েছে',
          labelEn: 'Request Submitted',
        };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAnimal = animals.find((a) => a.id === selectedTargetId);
    const targetFlock = flocks.find((f) => f.id === selectedTargetId);
    const matchedCenter = localVetDirectory.find((v) => v.id === selectedHospital);

    const targetName = targetAnimal
      ? targetAnimal.nameOrTag
      : targetFlock
      ? targetFlock.batchName
      : farm.name;

    const reasonText =
      selectedSymptoms.length > 0
        ? selectedSymptoms.join(', ')
        : isBn
        ? 'সাধারণ পশুস্বাস্থ্য পরামর্শ'
        : 'General Veterinary Advice';

    const newReq: VetConsultationRequest = {
      id: `VET-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      farmId: farm.id,
      targetType: targetAnimal ? 'animal' : 'flock',
      targetId: selectedTargetId || farm.id,
      targetName,
      species: targetAnimal ? targetAnimal.species : targetFlock ? targetFlock.poultryType : farm.speciesPresent[0] || 'cattle',
      consultationType: consultType,
      urgency,
      preferredTimeWindow,
      symptoms: selectedSymptoms,
      reason: reasonText,
      description:
        consultDesc.trim() ||
        (isBn ? 'খামারি কর্তৃক প্রাথমিক তথ্য ও লক্ষণ জমা দেওয়া হয়েছে।' : 'Submitted by farmer with symptoms.'),
      photoUrl: consultPhotoUrl,
      status: 'submitted',
      assignedVet: matchedCenter
        ? {
            name: matchedCenter.name,
            title: matchedCenter.title,
            hospital: matchedCenter.hospital,
            phone: KHAMAR_CONTACT_CONFIG.isPhoneConfigured
              ? KHAMAR_CONTACT_CONFIG.officialPhone
              : getKhamarPhoneShortLabel(lang),
            vetVerificationStatus: 'demo_example',
          }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    onSubmitRequest(newReq);
    setIsRequestModalOpen(false);
    setConsultDesc('');
    setConsultPhotoUrl(undefined);
    setSelectedSymptoms([]);
    setSubmittedNotice(
      isBn
        ? `আপনার অনুরোধ (${newReq.id}) জমা হয়েছে। এটি এখনো স্বয়ংক্রিয়ভাবে কনফার্ম করা হয়নি — নিচের তালিকায় স্থিতি দেখতে পারবেন।`
        : `Your request (${newReq.id}) was submitted as a record. Real clinic confirmation requires live integration.`
    );
    setTimeout(() => setSubmittedNotice(null), 6000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-cyan-700" />
              <span>{isBn ? 'পশুচিকিৎসকের পরামর্শ ও অ্যাপয়েন্টমেন্ট অনুরোধ' : 'Veterinary Consultation Requests'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isBn
                ? 'আক্রান্ত প্রাণী বা ফ্লকের লক্ষণ জানিয়ে পরামর্শের অনুরোধ পাঠান এবং বর্তমান অবস্থা দেখুন।'
                : 'Submit symptoms for your animal or flock and track request status honestly.'}
            </p>
          </div>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs sm:text-sm font-extrabold shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBn ? 'নতুন পরামর্শের অনুরোধ পাঠান' : 'Request Consultation'}</span>
          </button>
        </div>

        {/* General Illustrative Farm Consultation Banner (Never used as individual practitioner photo) */}
        <div className="relative rounded-2xl overflow-hidden border border-cyan-100 bg-cyan-50/40">
          <ResilientImage
            src={FARM_VISUAL_ASSETS.vetConsultation}
            alt={isBn ? 'খামারে পশুচিকিৎসকের সাধারণ পরামর্শের দৃশ্য (উদাহরণ ছবি)' : 'Illustrative scene of veterinary farm consultation'}
            className="w-full h-36 sm:h-44 object-cover"
          />
          <div className="px-3.5 py-2 bg-slate-900/80 text-white text-[11px] font-semibold flex flex-wrap items-center justify-between gap-2">
            <span>
              {isBn
                ? 'খামারে প্রাথমিক স্বাস্থ্য পরীক্ষা ও পরামর্শের সাধারণ দৃশ্য (প্রতীকী ছবি)'
                : 'Illustrative farm veterinary checkup scene (not a real practitioner profile)'}
            </span>
            <span className="text-cyan-200 font-bold">
              {isBn ? 'লক্ষণ পাঠান → অবস্থা জানুন' : 'Submit Signs → Track Request'}
            </span>
          </div>
        </div>
      </div>

      {submittedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>{submittedNotice}</span>
        </div>
      )}

      {/* Honest Transparency Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-black block">
            {isBn
              ? 'স্বচ্ছতা ও ডেমো ডিরেক্টরি তথ্য:'
              : 'Transparency & Demo Directory Notice:'}
          </span>
          <p className="leading-relaxed">
            {isBn
              ? `অনুরোধ জমা দিলে তা প্রথমে “অনুরোধ জমা হয়েছে” হিসেবে সংরক্ষিত হয় — কোনো ভুয়া তাৎক্ষণিক ডাক্তার কনফার্মেশন দেখানো হয় না। জরুরি পশুস্বাস্থ্য সহায়তায় খামার সুরক্ষা যোগাযোগ নম্বর (${getKhamarPhoneShortLabel(lang)}) অথবা USSD কোড (${getKhamarUssdShortLabel()}) ব্যবহার করুন।`
              : `Submitting a request records it honestly as "Request Submitted" without faking doctor confirmation. For urgent support, use Khamar Shurokkha's contact (${getKhamarPhoneShortLabel(lang)}) or official USSD (${getKhamarUssdShortLabel()}).`}
          </p>
        </div>
      </div>

      {/* Consultation Requests Trackers */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-900">
          {isBn ? 'আপনার পাঠানো পরামর্শের অনুরোধসমূহ' : 'Your Submitted Requests'}
        </h3>

        {requests.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs font-semibold">
            {isBn ? 'এখনো কোনো পরামর্শের অনুরোধ পাঠানো হয়নি।' : 'No consultation requests submitted yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const st = getStatusDisplay(req.status);
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-600">{req.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-extrabold text-slate-900 text-sm">{req.targetName}</span>
                      {req.urgency === 'urgent' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-rose-700 font-extrabold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{isBn ? 'জরুরি' : 'Urgent'}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <StatusBadge
                      variant={st.variant}
                      label={isBn ? st.labelBn : st.labelEn}
                      size="sm"
                      lang={lang}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1 text-slate-700">
                      <p>
                        <strong className="text-slate-900">{isBn ? 'কারণ/লক্ষণ: ' : 'Symptoms: '}</strong>
                        {req.reason}
                      </p>
                      <p>
                        <strong className="text-slate-900">{isBn ? 'বিবরণ: ' : 'Details: '}</strong>
                        {req.description}
                      </p>
                      {req.photoUrl && (
                        <div className="mt-2 h-32 w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <ResilientImage
                            alt={isBn ? `${req.targetName} পশুচিকিৎসা অনুরোধের ছবি` : `Photo for ${req.targetName} vet request`}
                            className="h-full w-full object-cover"
                            src={req.photoUrl}
                          />
                        </div>
                      )}
                      <p>
                        <strong className="text-slate-900">{isBn ? 'মাধ্যম ও সময়: ' : 'Mode & Time: '}</strong>
                        {req.consultationType === 'phone_call'
                          ? (isBn ? 'ফোন কল' : 'Phone Call')
                          : req.consultationType === 'online_consultation'
                          ? (isBn ? 'ভিডিও কল' : 'Video')
                          : (isBn ? 'খামার পরিদর্শন' : 'Farm Visit')}
                        {req.preferredTimeWindow ? ` · ${req.preferredTimeWindow}` : ''}
                      </p>
                    </div>

                    {req.assignedVet && (
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="font-bold flex items-center gap-1.5 text-slate-900">
                          <User className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{req.assignedVet.name}</span>
                        </div>
                        <p className="text-slate-600">{req.assignedVet.hospital}</p>
                        <p className="text-[11px] font-bold text-amber-800">
                          {req.assignedVet.vetVerificationStatus === 'bvc_verified' && req.assignedVet.bvcNumber
                            ? `BVC #${req.assignedVet.bvcNumber}`
                            : isBn
                            ? 'ডেমো ডিরেক্টরি — BVC যাচাই যুক্ত হওয়া বাকি'
                            : 'Demo example — BVC verification pending'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Nearby Centers Directory (Clearly Labeled Demo) */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900">
            {isBn ? 'খামার সুরক্ষা পশুস্বাস্থ্য সহায়তা ডেস্ক (নমুনা)' : 'Khamar Shurokkha Vet Support Desks (Demo)'}
          </h3>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
            {isBn ? 'ডেমো উদাহরণ — লাইভ BVC যাচাই যুক্ত হওয়া বাকি' : 'Demo Examples — BVC Verification Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localVetDirectory.map((vet) => (
            <div
              key={vet.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-800 border border-cyan-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">{vet.name}</h4>
                  <p className="text-xs text-slate-600">{vet.hospital}</p>
                  <p className="text-[11px] font-bold text-amber-800">
                    {isBn ? vet.bvcStatusBn : vet.bvcStatusEn}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{vet.hours}</span>
                </span>
                <KhamarContactCallAction
                  lang={lang}
                  labelBn={`কল: ${getKhamarPhoneShortLabel(lang)}`}
                  labelEn={`Call: ${getKhamarPhoneShortLabel(lang)}`}
                  className="font-extrabold text-[#166534] hover:underline inline-flex items-center gap-1 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: GUIDED 8-STEP FARMER CONSULTATION FORM */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 max-h-[92vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-950 text-white">
              <h3 className="font-black text-base flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-300" />
                <span>{isBn ? 'পশুচিকিৎসকের পরামর্শ অনুরোধ ফরম' : 'Vet Consultation Request Form'}</span>
              </h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="min-w-[44px] min-h-[44px] rounded-full text-emerald-200 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm">
              {/* Step 1: Select Animal / Flock */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  {isBn ? '১. কোন প্রাণী বা ফ্লকের জন্য সাহায্য চান?' : '1. Select Animal or Flock'}
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 outline-none bg-white"
                >
                  {animals.length > 0 && (
                    <optgroup label={isBn ? 'প্রাণীসমূহ' : 'Animals'}>
                      {animals.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nameOrTag} ({a.id})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {flocks.length > 0 && (
                    <optgroup label={isBn ? 'পোল্ট্রি ফ্লক' : 'Poultry Flocks'}>
                      {flocks.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.batchName} ({toBanglaNum(f.currentBirdCount, lang)} {isBn ? 'টি পাখি' : 'birds'})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {animals.length === 0 && flocks.length === 0 && (
                    <option value={farm.id}>{farm.name}</option>
                  )}
                </select>
              </div>

              {/* Step 2: Select Problem / Symptom Chips */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  {isBn ? '২. কী লক্ষণ দেখছেন? (ট্যাপ করে বেছে নিন)' : '2. Select Observed Signs'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(isBn ? SYMPTOM_CHIPS_BN : SYMPTOM_CHIPS_EN).map((chip) => {
                    const active = selectedSymptoms.includes(chip);
                    return (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => toggleSymptom(chip)}
                        className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          active
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Urgency Level */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  {isBn ? '৩. জরুরি অবস্থা কেমন?' : '3. Urgency Level'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      urgency === 'normal'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {isBn ? 'সাধারণ পরামর্শ' : 'Normal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      urgency === 'urgent'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {isBn ? 'জরুরি (আজই প্রয়োজন)' : 'Urgent Today'}
                  </button>
                </div>
              </div>

              {/* Step 4: Preferred Consultation Type */}
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                  {isBn ? '৪. কীভাবে পরামর্শ নিতে চান?' : '4. Preferred Contact Mode'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('phone_call')}
                    className={`min-h-[54px] py-2 px-2 rounded-xl text-xs font-extrabold border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      consultType === 'phone_call'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{isBn ? 'ফোন কল' : 'Phone'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultType('online_consultation')}
                    className={`min-h-[54px] py-2 px-2 rounded-xl text-xs font-extrabold border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      consultType === 'online_consultation'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{isBn ? 'ভিডিও কল' : 'Video'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultType('in_person_visit')}
                    className={`min-h-[54px] py-2 px-2 rounded-xl text-xs font-extrabold border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      consultType === 'in_person_visit'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{isBn ? 'খামারে আসা' : 'Farm Visit'}</span>
                  </button>
                </div>
              </div>

              {/* Step 5 & 6: Center + Preferred Time Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    {isBn ? '৫. কেন্দ্র / ডাক্তার (নমুনা)' : '5. Center (Demo)'}
                  </label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {localVetDirectory.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.hospital}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1">
                    {isBn ? '৬. সুবিধাজনক সময়' : '6. Preferred Time Window'}
                  </label>
                  <select
                    value={preferredTimeWindow}
                    onChange={(e) => setPreferredTimeWindow(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="সকাল ৯টা – দুপুর ১টা">{isBn ? 'সকাল ৯টা – দুপুর ১টা' : 'Morning 9am – 1pm'}</option>
                    <option value="দুপুর ২টা – বিকাল ৫টা">{isBn ? 'দুপুর ২টা – বিকাল ৫টা' : 'Afternoon 2pm – 5pm'}</option>
                    <option value="সন্ধ্যা ৬টা – রাত ৮টা">{isBn ? 'সন্ধ্যা ৬টা – রাত ৮টা' : 'Evening 6pm – 8pm'}</option>
                  </select>
                </div>
              </div>

              {/* Step 7: Short Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-1" htmlFor="vet-request-description">
                    {isBn ? '৭. সংক্ষিপ্ত বিবরণ লিখুন (কত দিন ধরে সমস্যা?)' : '7. Short Description'}
                  </label>
                  <textarea
                    id="vet-request-description"
                    rows={2}
                    value={consultDesc}
                    onChange={(e) => setConsultDesc(e.target.value)}
                    placeholder={isBn ? 'যেমন: ২ দিন ধরে খাবার কম খাচ্ছে এবং হালকা জ্বর...' : 'e.g. Less appetite for 2 days...'}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>
                <PrivatePhotoField
                  alt={isBn ? 'পশুচিকিৎসা অনুরোধের সংযুক্ত ছবি' : 'Photo attached to vet request'}
                  disabled={isDemoActive}
                  lang={lang}
                  onChange={setConsultPhotoUrl}
                  value={consultPhotoUrl}
                />
              </div>

              {/* Step 8: Review & Submit */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="min-h-[46px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="min-h-[46px] px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  {isBn ? '৮. অনুরোধ জমা দিন' : '8. Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
