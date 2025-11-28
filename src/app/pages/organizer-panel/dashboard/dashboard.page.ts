import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { Auth } from '../../../core/providers/auth';
import { Event } from '../../../interfaces/event';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  events: Event[] = [];
  activeEvents: Event[] = [];
  finishedEvents: Event[] = [];
  loading = true;
  error: string | null = null;
  segment: 'activo' | 'finalizado' = 'activo';

  constructor(private eventsService: EventsService, private auth: Auth) { }

  ngOnInit() {
    const uid = (this.auth.getUser() as any)?.uid;
    if (!uid) { this.loading = false; this.error = 'No UID de organizador.'; return; }
    this.eventsService.getOrganizerEvents(uid).subscribe({
      next: evs => {
        this.events = evs;
        this.activeEvents = evs.filter(e => e.status === 'activo');
        this.finishedEvents = evs.filter(e => e.status === 'finalizado');
        this.loading = false;
      },
      error: err => { this.error = 'Error cargando eventos'; this.loading = false; console.error(err); }
    });
  }
}
