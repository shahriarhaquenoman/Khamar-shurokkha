import React from 'react';
import { Species, LivestockSpecies, PoultrySpecies, Language } from '../../types';
import { Check } from 'lucide-react';

interface SpeciesSelectCardProps {
  species: Species;
  isSelected: boolean;
  onSelect: (species: Species) => void;
  lang?: Language;
  count?: number;
}

export const SpeciesSelectCard: React.FC<SpeciesSelectCardProps> = ({
  species,
  isSelected,
  onSelect,
  lang = 'bn',
  count,
}) => {
  const isBn = lang === 'bn';

  const speciesMetadata: Record<
    Species,
    {
      nameBn: string;
      nameEn: string;
      emoji: string;
      badgeColor: string;
      descBn: string;
      descEn: string;
    }
  > = {
    cattle: {
      nameBn: 'গরু / গাভী',
      nameEn: 'Cattle',
      emoji: '🐄',
      badgeColor: 'from-amber-500/10 to-amber-600/20 text-amber-900 border-amber-300',
      descBn: 'দুধ ও মাংস উৎপাদন',
      descEn: 'Dairy & Beef',
    },
    buffalo: {
      nameBn: 'মহিষ',
      nameEn: 'Buffalo',
      emoji: '🐃',
      badgeColor: 'from-stone-500/10 to-stone-600/20 text-stone-900 border-stone-300',
      descBn: 'উচ্চ চর্বিযুক্ত দুধ ও মাংস',
      descEn: 'High-fat Milk & Meat',
    },
    goat: {
      nameBn: 'ছাগল (ব্ল্যাক বেঙ্গল)',
      nameEn: 'Goat',
      emoji: '🐐',
      badgeColor: 'from-emerald-500/10 to-emerald-600/20 text-emerald-900 border-emerald-300',
      descBn: 'মাংস ও দ্রুত বর্ধনশীল',
      descEn: 'Chevon & Prolific',
    },
    sheep: {
      nameBn: 'ভেড়া (গাড়ল)',
      nameEn: 'Sheep',
      emoji: '🐑',
      badgeColor: 'from-teal-500/10 to-teal-600/20 text-teal-900 border-teal-300',
      descBn: 'মাংস ও পশম',
      descEn: 'Mutton & Wool',
    },
    chicken_broiler: {
      nameBn: 'ব্রয়লার মুরগি',
      nameEn: 'Broiler',
      emoji: '🍗',
      badgeColor: 'from-orange-500/10 to-orange-600/20 text-orange-900 border-orange-300',
      descBn: 'দ্রুত মাংস উৎপাদন (৩৫ দিন)',
      descEn: 'Meat batch (35 days)',
    },
    chicken_layer: {
      nameBn: 'লেয়ার মুরগি',
      nameEn: 'Layer',
      emoji: '🥚',
      badgeColor: 'from-yellow-500/10 to-yellow-600/20 text-yellow-900 border-yellow-300',
      descBn: 'বাণিজ্যিক ডিম উৎপাদন',
      descEn: 'Commercial Egg',
    },
    chicken_sonali: {
      nameBn: 'সোনালী মুরগি',
      nameEn: 'Sonali Chicken',
      emoji: '🐓',
      badgeColor: 'from-amber-500/10 to-amber-600/20 text-amber-900 border-amber-300',
      descBn: 'দেশি স্বাদের মাংস ও সহনশীল',
      descEn: 'Crossbreed hardy',
    },
    duck: {
      nameBn: 'হাঁস (খাকি ক্যাম্পবেল)',
      nameEn: 'Duck',
      emoji: '🦆',
      badgeColor: 'from-cyan-500/10 to-cyan-600/20 text-cyan-900 border-cyan-300',
      descBn: 'ডিম ও জলাশয় উপযোগী',
      descEn: 'Egg & Wetland',
    },
  };

  const meta = speciesMetadata[species] || speciesMetadata.cattle;

  return (
    <div
      onClick={() => onSelect(species)}
      className={`relative p-3.5 sm:p-4 rounded-2xl cursor-pointer border-2 transition-all duration-150 flex items-center justify-between select-none ${
        isSelected
          ? 'bg-emerald-50/80 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br border shadow-2xs ${meta.badgeColor}`}
        >
          {meta.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {isBn ? meta.nameBn : meta.nameEn}
            </h4>
            {count !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 font-mono">
                {count}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            {isBn ? meta.descBn : meta.descEn}
          </p>
        </div>
      </div>

      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
          isSelected
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'border-slate-300 bg-white'
        }`}
      >
        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
      </div>
    </div>
  );
};
