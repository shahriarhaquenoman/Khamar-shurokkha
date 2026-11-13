import React from 'react';

interface IllustrationProps {
  className?: string;
}

/**
 * খামারের ১২টি জীব-নিরাপত্তা বিষয়ের স্পষ্ট ও শিক্ষণীয় ভিজ্যুয়াল ইলাস্ট্রেশন (SVG)
 * গ্রামীণ ব্রয়লার খামারিদের সহজে বোঝার সুবিধার্থে তৈরি
 */

// ১. দর্শনার্থী প্রবেশ নিয়ন্ত্রণ
export const VisitorEntryIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F0FDF4" />
    {/* Ground */}
    <rect y="120" width="280" height="20" fill="#DCFCE7" />
    {/* Farm Fence */}
    <path d="M20 90H260M20 110H260" stroke="#059669" strokeWidth="3" strokeDasharray="6 4" />
    <path d="M40 75V120M80 75V120M200 75V120M240 75V120" stroke="#047857" strokeWidth="4" />
    {/* Farm Gate with Lock */}
    <rect x="110" y="65" width="60" height="55" rx="4" fill="#FFFFFF" stroke="#047857" strokeWidth="3" />
    <line x1="110" y1="92" x2="170" y2="92" stroke="#047857" strokeWidth="2" />
    <line x1="140" y1="65" x2="140" y2="120" stroke="#047857" strokeWidth="2" />
    {/* Red Stop Sign / নোটিশ */}
    <circle cx="140" cy="40" r="22" fill="#EF4444" stroke="#DC2626" strokeWidth="3" />
    <rect x="126" y="36" width="28" height="8" rx="2" fill="#FFFFFF" />
    {/* Visitor with Registry Book */}
    <circle cx="65" cy="45" r="10" fill="#FBBF24" />
    <path d="M55 70C55 58 75 58 75 70V85H55V70Z" fill="#3B82F6" />
    {/* Visitor Logbook icon */}
    <rect x="205" y="45" width="30" height="38" rx="3" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
    <line x1="212" y1="55" x2="228" y2="55" stroke="#10B981" strokeWidth="2" />
    <line x1="212" y1="63" x2="228" y2="63" stroke="#10B981" strokeWidth="2" />
    <line x1="212" y1="71" x2="222" y2="71" stroke="#10B981" strokeWidth="2" />
  </svg>
);

// ২. নির্দিষ্ট জুতা ও পোশাক ব্যবহার (ফুটবাথ ও বুট)
export const FootwearIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#EFF6FF" />
    {/* Shed Doorway */}
    <rect x="30" y="15" width="90" height="115" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3" />
    <circle cx="105" cy="75" r="4" fill="#1D4ED8" />
    {/* Disinfectant Footbath Tray */}
    <rect x="135" y="85" width="125" height="35" rx="8" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="3" />
    <path d="M145 100C160 96 175 104 195 100C215 96 235 104 250 100" stroke="#2563EB" strokeWidth="2.5" />
    {/* Farm Rubber Boots in Footbath */}
    <path d="M165 55V95H185C190 95 195 90 195 85V75L180 75V55H165Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
    <path d="M205 55V95H225C230 95 235 90 235 85V75L220 75V55H205Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
    {/* Clean Apron Icon */}
    <path d="M60 40H90L85 85H65L60 40Z" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
    <circle cx="75" cy="30" r="6" fill="#10B981" />
    {/* Disinfectant Sparkles */}
    <path d="M245 45L248 53L256 56L248 59L245 67L242 59L234 56L242 53L245 45Z" fill="#3B82F6" />
  </svg>
);

