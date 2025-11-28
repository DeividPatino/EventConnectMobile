export interface EventCity { id: string; name: string; }
export interface EventStadium { name: string; capacity: number; mapBase64?: string; zones?: { id?: string; name: string; capacity: number; price?: number }[]; }

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  date: any; // string | Date depending on how stored
  address?: string;
  city?: EventCity | null;
  stadium?: EventStadium | null;
  image?: string | null;
  map?: string | null;
  organizerUid: string;
  zonesCount?: number; // optional aggregated field
  ticketsSold?: number; // optional aggregated field
}
