import React from 'react';
import { Language, AnimalHealthStatus, FlockHealthStatus, Species, LivestockSpecies, PoultrySpecies } from '../../types';
import { toBanglaNum } from '../../translations';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Syringe,
  Pill,
  Sparkles,
  AlertCircle,
  HelpCircle,
  HeartPulse,
  MinusCircle,
} from 'lucide-react';

export type BadgeVariant =
  | 'healthy'
  | 'needs_attention'
  | 'sick'
  | 'isolated'
  | 'in_treatment'
  | 'quarantined'
  | 'overdue'
  | 'important'
  | 'due_soon'
  | 'upcoming'
  | 'completed'
  | 'in_progress'
  | 'help_needed'
  | 'not_applicable'
  | 'confirmed'
  | 'rescheduled'
  | 'active'
  | 'archived'
  | 'verified'
  | 'official'
  | 'demo'
  | 'live'
  | 'cattle'
  | 'buffalo'
  | 'goat'
  | 'sheep'
  | 'broiler'
  | 'layer'
  | 'sonali'
  | 'duck'
  | 'vaccination'
  | 'deworming';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  lang?: Language;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  size = 'md',
  lang = 'bn',
  className = '',
}) => {
  const isBn = lang === 'bn';

  // Config mapping
  const configMap: Record<
    BadgeVariant,
    {
      bg: string;
      text: string;
      border: string;
      defaultLabelBn: string;
      defaultLabelEn: string;
      icon: React.ReactNode;
    }
  > = {
    healthy: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      defaultLabelBn: 'সুস্থ ও স্বাভাবিক',
      defaultLabelEn: 'Healthy',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    needs_attention: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      defaultLabelBn: 'বিশেষ নজর প্রয়োজন',
      defaultLabelEn: 'Needs Attention',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    sick: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      defaultLabelBn: 'অসুস্থ / পর্যবেক্ষণে',
      defaultLabelEn: 'Sick / Under Care',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
    },
    isolated: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
      defaultLabelBn: 'আইসোলেশনে পৃথক',
      defaultLabelEn: 'Isolated',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />,
    },
    in_treatment: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-900',
      border: 'border-cyan-300',
      defaultLabelBn: 'চিকিৎসাধীন',
      defaultLabelEn: 'In Treatment',
      icon: <HeartPulse className="w-3.5 h-3.5 text-cyan-700 shrink-0" />,
    },
    quarantined: {
      bg: 'bg-red-50',
      text: 'text-red-900',
      border: 'border-red-300',
      defaultLabelBn: 'কোয়ারেন্টাইনে',
      defaultLabelEn: 'Quarantined',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />,
    },
    overdue: {
      bg: 'bg-red-100',
      text: 'text-red-900',
      border: 'border-red-300',
      defaultLabelBn: 'সময় পার হয়েছে (জরুরি)',
      defaultLabelEn: 'Overdue (Urgent)',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0" />,
    },
    important: {
      bg: 'bg-pink-50',
      text: 'text-pink-900',
      border: 'border-pink-300',
      defaultLabelBn: 'গুরুত্বপূর্ণ করণীয়',
      defaultLabelEn: 'Important Action',
      icon: <AlertCircle className="w-3.5 h-3.5 text-pink-600 shrink-0" />,
    },
    due_soon: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      defaultLabelBn: 'আজ/আসন্ন ৩ দিনে',
      defaultLabelEn: 'Due Soon',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    upcoming: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      defaultLabelBn: 'পরবর্তী শিডিউল',
      defaultLabelEn: 'Upcoming',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
    },
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      defaultLabelBn: 'সম্পন্ন হয়েছে',
      defaultLabelEn: 'Completed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
    },
    in_progress: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-300',
      defaultLabelBn: 'চলমান কাজ',
      defaultLabelEn: 'In Progress',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    help_needed: {
      bg: 'bg-amber-100',
      text: 'text-amber-950',
      border: 'border-amber-400',
      defaultLabelBn: 'সহায়তা প্রয়োজন',
      defaultLabelEn: 'Help Needed',
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
    },
    not_applicable: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      defaultLabelBn: 'খামারে প্রযোজ্য নয়',
      defaultLabelEn: 'Not Applicable',
      icon: <MinusCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
    },
    confirmed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      defaultLabelBn: 'নিশ্চিত হয়েছে',
      defaultLabelEn: 'Confirmed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
    },
    rescheduled: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-300',
      defaultLabelBn: 'সময় পরিবর্তন হয়েছে',
      defaultLabelEn: 'Rescheduled',
      icon: <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
    },
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      defaultLabelBn: 'সক্রিয়',
      defaultLabelEn: 'Active',
      icon: <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />,
    },
    archived: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      defaultLabelBn: 'আর্কাইভকৃত',
      defaultLabelEn: 'Archived',
      icon: null,
    },
    verified: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      defaultLabelBn: 'তথ্য নথিভুক্ত',
      defaultLabelEn: 'Recorded',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
    },
    official: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      defaultLabelBn: 'প্রাথমিক নির্দেশিকা',
      defaultLabelEn: 'Standard Guide',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
    },
    demo: {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-300',
      defaultLabelBn: 'ডেমো ডেটা',
      defaultLabelEn: 'Demo Mode',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />,
    },
    live: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      defaultLabelBn: 'ক্লাউড ডেটাবেস',
      defaultLabelEn: 'Live Cloud',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />,
    },
    cattle: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      defaultLabelBn: 'গরু / গাভী',
      defaultLabelEn: 'Cattle',
      icon: <span className="text-sm">🐄</span>,
    },
    buffalo: {
      bg: 'bg-stone-100',
      text: 'text-stone-900',
      border: 'border-stone-300',
      defaultLabelBn: 'মহিষ',
      defaultLabelEn: 'Buffalo',
      icon: <span className="text-sm">🐃</span>,
    },
    goat: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      defaultLabelBn: 'ছাগল',
      defaultLabelEn: 'Goat',
      icon: <span className="text-sm">🐐</span>,
    },
    sheep: {
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-200',
      defaultLabelBn: 'ভেড়া',
      defaultLabelEn: 'Sheep',
      icon: <span className="text-sm">🐑</span>,
    },
    broiler: {
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-200',
      defaultLabelBn: 'ব্রয়লার',
      defaultLabelEn: 'Broiler',
      icon: <span className="text-sm">🍗</span>,
    },
    layer: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-900',
      border: 'border-yellow-200',
      defaultLabelBn: 'লেয়ার মুরগি',
      defaultLabelEn: 'Layer',
      icon: <span className="text-sm">🥚</span>,
    },
    sonali: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      defaultLabelBn: 'সোনালী মুরগি',
      defaultLabelEn: 'Sonali',
      icon: <span className="text-sm">🐓</span>,
    },
    duck: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-900',
      border: 'border-cyan-200',
      defaultLabelBn: 'হাঁস',
      defaultLabelEn: 'Duck',
      icon: <span className="text-sm">🦆</span>,
    },
    vaccination: {
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-200',
      defaultLabelBn: 'টিকা (ভ্যাকসিন)',
      defaultLabelEn: 'Vaccine',
      icon: <Syringe className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
    },
    deworming: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      defaultLabelBn: 'কৃমিনাশক',
      defaultLabelEn: 'Deworming',
      icon: <Pill className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
  };

  const current = configMap[variant] || configMap.healthy;
  const displayText = label || (isBn ? current.defaultLabelBn : current.defaultLabelEn);

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-black rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center border shadow-2xs select-none transition-all ${
        current.bg
      } ${current.text} ${current.border} ${sizeStyles[size]} ${className}`}
    >
      {current.icon}
      <span>{displayText}</span>
    </span>
  );
};
