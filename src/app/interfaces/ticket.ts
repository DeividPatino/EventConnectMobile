export interface Ticket {
  id: string;
  userUid: string;
  zoneId: string;
  purchaseDate: any;
  status: 'active' | 'canceled' | 'used';
  code?: string;
}