// ৩. হাত পরিষ্কার রাখা (সাবান ও পানি)
export const HandwashingIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#ECFDF5" />
    {/* Water Tap */}
    <path d="M140 15V45H120V35" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
    <path d="M140 45H150V55H130V45H140Z" fill="#059669" />
    {/* Water Droplets */}
    <path d="M140 62C140 62 135 70 135 74C135 77 137 79 140 79C143 79 145 77 145 74C145 70 140 62 140 62Z" fill="#38BDF8" />
    <path d="M132 82C132 82 129 87 129 90C129 92 130 93 132 93C134 93 135 92 135 90C135 87 132 82 132 82Z" fill="#38BDF8" />
    <path d="M148 82C148 82 145 87 145 90C145 92 146 93 148 93C150 93 151 92 151 90C151 87 148 82 148 82Z" fill="#38BDF8" />
    {/* Soap bar */}
    <rect x="50" y="70" width="45" height="26" rx="8" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
    <text x="60" y="87" fill="#FFFFFF" fontSize="11" fontWeight="bold">সাবান</text>
    {/* Two Washing Hands with Lather */}
    <path d="M110 105C115 95 130 90 140 96C150 90 165 95 170 105C165 118 115 118 110 105Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
    {/* Foam bubbles */}
    <circle cx="125" cy="88" r="7" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="155" cy="88" r="6" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="140" cy="102" r="5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="175" cy="98" r="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="105" cy="98" r="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
  </svg>
);

// ৪. খামারের পরিচ্ছন্ন এলাকায় যানবাহন প্রবেশ নিয়ন্ত্রণ
export const VehicleControlIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FEF3C7" />
    {/* Boundary Fence */}
    <line x1="200" y1="20" x2="200" y2="125" stroke="#B45309" strokeWidth="4" strokeDasharray="8 6" />
    {/* Farm Sign */}
    <rect x="210" y="30" width="60" height="35" rx="4" fill="#047857" />
    <text x="217" y="52" fill="#FFFFFF" fontSize="10" fontWeight="bold">খামার এলাকা</text>
    {/* Delivery Truck outside */}
    <rect x="30" y="50" width="85" height="50" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
    <path d="M115 65H145L155 85V100H115V65Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2.5" />
    {/* Wheels */}
    <circle cx="55" cy="105" r="14" fill="#374151" stroke="#111827" strokeWidth="3" />
    <circle cx="55" cy="105" r="5" fill="#E5E7EB" />
    <circle cx="135" cy="105" r="14" fill="#374151" stroke="#111827" strokeWidth="3" />
    <circle cx="135" cy="105" r="5" fill="#E5E7EB" />
    {/* Disinfectant Sprayer over wheels */}
    <rect x="170" y="55" width="16" height="30" rx="3" fill="#10B981" stroke="#047857" strokeWidth="2" />
    <path d="M178 85V105" stroke="#059669" strokeWidth="2.5" />
    {/* Spray Cone */}
    <path d="M178 105L160 118H195L178 105Z" fill="#6EE7B7" opacity="0.7" />
  </svg>
);

// ৫. ব্যবহৃত সরঞ্জাম পরিষ্কার রাখা
export const EquipmentCleaningIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F0FDFA" />
    {/* Clean Feeder Pan */}
    <ellipse cx="85" cy="95" rx="45" ry="16" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
    <path d="M60 90C60 65 110 65 110 90" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
    {/* Bell Drinker */}
    <path d="M190 40H210V60L225 90H175L190 60V40Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
    <ellipse cx="200" cy="90" rx="35" ry="10" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="2.5" />
    {/* Cleaning Brush */}
    <rect x="130" y="45" width="10" height="40" rx="3" transform="rotate(-30 130 45)" fill="#3B82F6" />
    <rect x="135" y="75" width="22" height="12" rx="2" transform="rotate(-30 135 75)" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.5" />
    {/* Sparkle cleanliness stars */}
    <path d="M100 35L103 43L111 46L103 49L100 57L97 49L89 46L97 43L100 35Z" fill="#10B981" />
    <path d="M225 35L227 41L233 43L227 45L225 51L223 45L217 43L223 41L225 35Z" fill="#10B981" />
  </svg>
);

