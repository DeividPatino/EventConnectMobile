import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Event } from '../../../../interfaces/event';
import { Auth } from '../../../../core/providers/auth';

@Component({
  selector: 'app-event-preview-modal',
  templateUrl: './event-preview-modal.component.html',
  styleUrls: ['./event-preview-modal.component.scss'],
  standalone: false,
})
export class EventPreviewModalComponent {
  @Input() event!: Event;

  constructor(private modalCtrl: ModalController, private auth: Auth) {}

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

  async openTicketMap() {
    const { TicketMapModalComponent } = await import('./ticket-map-modal.component');
    const modal = await this.modalCtrl.create({
      component: TicketMapModalComponent,
      componentProps: { event: this.event }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.zone) {
      // por ahora solo loguear, podrías navegar a compra
      console.log('Zona seleccionada:', data.zone);
    }
  }

  get loggedIn(): boolean {
    return !!this.auth.getUser();
  }
}
