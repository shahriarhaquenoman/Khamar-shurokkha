import React, { useState } from 'react';
import { FarmProfile, ScheduledCareTask, AnimalProfile, Language } from '../types';
import { toBanglaNum } from '../translations';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  Phone,
  ShieldCheck,
  Info,
  AlertTriangle,
} from 'lucide-react';
import {
  KHAMAR_CONTACT_CONFIG,
  getKhamarPhoneDisplay,
  getKhamarUssdDisplay,
  getKhamarUssdShortLabel,
} from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';

interface USSDSimulatorScreenProps {
  farm: FarmProfile;
  tasks: ScheduledCareTask[];
  animals: AnimalProfile[];
  lang: Language;
}

export const USSDSimulatorScreen: React.FC<USSDSimulatorScreenProps> = ({
  farm,
  tasks,
  animals,
  lang,
}) => {
  const isBn = lang === 'bn';

  // USSD Session State
  const [dialedCode, setDialedCode] = useState('*123#');
  const [sessionActive, setSessionActive] = useState(false);
  const [currentMenuPath, setCurrentMenuPath] = useState<string>('root');
  const [inputBuffer, setInputBuffer] = useState('');

  // Menus
  const getScreenContent = () => {
    if (!sessionActive) {
      return (
        <div className="text-center py-7 space-y-2 font-mono text-emerald-400">
          <div className="text-[10px] text-amber-300 uppercase tracking-wider">
            {isBn ? '[সিমুলেশন প্রোটোটাইপ]' : '[SIMULATED PROTOTYPE]'}
          </div>
          <div className="text-lg font-bold">খামার সুরক্ষা USSD</div>
          <div className="text-xs text-emerald-300">
            {isBn ? 'নমুনা কোড:' : 'Sample code:'} {dialedCode}
          </div>
          <div className="text-[10px] text-emerald-400/90 pt-2">
            {isBn ? '[কল বোতাম চেপে নমুনা সেশন শুরু করুন]' : '[Press Call to start simulation]'}
          </div>
        </div>
      );
    }

    if (currentMenuPath === 'root') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            স্বাগতম খামার সুরক্ষা ({farm.id})
          </div>
          <div>১. আজকের কাজ দেখুন</div>
          <div>২. টিকার সময় দেখুন</div>
          <div>৩. কৃমিনাশক রেকর্ড</div>
          <div>৪. প্রাণীর তথ্য</div>
          <div>৫. স্বাস্থ্য সমস্যা জানান</div>
          <div>৬. ডাক্তার কলব্যাক অনুরোধ</div>
          <div>৭. এলাকার সতর্কতা</div>
          <div>০. প্রস্থান (Exit)</div>
        </div>
      );
    }

    if (currentMenuPath === '1') {
      // Today's tasks
      const due = tasks.filter((t) => t.status === 'overdue' || t.status === 'due_soon');
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            আজকের কাজ ({due.length} টি)
          </div>
          {due.slice(0, 3).map((t, idx) => (
            <div key={idx} className="text-[10px]">
              {idx + 1}. {t.titleBn.slice(0, 26)}..
            </div>
          ))}
          <div className="pt-2 text-white">৯. পেছনে যান (Back)</div>
        </div>
      );
    }

    if (currentMenuPath === '2') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            টিকার সময়সূচি
          </div>
          <div>১. লাল বাহাদুর - FMD (২২শে নভে)</div>
          <div>২. ব্রয়লার ব্যাচ - IBD (আজ)</div>
          <div className="pt-2 text-white">৯. পেছনে যান (Back)</div>
        </div>
      );
    }

    if (currentMenuPath === '3') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            কৃমিনাশক পর্যালোচনা
          </div>
          <div>১. চান্দের আলো - সময় অতিক্রান্ত</div>
          <div>২. মেঘ (ভেড়া) - ২৮শে নভে</div>
          <div className="pt-2 text-white">৯. পেছনে যান (Back)</div>
        </div>
      );
    }

    if (currentMenuPath === '4') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            প্রাণী তালিকা ({animals.length} টি)
          </div>
          {animals.slice(0, 3).map((a, i) => (
            <div key={a.id} className="text-[10px]">
              {i + 1}. {a.id} - {a.nameOrTag}
            </div>
          ))}
          <div className="pt-2 text-white">৯. পেছনে যান (Back)</div>
        </div>
      );
    }

    if (currentMenuPath === '5') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            স্বাস্থ্য সমস্যা রেকর্ড
          </div>
          <div>১. ডায়রিয়া / পাতলা গোবর</div>
          <div>২. জ্বর বা ক্ষুধামন্দা</div>
          <div>৩. শ্বাসকষ্ট</div>
          <div className="pt-2 text-white">৯. পেছনে যান</div>
        </div>
      );
    }

    if (currentMenuPath === '6') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            ভেটেরিনারি কলব্যাক
          </div>
          <div className="text-yellow-300">
            আপনার অনুরোধ খামার সুরক্ষা পশুচিকিৎসা সহায়তা কেন্দ্রে পাঠানো হয়েছে। শীঘ্রই কল দেওয়া হবে।
          </div>
          <div className="pt-2 text-white">০. সম্পন্ন</div>
        </div>
      );
    }

    if (currentMenuPath === '7') {
      return (
        <div className="space-y-1 font-mono text-[11px] text-emerald-300 leading-tight">
          <div className="font-bold text-white border-b border-emerald-500/40 pb-1 mb-1">
            এলাকার সতর্কতা
          </div>
          <div className="text-[10px]">
            • মাধবপুরে খুরারোগ সতর্কবার্তা
          </div>
          <div className="text-[10px]">
            • মুক্ত জলাশয়ে হাঁসের বাড়তি নজরদারি
          </div>
          <div className="pt-2 text-white">৯. পেছনে যান</div>
        </div>
      );
    }

    return null;
  };

  const handleKeypadPress = (val: string) => {
    if (!sessionActive) {
      if (val === 'CALL') {
        setSessionActive(true);
        setCurrentMenuPath('root');
      } else if (val === 'DEL') {
        setDialedCode((prev) => prev.slice(0, -1));
      } else {
        setDialedCode((prev) => prev + val);
      }
    } else {
      if (val === 'CALL' || val === 'SEND') {
        handleUSSDInput(inputBuffer);
        setInputBuffer('');
      } else if (val === 'DEL') {
        setInputBuffer((prev) => prev.slice(0, -1));
      } else {
        setInputBuffer((prev) => prev + val);
      }
    }
  };

  const handleUSSDInput = (val: string) => {
    const choice = val.trim();
    if (choice === '0') {
      setSessionActive(false);
      setCurrentMenuPath('root');
      return;
    }
    if (choice === '9') {
      setCurrentMenuPath('root');
      return;
    }
    if (currentMenuPath === 'root') {
      if (['1', '2', '3', '4', '5', '6', '7'].includes(choice)) {
        setCurrentMenuPath(choice);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-blue-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{isBn ? 'বেসিক মোবাইল ফোন ও অফলাইন অ্যাক্সেস' : 'Basic Feature Phone & Offline Accessibility'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {isBn ? 'ইন্টারনেট ছাড়া USSD সেবা সিমুলেটর' : 'Interactive USSD Simulator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isBn
                ? 'ইন্টারনেট বা স্মার্টফোনবিহীন প্রান্তিক খামারিদের জন্য বাটন ফোনের নমুনা মেনু প্রদর্শনী'
                : 'Interactive feature-phone menu demonstration for rural farmers without smartphones or data'}
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-extrabold shrink-0">
            {KHAMAR_CONTACT_CONFIG.isUssdOfficiallyActive
              ? isBn
                ? `অফিসিয়াল USSD কোড: ${KHAMAR_CONTACT_CONFIG.officialUssdCode}`
                : `Official USSD Code: ${KHAMAR_CONTACT_CONFIG.officialUssdCode}`
              : isBn
              ? `অফিসিয়াল USSD কোড (${getKhamarUssdShortLabel()}) এখনো সক্রিয় হয়নি`
              : `Official USSD Code (${getKhamarUssdShortLabel()}) Not Yet Active`}
          </div>
        </div>

        {/* Honest USSD Short Code & Telecom Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-black">
              {isBn
                ? 'স্বচ্ছতা ও বাস্তব অবস্থা: *123# শুধুমাত্র একটি নমুনা সিমুলেটর কোড'
                : 'Honest Status: *123# Is Strictly a Simulated Sample Code'}
            </p>
            <p className="leading-relaxed">
              {isBn
                ? `খামার সুরক্ষার নিজস্ব অফিসিয়াল USSD শর্টকোড (${getKhamarUssdDisplay(lang)}) এখনো টেলিকম অপারেটরের মাধ্যমে সক্রিয় হয়নি। এই স্ক্রিনে *123# ব্যবহার করে মেনু অভিজ্ঞতা দেখা যাচ্ছে; প্রকৃত সেবা চালুর পর অফিসিয়াল শর্টকোড কনফিগারেবল প্লেসহোল্ডারে যুক্ত করা যাবে।`
                : `Khamar Shurokkha's official telecom USSD short code (${getKhamarUssdDisplay(lang)}) is not yet live. This interactive preview uses sample code *123# solely to demonstrate the menu flow until telecom gateway activation.`}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Phone Device Mockup Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
        {/* The Retro Feature Phone Chassis */}
        <div className="w-[300px] bg-slate-900 rounded-[44px] p-5 shadow-2xl border-4 border-slate-700 relative">
          {/* Earpiece slit */}
          <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

          {/* Monochrome LCD Green Screen */}
          <div className="bg-slate-950 border-2 border-emerald-900/60 rounded-2xl p-4 h-[220px] flex flex-col justify-between shadow-inner relative overflow-hidden font-mono">
            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {getScreenContent()}
            </div>

            {/* Input Line at Bottom if in active session */}
            {sessionActive && (
              <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between text-xs text-emerald-400">
                <span>ইনপুট:</span>
                <span className="font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600">
                  {inputBuffer || '_'}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Pad */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {/* Row 1 */}
            <button
              onClick={() => handleKeypadPress('1')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              1
            </button>
            <button
              onClick={() => handleKeypadPress('2')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              2
            </button>
            <button
              onClick={() => handleKeypadPress('3')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              3
            </button>

            {/* Row 2 */}
            <button
              onClick={() => handleKeypadPress('4')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              4
            </button>
            <button
              onClick={() => handleKeypadPress('5')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              5
            </button>
            <button
              onClick={() => handleKeypadPress('6')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              6
            </button>

            {/* Row 3 */}
            <button
              onClick={() => handleKeypadPress('7')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              7
            </button>
            <button
              onClick={() => handleKeypadPress('8')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              8
            </button>
            <button
              onClick={() => handleKeypadPress('9')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              9
            </button>

            {/* Row 4 */}
            <button
              onClick={() => handleKeypadPress('*')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              *
            </button>
            <button
              onClick={() => handleKeypadPress('0')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              0
            </button>
            <button
              onClick={() => handleKeypadPress('#')}
              className="h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-base shadow active:scale-95 transition-all"
            >
              #
            </button>
          </div>

          {/* Action Control Buttons (Call / Send / Delete / End) */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleKeypadPress(sessionActive ? 'SEND' : 'CALL')}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="w-4 h-4" />
              <span>{sessionActive ? 'সেন্ড (Send)' : 'কল (Dial)'}</span>
            </button>

            <button
              onClick={() => {
                setSessionActive(false);
                setCurrentMenuPath('root');
                setInputBuffer('');
              }}
              className="py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-1.5"
            >
              <span>শেষ (End)</span>
            </button>
          </div>
        </div>

        {/* Informative Explanation Panel on the side */}
        <div className="max-w-md w-full space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <ResilientImage
              src={FARM_VISUAL_ASSETS.featurePhone}
              alt={isBn ? 'বাটন ফোন ব্যবহাররত গ্রামীণ খামারি' : 'Rural farmer using a feature phone'}
              className="w-full h-44 object-cover"
            />
            <div className="p-5 space-y-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#166534]" />
                <span>{isBn ? 'কেন USSD সেবা গুরুত্বপূর্ণ?' : 'Why USSD Matters for Rural Inclusion'}</span>
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm text-slate-600">
                {isBn
                  ? 'বাংলাদেশের প্রত্যন্ত অঞ্চলে অনেক ক্ষুদ্র খামারির স্মার্টফোন বা ইন্টারনেট নেই। ভবিষ্যতে টেলিকম USSD গেটওয়ে যুক্ত হলে যেকোনো বাটন ফোনে নমুনা মেনুর মতো করে আজকের কাজ, টিকার তারিখ ও সতর্কতা জানা যাবে।'
                  : 'Many smallholder livestock farmers rely on 2G feature phones without mobile data. With future telecom gateway integration, farmers can view due vaccinations, urgent farm tasks, and advisories via simple numeric menus.'}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{isBn ? 'খামার সুরক্ষা USSD ও কোড তথ্য:' : 'Khamar Shurokkha USSD & Activation Details:'}</span>
                </div>
                <div className="text-slate-600">
                  • {isBn ? `সিমুলেটর নমুনা কোড: ${KHAMAR_CONTACT_CONFIG.simulatorSampleUssdCode} (শুধু ডেমোর জন্য)` : `Simulator sample code: ${KHAMAR_CONTACT_CONFIG.simulatorSampleUssdCode} (demo only)`}
                </div>
                <div className="text-slate-600">
                  • {isBn ? `অফিসিয়াল USSD প্লেসহোল্ডার: ${getKhamarUssdDisplay(lang)}` : `Official USSD placeholder: ${getKhamarUssdDisplay(lang)}`}
                </div>
              </div>
            </div>
          </div>

          {/* Khamar Shurokkha Own Contact & USSD Promotion Card */}
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Phone className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-black text-emerald-950 text-xs sm:text-sm">
                  {isBn
                    ? 'খামার সুরক্ষা সরাসরি যোগাযোগ ও USSD সহায়তা'
                    : 'Khamar Shurokkha Direct Contact & USSD Support'}
                </h4>
                <p className="text-[11px] text-emerald-900 leading-relaxed font-semibold">
                  {isBn
                    ? `যোগাযোগ নম্বর: ${getKhamarPhoneDisplay(lang)} · অফিসিয়াল USSD কোড: ${getKhamarUssdDisplay(lang)}।`
                    : `Contact Number: ${getKhamarPhoneDisplay(lang)} · Official USSD Code: ${getKhamarUssdDisplay(lang)}.`}
                </p>
              </div>
            </div>
            <KhamarContactCallAction
              lang={lang}
              labelBn={
                KHAMAR_CONTACT_CONFIG.isPhoneConfigured
                  ? `খামার সুরক্ষায় কল করুন: ${KHAMAR_CONTACT_CONFIG.officialPhone}`
                  : `খামার সুরক্ষা কল (${KHAMAR_CONTACT_CONFIG.placeholderPhone})`
              }
              labelEn={
                KHAMAR_CONTACT_CONFIG.isPhoneConfigured
                  ? `Call Khamar Shurokkha: ${KHAMAR_CONTACT_CONFIG.officialPhone}`
                  : `Call Khamar Shurokkha (${KHAMAR_CONTACT_CONFIG.placeholderPhone})`
              }
              className="min-h-[42px] w-full rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
