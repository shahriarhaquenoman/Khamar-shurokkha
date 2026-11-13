import React, { useState, useRef, useEffect } from 'react';
import {
  AnimalProfile,
  FlockProfile,
  FarmProfile,
  Language,
  NavScreen,
  KhamarBondhuMessage,
} from '../types';
import { ResilientImage } from './ui/ResilientImage';
import { FARM_VISUAL_ASSETS } from '../lib/visualAssets';
import {
  Send,
  AlertTriangle,
  HeartPulse,
  Volume2,
  ShieldCheck,
  User,
  BookOpen,
  Info,
  RotateCcw,
} from 'lucide-react';
import {
  getKhamarPhoneShortLabel,
  getKhamarUssdShortLabel,
} from '../config/contactConfig';
import { KhamarContactCallAction } from './ui/KhamarContactCallAction';

interface AIAssistantScreenProps {
  farm: FarmProfile;
  animals: AnimalProfile[];
  flocks: FlockProfile[];
  lang: Language;
  onNavigate: (screen: NavScreen, topicKey?: string) => void;
  selectedContextTarget?: { id: string; name: string; species: string } | null;
  messages?: KhamarBondhuMessage[];
  onUpdateMessages?: React.Dispatch<React.SetStateAction<KhamarBondhuMessage[]>>;
  onResetMessages?: () => void;
  isJudgeDemoActive?: boolean;
}

