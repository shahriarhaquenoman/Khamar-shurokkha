import React from 'react';
import { FarmProfile, Language } from '../../types';
import { toBanglaNum } from '../../translations';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface FarmCardProps {
  farm: FarmProfile;
  isCurrent: boolean;
  onSelect: (farm: FarmProfile) => void;
  lang?: Language;
}

export const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  isCurrent,
  onSelect,
  lang = 'bn',
}) => {
  const isBn = lang === 'bn';

  return (
    <div
      onClick={() => onSelect(farm)}
      className={`relative p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isCurrent
          ? 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 border-emerald-600 shadow-md ring-4 ring-emerald-500/15'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
      }`}
    >
      <div>
        {/* Top Header: Farm ID and Active Badge */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
              {farm.id}
            </span>
            {farm.isDemo && (
              <StatusBadge variant="demo" size="sm" lang={lang} />
            )}
          </div>

          {isCurrent ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'সক্রিয় খামার' : 'Selected'}</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800">
              <span>{isBn ? 'নির্বাচন করুন' : 'Switch'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Farm Name & Location */}
        <div className="my-3.5 flex items-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs ${
              isCurrent ? 'bg-emerald-800' : 'bg-slate-700'
            }`}
          >
            <Building2 className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
              {farm.name}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">
                {farm.upazila}, {farm.district}
              </span>
            </div>
          </div>
        </div>

        {/* Species Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {farm.speciesPresent &&
            farm.speciesPresent.map((sp) => (
              <StatusBadge key={sp} variant={sp as any} size="sm" lang={lang} />
            ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span className="font-medium">
          {isBn ? 'খামারি:' : 'Owner:'}{' '}
          <strong className="text-slate-800 font-semibold">{farm.ownerName}</strong>
        </span>

        {isCurrent && (
          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
            <span>●</span> {isBn ? 'বর্তমানে সংযুক্ত' : 'Active Connection'}
          </span>
        )}
      </div>
    </div>
  );
};
