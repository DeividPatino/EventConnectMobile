export interface Order {
  id: string;
  userUid: string;
  eventId: string;
  zoneId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'paid' | 'pending' | 'failed';
  ticketIds: string[];
  createdAt: any;
  paymentMethod?: string;
}
