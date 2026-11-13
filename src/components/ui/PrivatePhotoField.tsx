import React, { useId, useState } from 'react';
import { Camera, LoaderCircle, Trash2 } from 'lucide-react';
import { uploadPrivatePhoto } from '../../lib/farmerApi';
import { Language } from '../../types';
import { ResilientImage } from './ResilientImage';

interface PrivatePhotoFieldProps {
  value?: string;
  onChange: (path: string | undefined) => void;
  lang: Language;
  label?: string;
  disabled?: boolean;
  alt: string;
}

export const PrivatePhotoField: React.FC<PrivatePhotoFieldProps> = ({
  value,
  onChange,
  lang,
  label,
  disabled = false,
  alt,
}) => {
  const id = useId();
  const isBn = lang === 'bn';
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setError('');
    setIsUploading(true);
    try {
      onChange(await uploadPrivatePhoto(file));
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : '';
      setError(
        isBn
          ? message.includes('10 MB') || message.includes('smaller')
            ? 'ছবিটি ১০ MB-এর নিচে রাখুন।'
            : 'ছবিটি আপলোড করা যায়নি। আবার চেষ্টা করুন।'
          : message || 'The photo could not be uploaded. Please try again.'
      );
    } finally {
      setIsUploading(false);
      input.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700" htmlFor={id}>
        {label || (isBn ? 'ছবি (ঐচ্ছিক)' : 'Photo (optional)')}
      </label>
      {value && (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
            <ResilientImage src={value} alt={alt} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-xs font-semibold text-emerald-800">
              {isBn ? 'ব্যক্তিগতভাবে সংরক্ষিত' : 'Stored privately'}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {isBn ? 'শুধু আপনার অ্যাকাউন্ট থেকে দেখা যাবে।' : 'Only your account can access this photo.'}
            </p>
          </div>
          <button
            aria-label={isBn ? 'ছবি সরান' : 'Remove photo'}
            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
            disabled={disabled || isUploading}
            onClick={() => { onChange(undefined); setError(''); }}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
            disabled || isUploading
              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
              : 'cursor-pointer border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
          }`}
          htmlFor={id}
        >
          {isUploading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Camera aria-hidden="true" className="h-4 w-4" />}
          <span>
            {isUploading
              ? isBn ? 'আপলোড হচ্ছে…' : 'Uploading…'
              : value
                ? isBn ? 'অন্য ছবি বাছুন' : 'Choose another photo'
                : isBn ? 'ছবি বাছুন' : 'Choose a photo'}
          </span>
        </label>
        <input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={disabled || isUploading}
          id={id}
          onChange={(event) => void handleFileChange(event)}
          type="file"
        />
        <span className="text-[11px] text-slate-500">JPG, PNG, WebP · max 10 MB</span>
      </div>
      {disabled && (
        <p className="text-[11px] text-slate-500">
          {isBn ? 'ছবি যোগ করতে মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন।' : 'Sign in with your mobile number and password to add a photo.'}
        </p>
      )}
      {error && <p className="text-xs font-semibold text-rose-700" role="alert">{error}</p>}
    </div>
  );
};
