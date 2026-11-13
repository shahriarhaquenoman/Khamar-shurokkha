import { Language } from '../types';

/**
 * KHAMAR SHUROKKHA OFFICIAL CONTACT & USSD CONFIGURATION
 * -------------------------------------------------------
 * Replace the empty defaults below (or configure VITE_KHAMAR_CONTACT_PHONE and
 * VITE_KHAMAR_USSD_CODE) once Khamar Shurokkha's official contact number and
 * telecom USSD short code are officially activated.
 *
 * Leaving these values empty keeps the application in honest placeholder mode:
 * no invented phone numbers are dialed and no sample USSD code is claimed as live.
 */

const ENV_PHONE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KHAMAR_CONTACT_PHONE) || '';
const ENV_USSD =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KHAMAR_USSD_CODE) || '';

export const KHAMAR_OFFICIAL_PHONE_RAW = String(ENV_PHONE).trim(); // Edit e.g. '+88017XXXXXXXX'
export const KHAMAR_OFFICIAL_USSD_RAW = String(ENV_USSD).trim();   // Edit e.g. '*123#'

export const KHAMAR_CONTACT_CONFIG = {
  officialPhone: KHAMAR_OFFICIAL_PHONE_RAW,
  isPhoneConfigured: Boolean(KHAMAR_OFFICIAL_PHONE_RAW),
  placeholderPhone: '+880 1XXX-XXXXXX',

  officialUssdCode: KHAMAR_OFFICIAL_USSD_RAW,
  isUssdOfficiallyActive: Boolean(KHAMAR_OFFICIAL_USSD_RAW),
  placeholderUssdCode: '*XXX#',
  simulatorSampleUssdCode: '*123#',
} as const;

export function getKhamarPhoneDisplay(lang: Language): string {
  if (KHAMAR_CONTACT_CONFIG.isPhoneConfigured) {
    return KHAMAR_CONTACT_CONFIG.officialPhone;
  }
  return lang === 'bn'
    ? '+880 1XXX-XXXXXX (এডিটেবল প্লেসহোল্ডার — নিজস্ব নম্বর যুক্ত করুন)'
    : '+880 1XXX-XXXXXX (Editable Placeholder — Add Official Number)';
}

export function getKhamarPhoneShortLabel(lang: Language): string {
  if (KHAMAR_CONTACT_CONFIG.isPhoneConfigured) {
    return KHAMAR_CONTACT_CONFIG.officialPhone;
  }
  return lang === 'bn' ? '+880 1XXX-XXXXXX (প্লেসহোল্ডার)' : '+880 1XXX-XXXXXX (Placeholder)';
}

export function getKhamarPhoneHref(): string | null {
  if (!KHAMAR_CONTACT_CONFIG.isPhoneConfigured) return null;
  const sanitized = KHAMAR_CONTACT_CONFIG.officialPhone.replace(/[^\d+]/g, '');
  return sanitized ? `tel:${sanitized}` : null;
}

export function getKhamarUssdDisplay(lang: Language): string {
  if (KHAMAR_CONTACT_CONFIG.isUssdOfficiallyActive) {
    return KHAMAR_CONTACT_CONFIG.officialUssdCode;
  }
  return lang === 'bn'
    ? `${KHAMAR_CONTACT_CONFIG.placeholderUssdCode} (অফিসিয়াল কোড এখনো নির্ধারিত বা সক্রিয় নয়)`
    : `${KHAMAR_CONTACT_CONFIG.placeholderUssdCode} (Editable Placeholder — Not Yet Officially Active)`;
}

export function getKhamarUssdShortLabel(): string {
  if (KHAMAR_CONTACT_CONFIG.isUssdOfficiallyActive) {
    return KHAMAR_CONTACT_CONFIG.officialUssdCode;
  }
  return KHAMAR_CONTACT_CONFIG.placeholderUssdCode;
}
