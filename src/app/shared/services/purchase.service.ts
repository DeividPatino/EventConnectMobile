import { Injectable } from '@angular/core';
import { Firestore, doc, collection, runTransaction, serverTimestamp } from '@angular/fire/firestore';
import { Order } from '../../interfaces/order';

interface SimulatedPurchaseInput {
  userUid: string;
  eventId: string;
  zoneId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Servicio de compra que NO modifica la lógica existente de eventos.
 * Añade la creación transaccional de tickets y una orden de usuario.
 * Estructura Firestore:
 *  - events/{eventId}/zones/{zoneId} (ya existe) => decrementar availableTickets
 *  - events/{eventId}/tickets/{ticketId}
 *  - users/{uid}/orders/{orderId}
 *
 * Guía para métodos reales de pago:
 *  - PayPal: después de onApprove, llamar a finalizeExternalPurchase(...) con datos validados por backend.
 *  - Google Pay: tras recibir paymentData y validarlo en backend, igual.
 */
@Injectable({ providedIn: 'root' })
export class PurchaseService {
  constructor(private firestore: Firestore) {}

  /** Simula un pago y crea los tickets + orden en una transacción. */
  async simulatePurchase(input: SimulatedPurchaseInput): Promise<string> {
    const { userUid, eventId, zoneId, quantity, unitPrice } = input;
    if (!userUid) throw new Error('Usuario no autenticado');
    if (quantity < 1) throw new Error('Cantidad inválida');

    const zoneRef = doc(this.firestore, `events/${eventId}/zones/${zoneId}`);
    const ticketsCol = collection(this.firestore, `events/${eventId}/tickets`);
    const ordersCol = collection(this.firestore, `users/${userUid}/orders`);
    const orderRef = doc(ordersCol);
    const orderId = orderRef.id;

    await runTransaction(this.firestore as any, async (transaction: any) => {
      const zoneSnap = await transaction.get(zoneRef as any);
      if (!zoneSnap.exists()) throw new Error('Zona no encontrada');
      const zoneData = zoneSnap.data();
      const available: number = zoneData.availableTickets ?? zoneData.capacity ?? 0;
      if (available < quantity) throw new Error('No hay suficientes tickets');

      // Actualizar disponibilidad
      transaction.update(zoneRef as any, { availableTickets: available - quantity });

      const ticketIds: string[] = [];
      for (let i = 0; i < quantity; i++) {
        const ticketRef = doc(ticketsCol);
        const ticketId = ticketRef.id;
        ticketIds.push(ticketId);
        transaction.set(ticketRef as any, {
          id: ticketId,
          userUid,
          zoneId,
          purchaseDate: serverTimestamp(),
          status: 'active'
        });
      }

      const total = unitPrice * quantity;
      const order: Order = {
        id: orderId,
        userUid,
        eventId,
        zoneId,
        quantity,
        unitPrice,
        total,
        status: 'paid',
        ticketIds,
        createdAt: serverTimestamp(),
        paymentMethod: 'simulated'
      };
      transaction.set(orderRef as any, order);
    });

    return orderId;
  }

  /** Ejemplo para pago externo (PayPal, Google Pay) tras validación backend */
  async finalizeExternalPurchase(validated: {
    userUid: string; eventId: string; zoneId: string; quantity: number; unitPrice: number; paymentMethod: string; externalOrderId: string;
  }): Promise<string> {
    // Podrías reutilizar simulatePurchase internamente si la lógica es igual,
    // o separar lógica si hay estados 'pending' y luego 'paid'.
    return this.simulatePurchase({
      userUid: validated.userUid,
      eventId: validated.eventId,
      zoneId: validated.zoneId,
      quantity: validated.quantity,
      unitPrice: validated.unitPrice
    });
  }
}
