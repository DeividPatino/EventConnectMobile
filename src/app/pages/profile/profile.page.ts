import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone:false,
})
export class ProfilePage {
  constructor(private navCtrl: NavController) {}

  goToLogin() {
    console.log('➡️ Redirigiendo al login...');
    this.navCtrl.navigateForward('/login');
  }
}