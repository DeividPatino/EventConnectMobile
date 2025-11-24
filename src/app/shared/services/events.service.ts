import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, collectionData, docData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Event } from '../../interfaces/event';
import { Zone } from '../../interfaces/zone';

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
}
