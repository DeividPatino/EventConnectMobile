import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(private modalCtrl: ModalController, private eventsService: EventsService) {}

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

  confirmSelection() {
    const zone = this.zones.find(z => z.id === this.selectedZoneId);
    this.modalCtrl.dismiss({ zone });
  }

  getMapUrl(): string | undefined {
    return (this.event as any)?.stadium?.mapBase64 || this.event?.map || undefined;
  }
}
