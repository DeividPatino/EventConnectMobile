import { Component, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  standalone: false,
})
export class EventCardComponent {
  @Input() event!: Partial<Event> | any;

  get title(): string {
    return (this.event?.name || 'Evento sin nombre') as string;
  }

  get image(): string {
    return (
      this.event?.image ||
      this.event?.cover ||
      'https://ionicframework.com/docs/img/demos/card-media.png'
    ) as string;
  }

  get category(): string {
    const cat = this.event?.category || this.event?.type;
    return cat || 'Sin categoría';
  }

  get city(): string {
    const c = this.event?.city;
    if (!c) return 'Sin ciudad';
    return typeof c === 'string' ? c : (c.name || 'Sin ciudad');
  }

  get stadium(): string {
    const s = this.event?.stadium;
    if (!s) return '—';
    return typeof s === 'string' ? s : (s.name || '—');
  }

  get status(): string {
    return this.event?.status || 'activo';
  }

  get dateLabel(): string {
    const d = this.event?.date;
    if (!d) return 'Fecha no definida';
    try {
      // Firestore Timestamp
      if (d && typeof d.toDate === 'function') {
        const dd = d.toDate() as Date;
        return this.formatDate(dd);
      }
      // epoch millis or number-like
      if (typeof d === 'number') {
        return this.formatDate(new Date(d));
      }
      // ISO string or similar
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) return this.formatDate(parsed);
    } catch (_) {}
    return String(d);
  }

  private formatDate(dt: Date): string {
    return dt.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
