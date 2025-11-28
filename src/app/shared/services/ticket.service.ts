import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';

import { Auth } from '../../core/providers/auth';
import { Observable, from, map } from 'rxjs';
import { Ticket } from '../../interfaces/ticket';
import { Event } from '../../interfaces/event';

@Injectable({ providedIn: 'root' })
export class TicketsService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  /** Obtiene todos los tickets del usuario desde todos los eventos */
  getMyTickets(): Observable<Ticket[]> {
    const user = this.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');
    const uid = user.uid;

    const eventsRef = collection(this.firestore, 'events');

    return from(getDocs(eventsRef)).pipe(
      map(async snapshot => {
        const allTickets: Ticket[] = [];

        // Recorremos todos los eventos
        for (const eventDoc of snapshot.docs) {
          const eventId = eventDoc.id;
          const eventData = eventDoc.data() as Event;

          // Subcolección: events/{eventId}/tickets
          const ticketsRef = collection(
            this.firestore,
            `events/${eventId}/tickets`
          );

          const q = query(ticketsRef, where('userUid', '==', uid));
          const ticketsSnap = await getDocs(q);

          ticketsSnap.forEach(ticketDoc => {
            const data = ticketDoc.data() as Ticket;

            allTickets.push({
              ...data,
              id: ticketDoc.id,
              eventId,
              // 👇 AGREGAMOS LOS DATOS DEL EVENTO
              eventName: eventData.name,
              eventImage: eventData.image
            });
          });
        }

        return allTickets;
      }),
      map(p => from(p)),
      (source$: any) => source$.pipe(map((x: any) => x))
    );
  }
}
