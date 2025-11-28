import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Event } from '../../../interfaces/event';
import { Zone } from '../../../interfaces/zone';
import { Ticket } from '../../../interfaces/ticket';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: false,
})
export class EventDetailsPage implements OnInit {
  eventId!: string;
  event: Event | undefined;
  zones: Zone[] = [];
  loadingEvent = true;
  loadingZones = true;
  activeTab: 'resumen' | 'asistentes' = 'resumen';
  tickets: Ticket[] = [];
  loadingTickets = true;
  ticketsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || '';
    if (!this.eventId) {
      this.loadingEvent = false;
      this.loadingZones = false;
      return;
    }
    this.eventsService.getEvent(this.eventId).subscribe(ev => {
      this.event = ev;
      this.loadingEvent = false;
    });
    this.eventsService.getZones(this.eventId).subscribe(zs => {
      this.zones = zs;
      this.loadingZones = false;
    });
    this.eventsService.getTickets(this.eventId).subscribe({
      next: ts => { this.tickets = ts; this.loadingTickets = false; },
      error: err => { this.ticketsError = 'Error cargando asistentes'; this.loadingTickets = false; console.error(err); }
    });
  }

  switchTab(tab: any) {
    // Guardar solo si el valor es uno de los tabs esperados
    if (tab === 'resumen' || tab === 'asistentes') {
      this.activeTab = tab;
    }
  }

  async exportCsv() {
    if (!this.tickets.length) return;

    // Gather unique user UIDs
    const uids = Array.from(new Set(this.tickets.map(t => t.userUid).filter(Boolean)));
    const userMap: Record<string, any> = {};

    // Fetch user documents (if any) to include buyer details
    for (const uid of uids) {
      try {
        const userRef = doc(this.firestore, `users/${uid}`);
        const snap = await getDoc(userRef as any);
        if (snap && snap.exists()) userMap[uid] = snap.data();
      } catch (err) {
        console.warn('Error fetching user', uid, err);
      }
    }

    const headers = ['ticketId','userUid','firstName','lastName','email','phone','zoneId','purchaseDate','status','code'];

    const escape = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return '"' + s.replace(/"/g, '""') + '"';
    };

    const rows = this.tickets.map(t => {
      const u = userMap[t.userUid] || {};
      const purchaseDate = (t.purchaseDate && (t.purchaseDate as any).toDate) ? (t.purchaseDate as any).toDate().toISOString() : (t.purchaseDate || '');
      return [
        escape(t.id),
        escape(t.userUid),
        escape(u.firstName || u.name || ''),
        escape(u.lastName || ''),
        escape(u.email || ''),
        escape(u.phone || u.phoneNumber || ''),
        escape(t.zoneId),
        escape(purchaseDate),
        escape(t.status),
        escape(t.code || '')
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets_${this.eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    const toast = await this.toastController.create({ message: 'CSV descargado', duration: 2000, color: 'success' });
    await toast.present();
  }

  cancelTicket(ticket: Ticket) {
    this.eventsService.cancelTicket(this.eventId, ticket.id).catch(e => console.error(e));
  }

  markUsed(ticket: Ticket) {
    this.eventsService.markTicketUsed(this.eventId, ticket.id).catch(e => console.error(e));
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.performDelete();
          }
        }
      ]
    });
    await alert.present();
  }

  private async performDelete() {
    try {
      await this.eventsService.deleteEvent(this.eventId);
      const toast = await this.toastController.create({ message: 'Evento eliminado', duration: 2000, color: 'success' });
      await toast.present();
      // Volver al listado de eventos del organizador
      this.navCtrl.navigateRoot('/organizer-panel/my-event');
    } catch (err) {
      console.error(err);
      const toast = await this.toastController.create({ message: 'Error al eliminar evento', duration: 3000, color: 'danger' });
      await toast.present();
    }
  }
}
