import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CheckoutPage } from '../../../checkout/checkout.page';
import { Event } from '../../../../interfaces/event';
import { Zone } from '../../../../interfaces/zone';
import { EventsService } from '../../../../shared/services/events.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-map-modal',
  templateUrl: './ticket-map-modal.component.html',
  styleUrls: ['./ticket-map-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TicketMapModalComponent implements OnInit {
  @Input() event?: Event;

  zones: Zone[] = [];
  selectedZoneId: string | null = null;

  constructor(private modalCtrl: ModalController, private eventsService: EventsService, private router: Router) {}

  ngOnInit() {
    if (this.event?.id) {
      this.eventsService.getZones(this.event.id).subscribe(z => {
        this.zones = z;
      });
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async confirmSelection() {
    const zone = this.zones.find(z => z.id === this.selectedZoneId);
    try {
      const top = await this.modalCtrl.getTop();
      if (top) {
        await top.dismiss({ zone });
      } else {
        // fallback
        await this.modalCtrl.dismiss({ zone });
      }
    } catch (err) {
      // ignore dismiss error
    }

    // Present checkout as a new modal window (after dismiss) so ticket-map is closed
    if (zone && this.event?.id) {
      setTimeout(async () => {
        try {
          const m = await this.modalCtrl.create({
            component: CheckoutPage,
            componentProps: { eventId: this.event!.id, zoneId: zone.id }
          });
          await m.present();
        } catch (e) {
          // fallback: navigate to route if presenting modal fails
          this.router.navigate(['/checkout', this.event!.id, zone.id]);
        }
      }, 50);
    }
  }

  getMapUrl(): string | undefined {
    return (this.event as any)?.stadium?.mapBase64 || this.event?.map || undefined;
  }

  get selectedZone(): Zone | null {
    return this.zones.find(z => z.id === this.selectedZoneId) || null;
  }

  remaining(z?: Zone | null): number {
    if (!z) return 0;
    // Prefer an explicit `remaining` field if present, otherwise fall back to `capacity`.
    // This keeps existing backend logic intact while displaying remaining tickets.
    return (z as any).remaining ?? (z.capacity ?? 0);
  }

  get selectedZoneRemaining(): number | null {
    return this.selectedZone ? this.remaining(this.selectedZone) : null;
  }

  isSoldOut(z: Zone): boolean {
    return this.remaining(z) === 0;
  }
}
