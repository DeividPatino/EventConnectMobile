import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Event } from '../../../interfaces/event';
import { Zone } from '../../../interfaces/zone';
import { Ticket } from '../../../interfaces/ticket';

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

  constructor(private route: ActivatedRoute, private eventsService: EventsService) {}

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

  exportCsv() {
    if (!this.tickets.length) return;
    const headers = ['id','userUid','zoneId','purchaseDate','status','code'];
    const rows = this.tickets.map(t => [t.id, t.userUid, t.zoneId, (t.purchaseDate?.toDate ? t.purchaseDate.toDate().toISOString() : t.purchaseDate), t.status, t.code || ''].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets_${this.eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  cancelTicket(ticket: Ticket) {
    this.eventsService.cancelTicket(this.eventId, ticket.id).catch(e => console.error(e));
  }

  markUsed(ticket: Ticket) {
    this.eventsService.markTicketUsed(this.eventId, ticket.id).catch(e => console.error(e));
  }
}
