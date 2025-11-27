import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../shared/services/events.service';
import { Event } from '../../../interfaces/event';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { EventPreviewModalComponent } from './preview/event-preview-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  events$!: Observable<Event[]>;

  constructor(private eventsService: EventsService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.events$ = this.eventsService.getAllEvents();
  }

  formatDate(date: any): string {
    if (!date) return '';
    
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return dateObj.toLocaleDateString('es-ES', options);
  }

  async openEventPreview(event: Event) {
    const modal = await this.modalCtrl.create({
      component: EventPreviewModalComponent,
      componentProps: { event }
    });
    await modal.present();
  }

  getEventPrice(event: Event): string {
    // Si tienes un campo de precio en el evento, úsalo aquí
    // Por ahora retorno "Gratuito" o "Desde $XX.XX"
    return 'Gratuito';
  }

}
