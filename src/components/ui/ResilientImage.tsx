import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { ImageOff } from 'lucide-react';
import { getPrivatePhotoUrl } from '../../lib/farmerApi';

interface ResilientImageProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackLabel?: string;
  fallbackIcon?: React.ReactNode;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  fallbackLabel,
  fallbackIcon,
}) => {
  const privatePath = src?.startsWith('farm-media://') ? src : null;
  const { data: signedUrl } = useSWR(
    privatePath ? `private-photo:${privatePath}` : null,
    () => getPrivatePhotoUrl(privatePath as string),
    { revalidateOnFocus: false, refreshInterval: 25 * 60 * 1000, shouldRetryOnError: false }
  );
  const requestedSrc = privatePath ? signedUrl : src;
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(requestedSrc || fallbackSrc);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(requestedSrc || fallbackSrc);
    setHasFailed(false);
  }, [requestedSrc, fallbackSrc]);

  if (privatePath && !signedUrl) {
    return <div aria-label={alt} className={`animate-pulse bg-slate-100 ${containerClassName || className}`} role="img" />;
  }

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasFailed(true);
    }
  };

  if (!currentSrc || hasFailed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 text-emerald-900 p-4 text-center ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-2xl bg-white/80 border border-emerald-200 flex items-center justify-center mb-1.5 shadow-2xs">
          {fallbackIcon || <ImageOff className="w-5 h-5 text-emerald-700" />}
        </div>
        {fallbackLabel && (
          <span className="text-[11px] font-bold text-emerald-900/80 leading-tight line-clamp-2">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