// ৬. অসুস্থ মুরগি শনাক্ত হলে আলাদা করা (কোয়ারেন্টাইন)
export const SickBirdIsolationIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FFF1F2" />
    {/* Main Flock healthy side */}
    <rect x="20" y="25" width="115" height="95" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
    <text x="32" y="44" fill="#047857" fontSize="11" fontWeight="bold">সুস্থ মুরগির শেড</text>
    {/* Healthy chicken silhouette */}
    <ellipse cx="75" cy="85" rx="18" ry="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
    <circle cx="88" cy="72" r="8" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
    <path d="M88 64C88 62 90 60 92 64" stroke="#EF4444" strokeWidth="2" />
    <path d="M96 72L102 75L96 77V72Z" fill="#F59E0B" />
    {/* Dividing Isolation Barrier */}
    <line x1="145" y1="20" x2="145" y2="120" stroke="#E11D48" strokeWidth="3" strokeDasharray="5 5" />
    {/* Separate Sick Isolation Cage */}
    <rect x="155" y="25" width="105" height="95" rx="8" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2.5" />
    <text x="165" y="44" fill="#DC2626" fontSize="11" fontWeight="bold">আলাদা কোয়ারেন্টাইন</text>
    {/* Drooping/sick chicken icon */}
    <ellipse cx="205" cy="88" rx="16" ry="12" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
    <circle cx="218" cy="82" r="7" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
    {/* Drooping head */}
    <path d="M224 84L229 88L224 90V84Z" fill="#D97706" />
    {/* Medical Cross */}
    <circle cx="240" cy="55" r="9" fill="#EF4444" />
    <path d="M240 50V60M235 55H245" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ৭. কর্মীদের শেডের মধ্যে চলাচল নিয়ন্ত্রণ (ছোট থেকে বড় শেড)
export const WorkerMovementIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F8FAFC" />
    {/* Shed 1: Young Chicks */}
    <rect x="25" y="35" width="80" height="75" rx="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" />
    <text x="32" y="55" fill="#854D0E" fontSize="10" fontWeight="bold">শেড ১: কচি বাচ্চা</text>
    <circle cx="55" cy="85" r="8" fill="#FBBF24" />
    <circle cx="75" cy="85" r="8" fill="#FBBF24" />
    {/* Direction Arrow: Step 1 to Step 2 */}
    <path d="M115 72H165M165 72L155 64M165 72L155 80" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <text x="122" y="60" fill="#047857" fontSize="10" fontWeight="bold">১ম → ২য়</text>
    {/* Shed 2: Older Broilers */}
    <rect x="175" y="35" width="80" height="75" rx="6" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" />
    <text x="182" y="55" fill="#334155" fontSize="10" fontWeight="bold">শেড ২: বড় মুরগি</text>
    <ellipse cx="215" cy="85" rx="14" ry="10" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
  </svg>
);

// ৮. বন্য পাখি ও প্রাণীর প্রবেশ সীমিত করা (তারের জালি)
export const WildBirdExclusionIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F0FDF4" />
    {/* Shed Wall & Wire Netting Window */}
    <rect x="70" y="20" width="140" height="100" rx="6" fill="#FFFFFF" stroke="#047857" strokeWidth="3" />
    {/* Fine Wire Mesh Pattern */}
    <line x1="70" y1="45" x2="210" y2="45" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="70" y1="70" x2="210" y2="70" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="70" y1="95" x2="210" y2="95" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="105" y1="20" x2="105" y2="120" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="140" y1="20" x2="140" y2="120" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="175" y1="20" x2="175" y2="120" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Wild Bird Outside Blocked */}
    <path d="M30 45Q45 35 60 45Q45 55 30 45Z" fill="#78716C" />
    <path d="M45 40L40 25L55 35" stroke="#78716C" strokeWidth="2" />
    {/* Red cross on wild bird entering */}
    <circle cx="50" cy="70" r="14" fill="#EF4444" />
    <path d="M43 63L57 77M57 63L43 77" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    {/* Rat Trap Icon */}
    <rect x="220" y="80" width="35" height="18" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
    <path d="M230 80L240 70L248 80" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

