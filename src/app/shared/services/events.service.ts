import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, collectionData, docData, doc, updateDoc, getDoc, getDocs, writeBatch } from '@angular/fire/firestore';
import { runTransaction, increment } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // Retorna eventos visibles en home: incluye los que no tienen status o están 'activo'
  getAllVisibleEvents(): Observable<Event[]> {
    return (this.getAllEvents() as Observable<Event[]>).pipe(
      map(events => events.filter(ev => !ev.status || ev.status === 'activo'))
    );
  }

  // Cambia el estado de un evento
  setEventStatus(eventId: string, status: 'activo' | 'finalizado' | 'inhabilitado'): Promise<void> {
    const ref = doc(this.firestore, `events/${eventId}`);
    return updateDoc(ref, { status });
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

  /**
   * Borra un evento y decrementa el contador del organizer en una transacción.
   * Nota: borrar subcolecciones (zones, tickets) requiere operaciones adicionales.
   */
  async deleteEvent(eventId: string): Promise<void> {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    // Intentar obtener organizerUid desde el documento del evento
    let organizerUid: string | undefined;
    try {
      const snap = await getDoc(eventRef as any);
      if (snap && snap.exists()) {
        const data: any = snap.data();
        organizerUid = data?.organizerUid;
      }
    } catch (err) {
      console.warn('No se pudo leer evento antes de borrar:', err);
    }
    try {
      // Primero borrar subcolecciones asociadas (tickets, zones) en lotes
      await this.deleteCollection(`events/${eventId}/tickets`);
      await this.deleteCollection(`events/${eventId}/zones`);

      // Luego, en una transacción, borrar el documento principal y decrementar contador
      await runTransaction(this.firestore as any, async (transaction) => {
        transaction.delete(eventRef as any);
        if (organizerUid) {
          const orgRef = doc(this.firestore, `organizers/${organizerUid}`);
          transaction.update(orgRef as any, { eventsCount: increment(-1) });
        }
      });
    } catch (err) {
      console.error('Error borrando evento y/o subcolecciones:', err);
      throw err;
    }
  }

  // Elimina todos los documentos en una subcolección por lotes de 500
  private async deleteCollection(collectionPath: string): Promise<void> {
    const colRef = collection(this.firestore, collectionPath);
    const snap = await getDocs(colRef as any);
    if (snap.empty) return;

    const docs = snap.docs;
    const chunkSize = 500;
    for (let i = 0; i < docs.length; i += chunkSize) {
      const batch = writeBatch(this.firestore as any);
      const chunk = docs.slice(i, i + chunkSize);
      chunk.forEach(d => batch.delete(d.ref as any));
      await batch.commit();
    }
  }
}
