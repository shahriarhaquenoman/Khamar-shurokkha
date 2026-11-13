import React from 'react';
import { Language } from '../types';
import { MessageCircle } from 'lucide-react';

interface KhamarBondhuFloatingButtonProps {
  lang: Language;
  hidden?: boolean;
  messageCount?: number;
  onOpenKhamarBondhu: () => void;
}

export const KhamarBondhuFloatingButton: React.FC<KhamarBondhuFloatingButtonProps> = ({
  lang,
  hidden = false,
  messageCount = 0,
  onOpenKhamarBondhu,
}) => {
  if (hidden) return null;

  const isBn = lang === 'bn';

  return (
    <button
      type="button"
      onClick={onOpenKhamarBondhu}
      aria-label={isBn ? 'খামার বন্ধু সহকারী খুলুন' : 'Open Khamar Bondhu Assistant'}
      title={isBn ? 'খামার বন্ধুকে জিজ্ঞাসা করুন' : 'Ask Khamar Bondhu'}
      className="fixed right-4 bottom-[76px] md:bottom-6 z-30 min-h-[50px] pl-3.5 pr-4 py-2.5 rounded-full bg-[#166534] hover:bg-emerald-900 active:scale-95 text-white border-2 border-cyan-300/70 shadow-xl flex items-center gap-2.5 transition-all cursor-pointer"
    >
      <span className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center shrink-0">
        <MessageCircle className="w-4 h-4" />
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-xs sm:text-sm font-black tracking-tight">
          {isBn ? 'খামার বন্ধু' : 'Khamar Bondhu'}
        </span>
        <span className="text-[10px] font-semibold text-emerald-100">
          {messageCount > 1
            ? isBn ? 'আলাপ চালু আছে' : 'Chat saved'
            : isBn ? 'যেকোনো প্রশ্ন করুন' : 'Ask anytime'}
        </span>
      </span>
    </button>
  );
};