// ৯. খাবার দূষণ থেকে রক্ষা করা (উঁচু প্যালেট ও শুকনো খাদ্য)
export const FeedProtectionIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FFFBEB" />
    {/* Floor Ground */}
    <rect y="120" width="280" height="20" fill="#E5E7EB" />
    {/* Moisture droplets indicator on floor */}
    <path d="M35 125C35 125 32 129 32 131C32 132 33 133 35 133C37 133 38 132 38 131C38 129 35 125 35 125Z" fill="#60A5FA" />
    {/* Elevated Wooden Pallet (মাচা) */}
    <rect x="70" y="105" width="140" height="12" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="2" />
    <rect x="80" y="117" width="12" height="6" fill="#78350F" />
    <rect x="134" y="117" width="12" height="6" fill="#78350F" />
    <rect x="188" y="117" width="12" height="6" fill="#78350F" />
    {/* Feed Sacks on Pallet */}
    <rect x="85" y="55" width="50" height="50" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
    <text x="96" y="85" fill="#B45309" fontSize="10" fontWeight="bold">খাদ্য</text>
    <rect x="145" y="55" width="50" height="50" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
    <text x="156" y="85" fill="#B45309" fontSize="10" fontWeight="bold">খাদ্য</text>
    {/* Protective Plastic Tarp */}
    <path d="M75 50C100 42 180 42 205 50" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
    {/* Height 6 inch label badge */}
    <rect x="215" y="90" width="50" height="22" rx="4" fill="#047857" />
    <text x="221" y="105" fill="#FFFFFF" fontSize="9" fontWeight="bold">উঁচু মাচা</text>
  </svg>
);

// ১০. পানির ব্যবস্থা পরিষ্কার রাখা (ট্যাংক ও পাইপলাইন ফ্ল্যাশ)
export const WaterSystemIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F0F9FF" />
    {/* Water Tank */}
    <rect x="40" y="25" width="65" height="75" rx="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
    <ellipse cx="72" cy="25" rx="32" ry="6" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2" />
    <text x="50" y="65" fill="#0369A1" fontSize="11" fontWeight="bold">ট্যাংক</text>
    {/* Covered Lid */}
    <rect x="52" y="15" width="40" height="8" rx="2" fill="#0369A1" />
    {/* Pipe line */}
    <path d="M105 75H230V105" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
    {/* Flushing Flush Valve opened */}
    <circle cx="180" cy="75" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
    {/* Clean Water Jet from pipe end */}
    <path d="M230 105L215 125H245L230 105Z" fill="#38BDF8" opacity="0.8" />
    <circle cx="220" cy="130" r="3" fill="#0284C7" />
    <circle cx="230" cy="133" r="4" fill="#0284C7" />
    <circle cx="240" cy="129" r="3" fill="#0284C7" />
    {/* Clean indicator spark */}
    <path d="M140 45L143 51L149 53L143 55L140 61L137 55L131 53L137 51L140 45Z" fill="#10B981" />
  </svg>
);

// ১১. মৃত মুরগি ও বর্জ্য সঠিকভাবে ব্যবস্থাপনা (গর্ত ও চুন)
export const DeadBirdDisposalIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F5F5F4" />
    {/* Ground Surface */}
    <rect y="45" width="280" height="95" fill="#D6D3D1" />
    <line x1="0" y1="45" x2="280" y2="45" stroke="#78716C" strokeWidth="3" />
    {/* Deep Burial Pit */}
    <rect x="90" y="45" width="100" height="85" fill="#78716C" />
    {/* Lime Powder Layer (চুন) */}
    <rect x="95" y="105" width="90" height="18" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="1" />
    <text x="125" y="118" fill="#44403C" fontSize="10" fontWeight="bold">চুন (Lime)</text>
    {/* Buried waste representation */}
    <rect x="100" y="80" width="80" height="20" rx="4" fill="#A8A29E" />
    {/* Shovel */}
    <line x1="45" y1="30" x2="70" y2="85" stroke="#B45309" strokeWidth="4" />
    <path d="M65 80L80 90L72 100L57 90Z" fill="#57534E" />
    {/* Safety depth label */}
    <rect x="205" y="65" width="60" height="24" rx="4" fill="#DC2626" />
    <text x="210" y="81" fill="#FFFFFF" fontSize="9" fontWeight="bold">৩ ফুট গর্ত</text>
  </svg>
);

