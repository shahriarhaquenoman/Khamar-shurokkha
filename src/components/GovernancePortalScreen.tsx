import React, { useState } from 'react';
import {
  PreventiveProtocol,
  HealthEventReport,
  Language,
  UserRole,
  ProtocolApprovalStatus,
} from '../types';
import { AUTHORIZED_PROTOCOLS } from '../data/protocolData';
import { toBanglaNum } from '../translations';
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Building2,
  FileText,
  Search,
  Filter,
} from 'lucide-react';

interface GovernancePortalScreenProps {
  role: UserRole;
  lang: Language;
  healthEvents: HealthEventReport[];
  onReviewHealthEvent: (eventId: string, notes: string) => void;
}

export const GovernancePortalScreen: React.FC<GovernancePortalScreenProps> = ({
  role,
  lang,
  healthEvents,
  onReviewHealthEvent,
}) => {
  const isBn = lang === 'bn';

  const [protocols, setProtocols] = useState<PreventiveProtocol[]>(AUTHORIZED_PROTOCOLS);
  const [activeTab, setActiveTab] = useState<'protocols' | 'case_reviews'>('protocols');
  const [selectedProtocol, setSelectedProtocol] = useState<PreventiveProtocol | null>(null);

  const [reviewEventId, setReviewEventId] = useState<string | null>(null);
  const [vetNotesInput, setVetNotesInput] = useState('');

  const handleToggleProtocolStatus = (protoId: string, newStatus: ProtocolApprovalStatus) => {
    setProtocols((prev) =>
      prev.map((p) => (p.id === protoId ? { ...p, approvalStatus: newStatus } : p))
    );
  };

  const handleSaveVetReview = (eventId: string) => {
    onReviewHealthEvent(eventId, vetNotesInput || 'ভেটেরিনারি সার্জন কর্তৃক উপসর্গ পর্যালোচনা সম্পন্ন হয়েছে।');
    setReviewEventId(null);
    setVetNotesInput('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#166534] via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4 text-indigo-300" />
            <span>{isBn ? 'ভেটেরিনারি প্রটোকল গভর্ন্যান্স ও প্রশাসন' : 'Veterinary Governance & Admin Portal'}</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {isBn ? 'অনুমোদিত স্বাস্থ্য প্রটোকল ও কেস পর্যালোচনা' : 'Authorized Protocol Governance & Review'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
            {isBn
              ? 'প্রাণিসম্পদ অধিদপ্তর (DLS) ও ভেটেরিনারি বিজ্ঞানীদের অনুমোদিত স্বাস্থ্য নির্দেশিকা ব্যবস্থাপনা'
              : 'Protocol versioning, authorized reviews, and clinical symptom governance'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
          {isBn ? 'কর্মকর্তা অনুমোদন মোড' : 'Authorized Veterinary Access'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('protocols')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'protocols'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200'
          }`}
        >
          {isBn ? 'অনুমোদিত প্রটোকল তালিকা' : 'Care Protocols'} ({protocols.length})
        </button>

        <button
          onClick={() => setActiveTab('case_reviews')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'case_reviews'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200'
          }`}
        >
          {isBn ? 'খামারিদের জমা দেওয়া লক্ষণ কেস' : 'Submitted Symptom Cases'} ({healthEvents.length})
        </button>
      </div>

      {/* TAB 1: PROTOCOLS */}
      {activeTab === 'protocols' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">
                {isBn ? 'গভর্ন্যান্স সততা নিয়ম:' : 'Governance Rule:'}
              </strong>
              <span>
                {isBn
                  ? 'কেবলমাত্র "Approved" (অনুমোদিত) প্রটোকলগুলো খামারির ক্যালেন্ডারে সক্রিয় কাজ তৈরি করতে পারে। ড্রাফট বা অপ্রমাণিত শিডিউল কখনোই স্বয়ংক্রিয়ভাবে খামারিকে দেখানো হয় না।'
                  : 'Only "Approved" protocols can generate active tasks on the farmer calendar. Draft or unreviewed schedules remain quarantined.'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {protocols.map((proto) => (
              <div
                key={proto.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {proto.version}
                    </span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {isBn ? proto.titleBn : proto.titleEn}
                    </span>
                  </div>

                  {/* Status Tag & Admin Override Control */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        proto.approvalStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {proto.approvalStatus}
                    </span>

                    {/* Change status toggle */}
                    <button
                      onClick={() =>
                        handleToggleProtocolStatus(
                          proto.id,
                          proto.approvalStatus === 'approved' ? 'under_review' : 'approved'
                        )
                      }
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline"
                    >
                      {isBn ? 'অবস্থা পরিবর্তন' : 'Toggle Status'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="space-y-1.5">
                    <div>
                      <strong>{isBn ? 'উদ্দেশ্য / রোগ:' : 'Target:'}</strong>{' '}
                      {isBn ? proto.diseaseOrTargetBn : proto.diseaseOrTargetEn}
                    </div>
                    <div>
                      <strong>{isBn ? 'প্রযোজ্য প্রজাতি:' : 'Species:'}</strong>{' '}
                      {proto.species.join(', ')}
                    </div>
                    <div>
                      <strong>{isBn ? 'বয়স নির্দেশিকা:' : 'Age Rule:'}</strong>{' '}
                      {isBn ? proto.targetAgeRuleBn : proto.targetAgeRuleEn}
                    </div>
                    <div>
                      <strong>{isBn ? 'প্রথম ও পরবর্তী ডোজ:' : 'Dosage Schedule:'}</strong>{' '}
                      {proto.firstDoseRule}
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <strong>{isBn ? 'অনুমোদনকারী চিকিৎসক:' : 'Reviewing Vet:'}</strong>{' '}
                      {proto.reviewingVet}
                    </div>
                    <div>
                      <strong>{isBn ? 'তথ্যসূত্র গাইডলাইন:' : 'Guideline Source:'}</strong>{' '}
                      {proto.sourceReference}
                    </div>
                    {proto.contraindicationsBn && (
                      <div className="text-rose-800">
                        <strong>{isBn ? 'পার্শ্বপ্রতিক্রিয়া / সতর্কতা:' : 'Contraindications:'}</strong>{' '}
                        {isBn ? proto.contraindicationsBn : proto.contraindicationsEn}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CASE REVIEWS */}
      {activeTab === 'case_reviews' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {healthEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {evt.targetId} ({evt.species})
                    </span>
                    <span className="text-xs text-slate-500">
                      তারিখ: {toBanglaNum(evt.reportedDate, lang)}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      evt.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {evt.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-800 space-y-1">
                  <div>
                    <strong>লক্ষণসমূহ:</strong> {evt.symptoms.join(', ')}
                  </div>
                  <p className="text-slate-600">{evt.description}</p>
                </div>

                {evt.vetNotes ? (
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950">
                    <strong>চিকিৎসক পর্যবেক্ষণ:</strong> {evt.vetNotes}
                  </div>
                ) : (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-amber-700 font-medium">
                      * এই লক্ষণ রিপোর্টটি এখনো কোনো ভেটেরিনারি সার্জন পর্যালোচনা করেননি।
                    </span>

                    <button
                      onClick={() => setReviewEventId(evt.id)}
                      className="px-4 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                    >
                      {isBn ? 'পর্যালোচনা ও নোট যোগ' : 'Review & Add Notes'}
                    </button>
                  </div>
                )}

                {/* Inline Review Form */}
                {reviewEventId === evt.id && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      ভেটেরিনারি সার্জনের পর্যবেক্ষণ নোট লিখুন:
                    </label>
                    <textarea
                      rows={2}
                      value={vetNotesInput}
                      onChange={(e) => setVetNotesInput(e.target.value)}
                      placeholder="যেমন: লক্ষণ অনুযায়ী সম্ভাব্য বদহজম। খাবার পরিবর্তন ও স্যালাইন দেওয়ার নির্দেশ দেওয়া হলো..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveVetReview(evt.id)}
                        className="px-4 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
                      >
                        {isBn ? 'পর্যালোচনা সম্পন্ন করুন' : 'Approve & Save Review'}
                      </button>
                      <button
                        onClick={() => setReviewEventId(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
