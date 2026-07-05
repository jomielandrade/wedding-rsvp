export type AttendanceStatus = "attending" | "declining";

export interface CoupleInfo {
  partnerOne: string;
  partnerTwo: string;
  displayNames: string;
  hashtag?: string;
}

export interface VenueDetails {
  name: string;
  address: string;
  time: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
}

export interface StoryMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface GodparentGroup {
  title: string;
  names: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface GiftRegistryConfig {
  message: string;
  gcash?: {
    enabled: boolean;
    accountName: string;
    mobileNumber: string;
    qrImage?: string;
  };
  bank?: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  customImage?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: "instagram" | "facebook" | "twitter" | "tiktok";
}

export interface WeddingScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface GuestInvite {
  slug: string;
  fullName: string;
}

export interface WeddingConfig {
  couple: CoupleInfo;
  weddingDate: string;
  weddingDateDisplay: string;
  weddingTime: string;
  timezone: string;
  location: string;
  ceremony: VenueDetails;
  reception: VenueDetails;
  schedule: WeddingScheduleItem[];
  story: StoryMilestone[];
  godparents: GodparentGroup[];
  gallery: GalleryImage[];
  faq: FaqItem[];
  giftRegistry: GiftRegistryConfig;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  music?: {
    enabled: boolean;
    src: string;
    title: string;
  };
  rsvp: {
    deadline: string;
    emailConfirmation: boolean;
  };
  guests: GuestInvite[];
}

export interface RsvpRecord {
  id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  attendance: AttendanceStatus;
  guest_count: number;
  song_request: string | null;
  message: string | null;
  created_at: string;
}

export interface RsvpFormData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  guestCount: number;
  attendance: AttendanceStatus;
  songRequest?: string;
  message?: string;
}
