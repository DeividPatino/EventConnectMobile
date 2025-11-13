export interface Organizer {
  uid: string;
  email: string;
  companyName: string;
  representativeName?: string;
  nit?: string;
  phone: string;
  website?: string;
  category?: string;
  address?: string;
  city?: string;
  description?: string;
  logo?: string;
  role?: string;
  verified?: boolean;
  socials: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  createdAt?: string; // ISO string
  eventsCount?: number;
  rating?: number;
}
