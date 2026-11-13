import React from 'react';
import { AnimalProfile, FlockProfile, FarmProfile, Language } from '../types';
import { toBanglaNum } from '../translations';
import {
  QrCode,
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

interface IDCardModalProps {
  item: AnimalProfile | FlockProfile;
  farm: FarmProfile;
  type: 'animal' | 'flock';
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const IDCardModal: React.FC<IDCardModalProps> = ({
  item,
  farm,
  type,
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const isAnimal = type === 'animal';
  const animal = isAnimal ? (item as AnimalProfile) : null;
  const flock = !isAnimal ? (item as FlockProfile) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">
              {isAnimal
                ? isBn ? 'ডিজিটাল প্রাণী পরিচয়পত্র' : 'Digital Animal ID Card'
                : isBn ? 'ডিজিটাল পোল্ট্রি ফ্লক পরিচয়পত্র' : 'Digital Flock ID Card'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Card Viewable for Printing */}
        <div className="p-6 space-y-4">
          <div className="rounded-2xl border-2 border-emerald-700 bg-gradient-to-b from-emerald-50 via-white to-slate-50 p-5 shadow-sm relative overflow-hidden print-area">
            {/* Watermark ribbon */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  KS
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-xs">
                    খামার সুরক্ষা (Khamar Shurokkha)
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {farm.name} · {farm.district}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {isAnimal ? 'ANIMAL ID' : 'FLOCK ID'}
              </span>
            </div>

            {/* Profile Content */}
            <div className="flex items-start gap-4">
              {isAnimal && animal ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {animal.photoUrl ? (
                    <img
                      src={animal.photoUrl}
                      alt={animal.nameOrTag}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {animal.species === 'cattle'
                        ? '🐄'
                        : animal.species === 'buffalo'
                        ? '🐃'
                        : animal.species === 'goat'
                        ? '🐐'
                        : '🐑'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0">
                  🐓
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-800">
                  {item.id}
                </div>
                <div className="text-base font-black text-slate-900 truncate">
                  {isAnimal && animal ? animal.nameOrTag : flock?.batchName}
                </div>
                <div className="text-xs text-slate-600">
                  {isAnimal && animal ? (
                    <span>
                      {animal.breed} · {animal.sex === 'male' ? (isBn ? 'পুরুষ' : 'Male') : (isBn ? 'স্ত্রী' : 'Female')}
                    </span>
                  ) : (
                    <span>
                      {flock?.poultryType} · {toBanglaNum(flock?.currentBirdCount || 0, lang)} {isBn ? 'পাখি' : 'birds'}
                    </span>
                  )}
                </div>
                {isAnimal && animal?.tagNumber && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    ট্যাগ নং: {animal.tagNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Faux QR Code for Scanning / Digital Identity */}
            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-800">
                  {isBn ? 'স্ক্যান করে প্রোফাইল দেখুন' : 'Scan for Animal Profile'}
                </div>
                <div className="text-[10px] text-slate-600">
                  নিবন্ধনের তারিখ: {toBanglaNum(item.createdAt || '2026-11-10', lang)}
                </div>
              </div>

              {/* Realistic SVG QR code */}
              <div className="w-14 h-14 bg-white border border-slate-300 rounded p-1 shrink-0 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>

            <div className="mt-2 text-center text-[9px] text-slate-600">
              {isBn
                ? '* এটি খামার অভ্যন্তরীণ ডিজিটাল ট্র্যাকিং পরিচয়পত্র, সরকারি লাইসেন্স নয়।'
                : '* Farm-level digital identification card for internal record keeping.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
