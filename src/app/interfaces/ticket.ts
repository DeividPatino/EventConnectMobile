export interface Ticket {
  id: string;
  userUid: string;
  zoneId: string;
  eventId: string;
  purchaseDate: any;
  status: 'active' | 'canceled' | 'used';
  code?: string;

  eventName?: string;
  eventImage?: string | null;
  zoneName?: string; // añadido para mostrar nombre de zona en UI
}
