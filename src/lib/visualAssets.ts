import farmHeroImg from '../assets/images/bd_farm_hero_1794547738389.jpg';
import cattleGoatImg from '../assets/images/bd_cattle_goat_1794547737547.jpg';
import poultryBiosecurityImg from '../assets/images/bd_poultry_biosecurity_1794547737936.jpg';
import vetConsultationImg from '../assets/images/bd_vet_consultation_1794547739652.jpg';
import featurePhoneImg from '../assets/images/bd_rural_feature_phone_1794547740283.jpg';
import waterFeedCareImg from '../assets/images/bd_water_feed_care_1794547740694.jpg';
import { KnowledgeCategory, Species } from '../types';

export const FARM_VISUAL_ASSETS = {
  farmHero: farmHeroImg,
  cattleGoat: cattleGoatImg,
  poultryBiosecurity: poultryBiosecurityImg,
  vetConsultation: vetConsultationImg,
  featurePhone: featurePhoneImg,
  waterFeedCare: waterFeedCareImg,
} as const;

export function getSpeciesFallbackImage(species: Species): {
  src: string;
  altBn: string;
  altEn: string;
} {
  switch (species) {
    case 'chicken_broiler':
    case 'chicken_layer':
    case 'chicken_sonali':
      return {
        src: poultryBiosecurityImg,
        altBn: 'বাংলাদেশি মুরগির পরিচ্ছন্ন শেড ও জীবাণুনাশক ফুটবাথ',
        altEn: 'Clean Bangladeshi poultry shed with disinfectant footbath',
      };
    case 'duck':
      return {
        src: waterFeedCareImg,
        altBn: 'পরিষ্কার পানি ও নিরাপদ খাবারের ব্যবস্থাযুক্ত গ্রামীণ হাঁসের খামার',
        altEn: 'Rural Bangladeshi duck farm with clean water and feed storage',
      };
    case 'cattle':
    case 'buffalo':
    case 'goat':
    case 'sheep':
    default:
      return {
        src: cattleGoatImg,
        altBn: 'বাংলাদেশি খামারে সুস্থ গরু ও ব্ল্যাক বেঙ্গল ছাগল',
        altEn: 'Healthy cattle and Black Bengal goat in a Bangladeshi farm shed',
      };
  }
}

export function getKnowledgeTopicImage(category: KnowledgeCategory): {
  src: string;
  altBn: string;
  altEn: string;
} {
  switch (category) {
    case 'daily_hygiene':
    case 'quarantine':
      return {
        src: poultryBiosecurityImg,
        altBn: 'শেডের প্রবেশমুখে ফুটবাথ ও পরিচ্ছন্নতার অভ্যাস',
        altEn: 'Disinfectant footbath and shed biosecurity practice',
      };
    case 'vaccine_deworming':
    case 'emergency_vet':
      return {
        src: vetConsultationImg,
        altBn: 'খামারির সাথে পশুচিকিৎসকের পরামর্শ ও প্রাথমিক পরীক্ষা',
        altEn: 'Livestock veterinarian consulting with farmer beside cow',
      };
    case 'feed_water':
    case 'seasonal_care':
    default:
      return {
        src: waterFeedCareImg,
        altBn: 'মাচার ওপর শুকনো খাবার ও ঢাকনাযুক্ত পরিষ্কার পানির পাত্র',
        altEn: 'Raised dry feed sacks and covered clean water trough',
      };
  }
}
