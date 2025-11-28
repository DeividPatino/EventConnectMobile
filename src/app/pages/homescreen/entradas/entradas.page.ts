import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/interfaces/ticket';
import { TicketsService } from 'src/app/shared/services/ticket.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.page.html',
  styleUrls: ['./entradas.page.scss'],
  standalone: false,
})
export class EntradasPage implements OnInit {

  tickets: Ticket[] = [];
  loading = true;

  constructor(private ticketsService: TicketsService, private firestore: Firestore) {}

  ngOnInit() {
    this.ticketsService.getMyTickets().subscribe({
      next: async (obs: any) => {
        obs.subscribe((res: Ticket[]) => {
          this.tickets = res;
          this.loading = false;
          this.enrichZoneNames();
        });
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private async enrichZoneNames(): Promise<void> {
    const uniquePairs = new Set<string>();
    const lookups: { ticket: Ticket; eventId: string; zoneId: string }[] = [];
    for (const t of this.tickets) {
      if (t.eventId && t.zoneId) {
        const key = `${t.eventId}|${t.zoneId}`;
        if (!uniquePairs.has(key)) {
          uniquePairs.add(key);
          lookups.push({ ticket: t, eventId: t.eventId, zoneId: t.zoneId });
        }
      }
    }
    for (const l of lookups) {
      try {
        const zoneRef = doc(this.firestore, `events/${l.eventId}/zones/${l.zoneId}`);
        const snap = await getDoc(zoneRef);
        if (snap.exists()) {
          const data: any = snap.data();
          const name = data?.name || data?.Name || l.zoneId;
          // assign without changing ticket structure assumptions
          (this.tickets.filter(t => t.eventId === l.eventId && t.zoneId === l.zoneId)).forEach(t => (t as any).zoneName = name);
        }
      } catch (_) {
        // ignore errors silently to avoid breaking existing logic
      }
    }
  }

  formatPurchaseDate(val: any): string {
    try {
      let d: Date | null = null;
      if (val?.toDate && typeof val.toDate === 'function') {
        d = val.toDate();
      } else if (typeof val === 'number') {
        d = new Date(val);
      } else if (typeof val === 'string') {
        const parsed = new Date(val);
        if (!isNaN(parsed.getTime())) d = parsed;
      }
      return d ? d.toDateString() : String(val);
    } catch (_) {
      return String(val || '');
    }
  }
}
