import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-detail',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './organizer-detail.component.html',
  styleUrls: ['./organizer-detail.component.scss']
})
export class OrganizerDetailComponent {
  @Input() organizer: any;

  constructor(private readonly modalCtrl: ModalController) {}

  close(action?: 'verify' | 'reject') {
    this.modalCtrl.dismiss({ action, uid: this.organizer?.uid });
  }
}
