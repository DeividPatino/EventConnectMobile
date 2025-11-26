import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from '../../../../interfaces/event';

@Component({
  selector: 'app-event-preview-modal',
  templateUrl: './event-preview-modal.component.html',
  styleUrls: ['./event-preview-modal.component.scss'],
  standalone: false,
})
export class EventPreviewModalComponent {
  @Input() event!: Event;

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

  formatDate(date: any): string {
    if (!date) return '';
    const dateObj = (date && (date as any).toDate) ? (date as any).toDate() : new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    };
    return dateObj.toLocaleDateString('es-ES', options);
  }
}
