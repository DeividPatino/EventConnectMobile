import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrganizerDetailComponent } from '../organizer-detail/organizer-detail.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})
export class CardComponent {
  @Input() data: any;
  @Output() verify = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();

  constructor(private readonly modalCtrl: ModalController) {}

  onVerify() {
    if (this.data && this.data.uid) this.verify.emit(this.data.uid);
  }

  async openDetails() {
    if (!this.data) return;
    const modal = await this.modalCtrl.create({
      component: OrganizerDetailComponent,
      componentProps: { organizer: this.data },
      cssClass: 'organizer-modal'
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    const action = data?.action;
    const uid = data?.uid;
    if (action === 'verify' && uid) this.verify.emit(uid);
    if (action === 'reject' && uid) this.reject.emit(uid);
  }

  getFormattedBirthDate(): string {
    const bd = this.data?.birthDate;
    if (!bd) return 'N/A';

    // If stored as YYYY-MM-DD already, return it
    if (typeof bd === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(bd)) {
      return bd;
    }

    // If it's an ISO string with time or timestamp-like, try to parse
    try {
      const date = new Date(bd);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (e) {
      // fallthrough
    }

    return String(bd);
  }
}
