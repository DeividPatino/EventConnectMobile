import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../shared/services/events.service';
import { Event } from '../../../interfaces/event';
import { Zone } from '../../../interfaces/zone';
import { Ticket } from '../../../interfaces/ticket';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.page.html',
  styleUrls: ['./event-stats.page.scss'],
  standalone: false,
})
export class EventStatsPage implements OnInit {
  eventId!: string;
  event: Event | undefined;
  zones: Zone[] = [];
  tickets: Ticket[] = [];
  loading = true;
  chartReady = false;
  totalSold = 0;
  totalCapacity = 0;
  totalRevenue = 0; // placeholder; requires ticket price data or zone price * sold
  views = 0; // placeholder: could increment elsewhere and store in event document

  constructor(private route: ActivatedRoute, private eventsService: EventsService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || '';
    if (!this.eventId) { this.loading = false; return; }

    this.eventsService.getEvent(this.eventId).subscribe(ev => { this.event = ev; });
    this.eventsService.getZones(this.eventId).subscribe(zs => { this.zones = zs; this.computeStats(); });
    this.eventsService.getTickets(this.eventId).subscribe(ts => { this.tickets = ts; this.computeStats(); });
  }

  computeStats() {
    if (!this.zones.length) return;
    // capacity sum
    this.totalCapacity = this.zones.reduce((sum, z:any) => sum + (z.capacity || 0), 0);
    // sold tickets (status active + used)
    this.totalSold = this.tickets.filter(t => t.status === 'active' || t.status === 'used').length;
    // revenue (requires zone price & mapping by zoneId)
    const priceMap: Record<string, number> = {};
    (this.zones as any).forEach((z: any) => priceMap[z.id] = z.price || 0);
    this.totalRevenue = this.tickets.reduce((sum, t) => sum + (priceMap[t.zoneId] || 0), 0);
    // views placeholder: if event has a views field we could read it; else keep zero.
    if ((this.event as any)?.views) this.views = (this.event as any).views;
    this.loading = false;
    this.prepareChart();
  }

  async prepareChart() {
    try {
      const zones = this.zones;
      const tickets = this.tickets;
      const soldPerZone: Record<string, number> = {};
      tickets.filter(t => t.status !== 'canceled').forEach(t => soldPerZone[t.zoneId] = (soldPerZone[t.zoneId] || 0) + 1);

      const labels = zones.map(z => z.name);
      const soldData = zones.map(z => soldPerZone[z.id] || 0);
      const capacityData = zones.map(z => (z as any).capacity || 0);

      const mod: any = await import('chart.js/auto').catch(() => null);
      if (!mod) return; // Chart.js not installed yet
      const Chart = mod.default || mod.Chart;
      const canvas: any = document.getElementById('zonesChart');
      if (!canvas) return;
      new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Vendidas', data: soldData, backgroundColor: 'rgba(54,162,235,0.6)' },
            { label: 'Capacidad', data: capacityData, backgroundColor: 'rgba(255,99,132,0.3)' }
          ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });
      this.chartReady = true;
    } catch (e) {
      console.warn('Chart no disponible. Instala chart.js para ver gráfico.');
    }
  }

  soldForZone(zoneId: string): number {
    if (!this.tickets) return 0;
    return this.tickets.filter(t => t.zoneId === zoneId && t.status !== 'canceled').length;
  }
}
