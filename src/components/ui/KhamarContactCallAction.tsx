import React, { useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { Language } from '../../types';
import {
  KHAMAR_CONTACT_CONFIG,
  getKhamarPhoneHref,
  getKhamarPhoneShortLabel,
} from '../../config/contactConfig';

interface KhamarContactCallActionProps {
  lang: Language;
  className?: string;
  labelBn?: string;
  labelEn?: string;
  iconClassName?: string;
  onBeforeAction?: () => void;
  showInlinePlaceholderNote?: boolean;
}

/**
 * Renders a real tel: call link when Khamar Shurokkha's official phone number is configured,
 * or a clear placeholder Call button with an honest inline note when unconfigured.
 */
export const KhamarContactCallAction: React.FC<KhamarContactCallActionProps> = ({
  lang,
  className = '',
  labelBn,
  labelEn,
  iconClassName = 'w-4 h-4 shrink-0',
  onBeforeAction,
  showInlinePlaceholderNote = true,
}) => {
  const isBn = lang === 'bn';
  const [showNote, setShowNote] = useState(false);
  const phoneHref = getKhamarPhoneHref();
  const shortNumber = getKhamarPhoneShortLabel(lang);

  const buttonText = isBn
    ? labelBn || `কল করুন: ${shortNumber}`
    : labelEn || `Call: ${shortNumber}`;

  if (phoneHref) {
    return (
      <a
        href={phoneHref}
        onClick={() => onBeforeAction?.()}
        className={className}
      >
        <PhoneCall className={iconClassName} />
        <span>{buttonText}</span>
      </a>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => {
          onBeforeAction?.();
          if (showInlinePlaceholderNote) {
            setShowNote((prev) => !prev);
          }
        }}
        className={className}
        title={
          isBn
            ? 'খামার সুরক্ষার অফিসিয়াল নম্বর এখনো যুক্ত করা হয়নি (প্লেসহোল্ডার)'
            : 'Khamar Shurokkha official contact number placeholder (not yet configured)'
        }
      >
        <PhoneCall className={iconClassName} />
        <span>{buttonText}</span>
      </button>
      {showInlinePlaceholderNote && showNote && (
        <p className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5 leading-snug">
          {isBn
            ? `এটি একটি এডিটেবল প্লেসহোল্ডার (${KHAMAR_CONTACT_CONFIG.placeholderPhone})। প্রকৃত অফিসিয়াল নম্বর যুক্ত করলে সরাসরি কল কাজ করবে।`
            : `Editable placeholder (${KHAMAR_CONTACT_CONFIG.placeholderPhone}). Add your live Khamar Shurokkha number in config to enable direct calling.`}
        </p>
      )}
    </div>
  );
};