// ১২. আগের সমস্যার সমাধান পুনরায় পরীক্ষা করা (ভেরিফিকেশন)
export const ActionVerificationIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#ECFDF5" />
    {/* Inspector Clipboard */}
    <rect x="50" y="25" width="75" height="95" rx="6" fill="#FFFFFF" stroke="#047857" strokeWidth="3" />
    <rect x="72" y="18" width="30" height="12" rx="3" fill="#047857" />
    {/* Checklist lines with checkmarks */}
    <circle cx="65" cy="48" r="6" fill="#10B981" />
    <path d="M62 48L64 50L68 46" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="77" y1="48" x2="112" y2="48" stroke="#6EE7B7" strokeWidth="2.5" />
    <circle cx="65" cy="68" r="6" fill="#10B981" />
    <path d="M62 68L64 70L68 66" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="77" y1="68" x2="112" y2="68" stroke="#6EE7B7" strokeWidth="2.5" />
    <circle cx="65" cy="88" r="6" fill="#10B981" />
    <path d="M62 88L64 90L68 86" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="77" y1="88" x2="112" y2="88" stroke="#6EE7B7" strokeWidth="2.5" />
    {/* Large Completed Shield Badge */}
    <circle cx="195" cy="70" r="38" fill="#10B981" stroke="#047857" strokeWidth="4" />
    <path d="M180 70L190 80L212 58" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <text x="155" y="122" fill="#047857" fontSize="10" fontWeight="bold">কাজ সম্পন্ন ও রেকর্ড</text>
  </svg>
);

/**
 * Helper component that renders the matching illustration for each topic
 */
export const TopicIllustration: React.FC<{ topicOrder: number; className?: string }> = ({
  topicOrder,
  className,
}) => {
  switch (topicOrder) {
    case 1:
      return <VisitorEntryIllustration className={className} />;
    case 2:
      return <FootwearIllustration className={className} />;
    case 3:
      return <HandwashingIllustration className={className} />;
    case 4:
      return <VehicleControlIllustration className={className} />;
    case 5:
      return <EquipmentCleaningIllustration className={className} />;
    case 6:
      return <SickBirdIsolationIllustration className={className} />;
    case 7:
      return <WorkerMovementIllustration className={className} />;
    case 8:
      return <WildBirdExclusionIllustration className={className} />;
    case 9:
      return <FeedProtectionIllustration className={className} />;
    case 10:
      return <WaterSystemIllustration className={className} />;
    case 11:
      return <DeadBirdDisposalIllustration className={className} />;
    case 12:
      return <ActionVerificationIllustration className={className} />;
    default:
      return <ActionVerificationIllustration className={className} />;
  }
};

