import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { Auth } from '../../../core/providers/auth';
import { Event } from '../../../interfaces/event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-event',
  templateUrl: './my-event.page.html',
  styleUrls: ['./my-event.page.scss'],
  standalone: false,
})
export class MyEventPage implements OnInit {
  myEvents: Event[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private eventsService: EventsService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    const uid = (this.auth.getUser() as any)?.uid;
    if (!uid) {
      this.loading = false;
      this.error = 'No se encontró UID de organizador.';
      return;
    }
    this.eventsService.getOrganizerEvents(uid).subscribe({
      next: evts => {
        this.myEvents = evts;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error cargando eventos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  viewDetails(eventId: string) {
    // route lives under /organizer-panel, so navigate with that prefix
    this.router.navigate(['/organizer-panel', 'event-details', eventId]);
  }

  editEvent(eventId: string) {
    // Placeholder: navigate to edit page (not implemented yet)
    console.log('Editar evento', eventId);
  }

  async finalizeEvent(eventId: string) {
    try {
      await this.eventsService.setEventStatus(eventId, 'finalizado');
      // update local list optimistically
      this.myEvents = this.myEvents.map(ev => ev.id === eventId ? { ...ev, status: 'finalizado' } as any : ev);
    } catch (err) {
      console.error('Error finalizando evento', err);
    }
  }

  viewSales(eventId: string) {
    // Placeholder for future sales page
    console.log('Ver ventas evento', eventId);
  }
}