export const DEFAULT_KHAMAR_BONDHU_WELCOME = (lang: Language): KhamarBondhuMessage => ({
  id: 'msg_welcome',
  sender: 'assistant',
  text:
    lang === 'bn'
      ? `আসসালামু আলাইকুম! আমি "খামার বন্ধু" — আপনার খামারের সহজ তথ্য সহায়িকা।\nএখানে আপনি খামার পরিচ্ছন্নতা, পানি ও খাবার, গরু-ছাগল বা পোল্ট্রির প্রাথমিক যত্ন এবং কখন ডাক্তারের সাহায্য নেবেন সে বিষয়ে সহজ উত্তর পাবেন।\n\nখামার বন্ধু সাধারণ খামার পরিচর্যা ও সচেতনতামূলক তথ্য দিতে পারে। এটি এখনো নিবন্ধিত পশুচিকিৎসকের বিকল্প নয়।`
      : `Hello! I am "Khamar Bondhu" — your simple educational farm care guide.\nAsk about hygiene, clean water, poultry shed care, or when to call a veterinarian.\n\nKhamar Bondhu provides general farm-care and awareness guidance only. It is not a substitute for a registered veterinarian.`,
  timestamp: lang === 'bn' ? 'সহায়িকা' : 'Guide',
});

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  farm,
  animals,
  flocks,
  lang,
  onNavigate,
  selectedContextTarget,
  messages: sharedMessages,
  onUpdateMessages,
  onResetMessages,
  isJudgeDemoActive = false,
}) => {
  const isBn = lang === 'bn';

  const [activeTargetId, setActiveTargetId] = useState<string>(
    selectedContextTarget?.id || animals[0]?.id || flocks[0]?.id || ''
  );
  const [localMessages, setLocalMessages] = useState<KhamarBondhuMessage[]>(() => [
    DEFAULT_KHAMAR_BONDHU_WELCOME(lang),
  ]);

  const messages = sharedMessages ?? localMessages;
  const setMessages = onUpdateMessages ?? setLocalMessages;

  const [inputQuery, setInputQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedContextTarget?.id) {
      setActiveTargetId(selectedContextTarget.id);
    }
  }, [selectedContextTarget]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  // Exact 4 example prompts requested + practical farmer wording
  const suggestedQuestions = [
    {
      bn: 'আমার গরু খাবার কম খাচ্ছে, কী করব?',
      en: 'My cow is eating less feed, what should I do?',
    },
    {
      bn: 'খামারের পানি পরিষ্কার রাখব কীভাবে?',
      en: 'How can I keep farm drinking water clean?',
    },
    {
      bn: 'পোল্ট্রির ঘর পরিষ্কার রাখার নিয়ম কী?',
      en: 'What are the rules for keeping poultry sheds clean?',
    },
    {
      bn: 'কখন পশুচিকিৎসকের সাহায্য নিতে হবে?',
      en: 'When should I call a veterinarian?',
    },
  ];

  const currentAnimal = animals.find((a) => a.id === activeTargetId);
  const currentFlock = flocks.find((f) => f.id === activeTargetId);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: KhamarBondhuMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    setTimeout(() => {
      const lower = query.toLowerCase();

      const isEmergency =
        lower.includes('শ্বাসকষ্ট') ||
        lower.includes('মারা যাচ্ছে') ||
        lower.includes('রক্ত') ||
        lower.includes('দাঁড়াতে পারছে না') ||
        lower.includes('জ্বর') ||
        lower.includes('খাবার কম খাচ্ছে') ||
        lower.includes('eating less') ||
        lower.includes('breathing') ||
        lower.includes('dying');

      let replyText = '';
      let topicKey: string | undefined;

      if (lower.includes('খাবার কম খাচ্ছে') || lower.includes('eating less')) {
        replyText = isBn
          ? `গরু বা ছাগল খাবার কম খেলে দ্রুত কয়েকটি বিষয় পরীক্ষা করুন:\n১. জ্বর আছে কি না এবং কান-পা ঠান্ডা কি না দেখুন।\n২. পরিষ্কার পানি, তাজা খড় ও দানাদার খাবার ঠিক আছে কি না এবং পাত্রে ফাঙ্গাস বা পচা গন্ধ আছে কি না দেখুন।\n৩. যদি ২৪ ঘণ্টার বেশি খাবার বন্ধ থাকে, জাবর কাটা কমে যায় বা ঝিমায় — তাহলে দেরি না করে নিবন্ধিত পশুচিকিৎসক অথবা খামার সুরক্ষা সহায়তা নম্বরে (${getKhamarPhoneShortLabel(lang)}) যোগাযোগ করুন।`
          : `If cattle eat less feed:\n1. Check for fever or unusual dullness.\n2. Check drinking water cleanliness and inspect feed for mold or sour smell.\n3. If appetite stays low over 24 hours or rumination stops, consult a registered vet or contact Khamar Shurokkha (${getKhamarPhoneShortLabel(lang)}) promptly.`;
        topicKey = 'topic_emergency_vet';
      } else if (isEmergency || lower.includes('পশুচিকিৎসকের সাহায্য') || lower.includes('call a vet')) {
        replyText = isBn
          ? `নিচের যেকোনো লক্ষণ দেখলে দেরি না করে পশুচিকিৎসকের সাহায্য নিন:\n• প্রাণী খাবার বা পানি একেবারেই খাচ্ছে না বা উঠে দাঁড়াতে পারছে না।\n• উচ্চ জ্বর, শ্বাসকষ্ট, নাক-মুখ দিয়ে লালা/রক্ত পড়া বা ক্রমাগত ডায়রিয়া।\n• ২৪ ঘণ্টার মধ্যে একের বেশি মুরগি বা প্রাণী হঠাৎ মারা গেলে।\n\nএখনই আক্রান্ত প্রাণীকে আলাদা রাখুন এবং "পশুচিকিৎসা সেবা" বা খামার সুরক্ষা সহায়তা নম্বরে (${getKhamarPhoneShortLabel(lang)}) যোগাযোগ করুন।`
          : `Seek veterinary care immediately if:\n• Animal stops eating/drinking or cannot stand.\n• Fever, breathing trouble, nasal discharge, or severe diarrhea appears.\n• More than one animal/bird dies suddenly.\nIsolate the sick animal first and contact Vet Services or Khamar Shurokkha (${getKhamarPhoneShortLabel(lang)}).`;
        topicKey = 'topic_emergency_vet';
      } else if (lower.includes('পানি') || lower.includes('water')) {
        replyText = isBn
          ? `খামারের পানি পরিষ্কার রাখার সহজ নিয়ম:\n১. প্রতিদিন সকালে পানির পাত্র বা ড্রাম ব্রাশ দিয়ে ঘষে ধুয়ে তাজা পানি দিন।\n২. পানির ট্যাংক সবসময় ঢাকনা দিয়ে ঢেকে রাখুন যেন ময়লা বা পাখির বিষ্ঠা না পড়ে।\n৩. খাবারের ও পানির পাত্র গোবর বা মলমূত্র থেকে দূরে উঁচু স্থানে রাখুন।\n৪. পোল্ট্রি খামারের পানির পাইপলাইন প্রতি সপ্তাহে অন্তত ১ বার ফ্ল্যাশ করে শ্যাওলা পরিষ্কার করুন।`
          : `Keep farm water clean:\n1. Scrub water bowls and troughs every morning before refilling.\n2. Keep tanks covered to block dust and droppings.\n3. Keep troughs raised away from manure splash.\n4. Flush poultry water pipes weekly to remove slime.`;
        topicKey = 'topic_feed_water';
      } else if (lower.includes('পোল্ট্রির ঘর') || lower.includes('পরিষ্কার') || lower.includes('poultry shed') || lower.includes('বায়োসিকিউরিটি')) {
        replyText = isBn
          ? `পোল্ট্রির ঘর পরিষ্কার ও নিরাপদ রাখার মূল নিয়ম:\n১. শেডের দরজায় জীবাণুনাশক ফুটবাথ রাখুন এবং প্রতিদিন পানি বদলান।\n২. লিটার বা বিছানা সবসময় শুকনো রাখুন — ভেজা অংশ তুলে ফেলে শুকনো তুষ দিন।\n৩. বাইরের লোক, ক্রেতা বা বাজারের খাঁচা শেডের ভেতরে ঢুকতে দেবেন না।\n৪. নতুন বা ঝিমানো মুরগি আলাদা খাঁচায় রাখুন এবং সাবান দিয়ে হাত ধুয়ে কাজ শুরু করুন।`
          : `Keep poultry sheds clean:\n1. Refresh the entrance footbath daily and use shed-only boots.\n2. Keep litter dry; remove wet spots immediately.\n3. Keep buyers, visitors, and market crates outside the shed.\n4. Isolate sick birds quickly and wash hands with soap.`;
        topicKey = 'topic_daily_hygiene';
      } else {
        replyText = isBn
          ? `ধন্যবাদ! ${currentAnimal ? currentAnimal.nameOrTag : currentFlock ? currentFlock.batchName : 'আপনার খামারের'} সুস্থতার জন্য প্রতিদিন পরিষ্কার পানি, শুকনো মেঝে, ফুটবাথ এবং সময়মতো টিকা ও কৃমিনাশক দেওয়া জরুরি।\n\nছবিসহ সহজ নির্দেশিকা দেখতে "শিখি (জ্ঞানভান্ডার)" দেখতে পারেন অথবা জরুরি অসুস্থতায় "পশুচিকিৎসা সেবা" ব্যবহার করুন।`
          : `For ${currentAnimal ? currentAnimal.nameOrTag : currentFlock ? currentFlock.batchName : 'your farm'}, clean water, dry bedding, fresh footbath, and timely vaccines keep animals healthy. Check Knowledge Library for visual step-by-step guides or Vet Care for medical advice.`;
        topicKey = 'topic_daily_hygiene';
      }

      const botMsg: KhamarBondhuMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        isEmergencyAlert: isEmergency || lower.includes('পশুচিকিৎসকের সাহায্য'),
        topicKey,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = isBn ? 'bn-BD' : 'en-US';
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="space-y-4">
      {/* Honest Pre-set Demo Guidance Disclosure */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-black text-amber-950">
            {isBn
              ? `ডেমো / প্রি-সেট শিক্ষামূলক সহায়িকা (কোনো লাইভ AI বা ডাক্তার নয়)${isJudgeDemoActive ? ' — বিচারক ডেমো' : ''}`
              : `Demo / Pre-Set Educational Guide (No Live AI API or Vet Diagnosis)${isJudgeDemoActive ? ' — Judge Demo' : ''}`}
          </p>
          <p className="leading-relaxed text-amber-900">
            {isBn
              ? `খামার বন্ধু সাধারণ খামার পরিচর্যা ও সচেতনতামূলক তথ্য দিতে পারে। এটি এখনো নিবন্ধিত পশুচিকিৎসকের বিকল্প নয়। অসুস্থ প্রাণীর জন্য পশুচিকিৎসা সেবা অথবা খামার সুরক্ষা সহায়তা নম্বর (${getKhamarPhoneShortLabel(lang)}) ও USSD (${getKhamarUssdShortLabel()}) ব্যবহার করুন।`
              : `Khamar Bondhu provides general farm-care and awareness information only and is not a substitute for a registered veterinarian. Use Veterinary Care or Khamar Shurokkha support (${getKhamarPhoneShortLabel(lang)}) / USSD (${getKhamarUssdShortLabel()}) for sick animals.`}
          </p>
        </div>
      </div>

      {/* Animal / Flock Selector Strip */}
      <div className="bg-white rounded-2xl p-4 border border-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-200 shrink-0 bg-emerald-50">
            <ResilientImage
              src={FARM_VISUAL_ASSETS.farmHero}
              alt={isBn ? 'খামার বন্ধু সহায়িকা' : 'Khamar Bondhu Assistant'}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              {isBn ? 'খামার বন্ধু — সহজ প্রশ্নোত্তর' : 'Khamar Bondhu — Care Q&A'}
            </h2>
            <p className="text-xs text-cyan-800 font-semibold">
              {farm.name.split('(')[0].trim()} · {isBn ? 'কথোপকথন সংরক্ষিত থাকে' : 'History preserved across pages'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(animals.length > 0 || flocks.length > 0) && (
            <select
              value={activeTargetId}
              onChange={(e) => setActiveTargetId(e.target.value)}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 text-slate-800"
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nameOrTag} ({a.id})
                </option>
              ))}
              {flocks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.batchName} ({f.id})
                </option>
              ))}
            </select>
          )}
          {onResetMessages && (
            <button
              type="button"
              onClick={onResetMessages}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              title={isBn ? 'নতুন আলোচনা শুরু করুন' : 'Start New Conversation'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'নতুন চ্যাট' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-3xl border border-cyan-200/80 shadow-xs overflow-hidden flex flex-col h-[480px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : msg.isEmergencyAlert
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : msg.isEmergencyAlert ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : msg.isEmergencyAlert
                    ? 'bg-rose-50 border border-rose-300 text-rose-950 rounded-tl-none font-medium'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {(msg.isEmergencyAlert || msg.topicKey) && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center gap-2">
                    {msg.topicKey && (
                      <button
                        onClick={() => onNavigate('knowledge_library', msg.topicKey)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isBn ? 'জ্ঞানভান্ডারে ছবিসহ দেখুন' : 'View Illustrated Guide'}</span>
                      </button>
                    )}

                    {msg.isEmergencyAlert && (
                      <>
                        <button
                          onClick={() => onNavigate('vet_services')}
                          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <HeartPulse className="w-3.5 h-3.5" />
                          <span>{isBn ? 'পশুচিকিৎসকের পরামর্শ' : 'Request Vet Advice'}</span>
                        </button>
                        <KhamarContactCallAction
                          lang={lang}
                          labelBn={`খামার সুরক্ষা কল (${getKhamarPhoneShortLabel(lang)})`}
                          labelEn={`Call Khamar Shurokkha (${getKhamarPhoneShortLabel(lang)})`}
                          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && typeof window !== 'undefined' && 'speechSynthesis' in window && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="hover:text-emerald-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? (isBn ? 'থামুন' : 'Stop') : (isBn ? 'শুনুন' : 'Listen')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* 4 Suggested Questions */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(isBn ? q.bn : q.en)}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-slate-800 font-bold text-xs shrink-0 cursor-pointer"
            >
              {isBn ? q.bn : q.en}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isBn ? 'এখানে আপনার প্রশ্ন লিখুন...' : 'Type your question here...'}
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="min-w-[46px] min-h-[46px] p-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
