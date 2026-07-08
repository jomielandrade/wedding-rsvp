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
  /** Optional override. When omitted, embed URL is built from name + address. */
  mapsEmbedUrl?: string;
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

export interface DressCodeColor {
  id: string;
  name: string;
  hex: string;
}

export interface DressCodeConfig {
  title: string;
  description: string;
  colors: DressCodeColor[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrImage?: string;
  enabled?: boolean;
}

export interface GiftRegistryConfig {
  message: string;
  banks: BankAccount[];
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
  /** Max guests allowed on this invite (defaults to 1) */
  maxGuests?: number;
}

export interface GuestRecord {
  id: string;
  slug: string;
  full_name: string;
  max_guests: number;
  first_opened_at: string | null;
  last_opened_at: string | null;
  open_count: number;
  created_at: string;
  updated_at: string;
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
  /** Optional link to a shared album (e.g. iCloud) for guests who want more photos. */
  gallerySharedAlbumUrl?: string;
  dressCode: DressCodeConfig;
  faq: FaqItem[];
  giftRegistry: GiftRegistryConfig;
  contact: ContactInfo;
  socialLinks: SocialLink[];
  rsvp: {
    deadline: string;
    emailConfirmation: boolean;
  };
}

export interface RsvpRecord {
  id: string;
  invite_slug: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  attendance: AttendanceStatus;
  guest_count: number;
  companion_names: string[];
  message: string | null;
  created_at: string;
}

export interface RsvpFormData {
  inviteSlug: string;
  mobileNumber: string;
  email?: string;
  guestCount: number;
  attendance: AttendanceStatus;
  message?: string;
}
