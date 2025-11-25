import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, collectionData, docData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Event } from '../../interfaces/event';
import { Zone } from '../../interfaces/zone';
import { Ticket } from '../../interfaces/ticket';

@Injectable({ providedIn: 'root' })
export class EventsService {
  constructor(private firestore: Firestore) {}

  getOrganizerEvents(uid: string): Observable<Event[]> {
    const ref = collection(this.firestore, 'events');
    const q = query(ref, where('organizerUid', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<Event[]>;
  }

  getEvent(eventId: string): Observable<Event | undefined> {
    const ref = doc(this.firestore, `events/${eventId}`);
    return docData(ref, { idField: 'id' }) as Observable<Event | undefined>;
  }

  getZones(eventId: string): Observable<Zone[]> {
    const ref = collection(this.firestore, `events/${eventId}/zones`);
    return collectionData(ref, { idField: 'id' }) as Observable<Zone[]>;
  }

  getAllEvents(): Observable<Event[]> {
    const ref = collection(this.firestore, 'events');
    return collectionData(ref, { idField: 'id' }) as Observable<Event[]>;
  }

  getTickets(eventId: string): Observable<Ticket[]> {
    const ref = collection(this.firestore, `events/${eventId}/tickets`);
    return collectionData(ref, { idField: 'id' }) as Observable<Ticket[]>;
  }

  cancelTicket(eventId: string, ticketId: string): Promise<void> {
    const ref = doc(this.firestore, `events/${eventId}/tickets/${ticketId}`);
    return updateDoc(ref, { status: 'canceled' });
  }

  markTicketUsed(eventId: string, ticketId: string): Promise<void> {
    const ref = doc(this.firestore, `events/${eventId}/tickets/${ticketId}`);
    return updateDoc(ref, { status: 'used' });
  }
}