// ১৩. টিকা প্রদান ও কোল্ড চেইন সংরক্ষণ (Vaccination)
export const VaccinationIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#EFF6FF" />
    {/* Vaccine Ice Box (Cold Chain) */}
    <rect x="25" y="45" width="70" height="65" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
    <rect x="20" y="38" width="80" height="12" rx="3" fill="#1D4ED8" />
    <text x="32" y="75" fill="#FFFFFF" fontSize="10" fontWeight="bold">ভ্যাকসিন বক্স</text>
    <rect x="42" y="82" width="36" height="16" rx="3" fill="#DBEAFE" />
    <text x="47" y="94" fill="#1E40AF" fontSize="9" fontWeight="bold">২°-৮°C</text>
    {/* Syringe */}
    <g transform="translate(110, 30)">
      <rect x="15" y="25" width="55" height="18" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
      <rect x="20" y="27" width="35" height="14" rx="2" fill="#38BDF8" opacity="0.6" />
      <line x1="28" y1="25" x2="28" y2="30" stroke="#0284C7" strokeWidth="1.5" />
      <line x1="38" y1="25" x2="38" y2="30" stroke="#0284C7" strokeWidth="1.5" />
      <line x1="48" y1="25" x2="48" y2="30" stroke="#0284C7" strokeWidth="1.5" />
      <path d="M70 34H95" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      {/* Needle drop */}
      <circle cx="98" cy="34" r="2.5" fill="#0284C7" />
      <path d="M15 34H0M-5 24V44M-5 34H0" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    {/* Healthy Animal Silhouette Receiving Care */}
    <ellipse cx="225" cy="80" rx="32" ry="22" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
    <circle cx="205" cy="65" r="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
    <path d="M198 55L200 62M212 55L210 62" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
    {/* Protective Green Shield */}
    <circle cx="235" cy="45" r="18" fill="#10B981" />
    <path d="M228 45L233 50L243 40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="115" y="115" fill="#0369A1" fontSize="10" fontWeight="bold">ভেটেরিনারি অনুমোদিত প্রতিষেধক</text>
  </svg>
);

// ১৪. কৃমিনাশক কার্যক্রম ও ওজন পরিমাপ (Deworming)
export const DewormingIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FAF5FF" />
    {/* Medicine Bottle & Spoon / Drenching gun */}
    <rect x="30" y="45" width="45" height="65" rx="8" fill="#A855F7" stroke="#7E22CE" strokeWidth="2.5" />
    <rect x="42" y="32" width="21" height="14" rx="2" fill="#7E22CE" />
    <rect x="36" y="65" width="33" height="30" rx="4" fill="#FFFFFF" />
    <text x="40" y="84" fill="#7E22CE" fontSize="9" fontWeight="bold">কৃমিনাশক</text>
    {/* Weight Measuring Tape ribbon */}
    <path d="M100 95C120 70 160 70 180 95C195 110 160 120 140 115" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6 3" strokeLinecap="round" />
    <rect x="125" y="60" width="60" height="22" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
    <text x="130" y="75" fill="#92400E" fontSize="9" fontWeight="bold">ওজন মেপে ডোজ</text>
    {/* Animal digestion / health icon */}
    <ellipse cx="230" cy="80" rx="30" ry="20" fill="#FFFFFF" stroke="#9333EA" strokeWidth="2.5" />
    <circle cx="212" cy="65" r="12" fill="#FFFFFF" stroke="#9333EA" strokeWidth="2.5" />
    <circle cx="235" cy="40" r="16" fill="#8B5CF6" />
    <text x="228" y="45" fill="#FFFFFF" fontSize="14" fontWeight="black">✓</text>
    <text x="100" y="132" fill="#6B21A8" fontSize="10" fontWeight="bold">ওজন অনুযায়ী সঠিক মাত্রায় প্রদান</text>
  </svg>
);

// ১৫. নতুন প্রাণীর পৃথক বাসস্থান (Quarantine Shed)
export const QuarantineShedIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FFFBEB" />
    {/* Main Shed */}
    <rect x="20" y="35" width="85" height="75" rx="6" fill="#DCFCE7" stroke="#059669" strokeWidth="2.5" />
    <text x="28" y="55" fill="#047857" fontSize="10" fontWeight="bold">মূল খামার শেড</text>
    {/* Distance / Buffer zone indicator */}
    <line x1="115" y1="75" x2="165" y2="75" stroke="#D97706" strokeWidth="3" strokeDasharray="4 4" />
    <text x="120" y="68" fill="#B45309" fontSize="9" fontWeight="bold">দূরত্ব বজায়</text>
    {/* Quarantine Shed 14 Days */}
    <rect x="175" y="35" width="85" height="75" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2.5" />
    <text x="180" y="55" fill="#DC2626" fontSize="10" fontWeight="bold">কোয়ারেন্টাইন শেড</text>
    {/* 14 Days Notice Badge */}
    <rect x="188" y="70" width="60" height="24" rx="4" fill="#EF4444" />
    <text x="194" y="86" fill="#FFFFFF" fontSize="10" fontWeight="bold">১৪ দিন আলাদা</text>
  </svg>
);

