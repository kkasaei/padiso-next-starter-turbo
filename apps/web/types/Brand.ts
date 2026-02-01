// the prupose of this file is to capture the interfaces to be able to build database schema and queries



export type SetupMode = 'quick' | 'guided';

export type Language = 
  | 'en-US' 
  | 'en-GB' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'pt' 
  | 'it'
  | 'nl'
  | 'pl'
  | 'ru'
  | 'ja'
  | 'zh'
  | 'ko'
  | 'ar'
  | 'hi'
  | 'bg'
  | 'hu'
  | 'hr';

export type ReferralSource = 
  | 'facebook' 
  | 'instagram' 
  | 'google' 
  | 'email' 
  | 'reddit' 
  | 'linkedin' 
  | 'other';


export const LANGUAGES: { id: Language; label: string; flag?: string }[] = [
  { id: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { id: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
  { id: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'it', label: 'Italian', flag: '🇮🇹' },
  { id: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { id: 'pl', label: 'Polish', flag: '🇵🇱' },
  { id: 'ru', label: 'Russian', flag: '🇷🇺' },
  { id: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { id: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { id: 'ko', label: 'Korean', flag: '🇰🇷' },
  { id: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { id: 'bg', label: 'Bulgarian', flag: '🇧🇬' },
  { id: 'hu', label: 'Hungarian', flag: '🇭🇺' },
  { id: 'hr', label: 'Croatian', flag: '🇭🇷' },
];

export const REFERRAL_SOURCES: { id: ReferralSource; label: string }[] = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'google', label: 'Google' },
  { id: 'email', label: 'Email' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'other', label: 'Other' },
];


export interface Brand {
    // Step 1: Website URL
    websiteUrl?: string;
    
    // Step 2: Languages
    languages?: Language[];
    
    // Step 3: Business Description
    description?: string;
    targetAudiences?: string[];
    businessKeywords?: string[];
    
    // Step 4: Competitors (Optional)
    competitors?: string[];
    
    // Step 5: Brand
    brandName?: string;
    brandColor?: string;
    sitemapUrl?: string;
    
    // Step 6: Survey (Optional)
    referralSource?: ReferralSource;
  }