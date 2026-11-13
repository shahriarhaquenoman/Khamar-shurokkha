import React from 'react';
import { Language } from '../types';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  lang?: Language;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  lang = 'bn',
  showTagline = true,
}) => {
  const isBn = lang === 'bn';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg sm:text-xl font-extrabold',
    lg: 'text-2xl sm:text-3xl font-black',
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none">
      {/* Multi-Species Shield Badge */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white shadow-md border border-emerald-600/40 shrink-0 transition-transform group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Outer Protective Shield */}
          <path
            d="M18 3L5 8V17C5 24.5 10.5 31.4 18 33C25.5 31.4 31 24.5 31 17V8L18 3Z"
            fill="url(#shieldGrad)"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Stylized Cattle Horns & Animal Silhouettes */}
          <path
            d="M11 15C13 13 16 14 18 16C20 14 23 13 25 15"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Heart / Medical Cross & Leaf Loop */}
          <path
            d="M18 19V26M14.5 22.5H21.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M13 25C15 28 21 28 23 25"
            stroke="#6EE7B7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="shieldGrad" x1="18" y1="3" x2="18" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14532D" />
              <stop offset="1" stopColor="#064E3B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} text-slate-900 tracking-tight`}>
            {isBn ? 'খামার সুরক্ষা' : 'Khamar Shurokkha'}
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        </div>
        {showTagline && (
          <span className="text-[11px] sm:text-xs font-medium text-emerald-800 tracking-normal">
            {isBn ? 'আপনার খামার, প্রতিদিনের যত্ন।' : 'Your Farm. Everyday Care.'}
          </span>
        )}
      </div>
    </div>
  );
};