// ১৬. খামার বন্ধু ম্যাসকট ইলাস্ট্রেশন (Khamar Bondhu Friendly Mascot)
export const KhamarBondhuMascotIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#F0FDF4" />
    {/* Friendly Farmer Mascot Figure */}
    <g transform="translate(45, 15)">
      {/* Straw Hat / মাথাল */}
      <ellipse cx="40" cy="22" rx="35" ry="10" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
      <path d="M22 22C22 10 58 10 58 22" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      {/* Face & Smile */}
      <circle cx="40" cy="35" r="16" fill="#FDE68A" />
      <circle cx="34" cy="32" r="2" fill="#78350F" />
      <circle cx="46" cy="32" r="2" fill="#78350F" />
      <path d="M33 40C36 45 44 45 47 40" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      {/* Green BioShield Vest */}
      <path d="M20 52C20 48 60 48 60 52V95H20V52Z" fill="#064E3B" />
      <path d="M32 52L40 70L48 52" stroke="#FDE68A" strokeWidth="2" fill="#FDE68A" />
      {/* BioShield Icon on Vest */}
      <circle cx="40" cy="78" r="8" fill="#10B981" />
      <path d="M37 78L39 80L43 76" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Waving Friendly Hand */}
      <path d="M60 55L75 42L80 48L65 65" fill="#FDE68A" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    </g>
      {/* Friendly Dialogue Banner */}
    <g transform="translate(135, 30)">
      <rect x="0" y="0" width="130" height="75" rx="12" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
      <path d="M-10 25L0 20V30L-10 25Z" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
      <text x="12" y="24" fill="#064E3B" fontSize="11" fontWeight="bold">আসসালামু আলাইকুম!</text>
      <text x="12" y="42" fill="#047857" fontSize="10" fontWeight="bold">আমি আপনার খামার বন্ধু।</text>
      <text x="12" y="60" fill="#4B5563" fontSize="9">কীভাবে সহায়তা করতে পারি?</text>
    </g>
  </svg>
);

// ১৭. হোম ড্যাশবোর্ড স্বাগতম ইলাস্ট্রেশন (খামারি, গরু, ছাগল ও হাঁস-মুরগি)
export const FarmerWelcomeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="140" rx="18" fill="#064E3B" />
    <circle cx="275" cy="30" r="36" fill="#10B981" opacity="0.2" />
    <circle cx="50" cy="120" r="45" fill="#059669" opacity="0.25" />
    {/* Green pasture base */}
    <path d="M0 108C75 94 220 96 320 108V140H0V108Z" fill="#047857" />
    {/* Small Farm Shed */}
    <path d="M18 85L55 56L92 85V114H18V85Z" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="2" />
    <path d="M12 86L55 50L98 86" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="44" y="88" width="22" height="26" rx="2" fill="#065F46" />
    {/* Friendly Farmer */}
    <g transform="translate(115, 30)">
      <ellipse cx="32" cy="18" rx="26" ry="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      <path d="M19 18C19 8 45 8 45 18" fill="#F59E0B" />
      <circle cx="32" cy="30" r="12" fill="#FDE68A" />
      <path d="M27 33C30 37 34 37 37 33" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="17" y="44" width="30" height="42" rx="8" fill="#10B981" />
      <circle cx="32" cy="62" r="7" fill="#FFFFFF" />
      <path d="M29 62L31 64L35 60" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
    </g>
    {/* Cow Silhouette */}
    <g transform="translate(190, 62)">
      <rect x="10" y="14" width="46" height="28" rx="10" fill="#FFFFFF" />
      <rect x="14" y="38" width="6" height="14" rx="2" fill="#E5E7EB" />
      <rect x="44" y="38" width="6" height="14" rx="2" fill="#E5E7EB" />
      <circle cx="58" cy="18" r="10" fill="#FFFFFF" />
      <path d="M53 9C51 5 55 4 56 8M62 9C64 5 60 4 59 8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="24" r="5" fill="#374151" />
    </g>
    {/* Chickens */}
    <g transform="translate(262, 86)">
      <ellipse cx="18" cy="18" rx="13" ry="10" fill="#FEF3C7" />
      <circle cx="28" cy="11" r="6" fill="#FEF3C7" />
      <path d="M33 11L38 13L33 15Z" fill="#F59E0B" />
    </g>
  </svg>
);

// ১৮. গরম ও আবহাওয়ার চাপ ব্যবস্থাপনা (Heat & Weather Care)
export const HeatStressIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FFFBEB" />
    <circle cx="60" cy="40" r="20" fill="#F59E0B" />
    <path d="M60 12V18M60 62V68M32 40H38M82 40H88" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    {/* Shaded Shed with cool roof */}
    <path d="M110 55L175 28L240 55V115H110V55Z" fill="#FFFFFF" stroke="#047857" strokeWidth="2.5" />
    <path d="M104 56L175 24L246 56" stroke="#0EA5E9" strokeWidth="6" strokeLinecap="round" />
    {/* Cool airflow wave */}
    <path d="M135 80C150 72 165 88 180 80C195 72 210 88 220 80" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
    <text x="135" y="106" fill="#0369A1" fontSize="10" fontWeight="bold">ছায়া ও ঠান্ডা পানি</text>
  </svg>
);

// ১৯. জরুরি পশুচিকিৎসা সহায়তা (Emergency Vet Help)
export const EmergencyVetIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="140" rx="16" fill="#FFF1F2" />
    {/* Medical Bag */}
    <rect x="45" y="45" width="80" height="62" rx="10" fill="#FFFFFF" stroke="#E11D48" strokeWidth="3" />
    <path d="M70 45V35C70 31 73 28 77 28H93C97 28 100 31 100 35V45" stroke="#E11D48" strokeWidth="3" />
    <circle cx="85" cy="76" r="16" fill="#FFE4E6" />
    <path d="M85 67V85M76 76H94" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" />
    {/* Khamar Shurokkha Support Badge */}
    <rect x="148" y="38" width="95" height="68" rx="12" fill="#064E3B" />
    <text x="160" y="64" fill="#A7F3D0" fontSize="11" fontWeight="bold">খামার সুরক্ষা</text>
    <text x="160" y="85" fill="#FFFFFF" fontSize="13" fontWeight="bold">সহায়তা কেন্দ্র</text>
  </svg>
);

export const KnowledgeIllustration: React.FC<{ illustrationKey: string; className?: string }> = ({
  illustrationKey,
  className = 'w-full h-36',
}) => {
  switch (illustrationKey) {
    case 'footbath':
      return <FootwearIllustration className={className} />;
    case 'handwashing':
      return <HandwashingIllustration className={className} />;
    case 'sick_isolation':
      return <SickBirdIsolationIllustration className={className} />;
    case 'dead_burial':
      return <DeadBirdDisposalIllustration className={className} />;
    case 'feed_water':
      return <FeedProtectionIllustration className={className} />;
    case 'pest_control':
      return <WildBirdExclusionIllustration className={className} />;
    case 'vaccination':
      return <VaccinationIllustration className={className} />;
    case 'deworming':
      return <DewormingIllustration className={className} />;
    case 'heat_stress':
      return <HeatStressIllustration className={className} />;
    case 'emergency_vet':
      return <EmergencyVetIllustration className={className} />;
    default:
      return <HandwashingIllustration className={className} />;
  }
};


