import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage {
  constructor(private navCtrl: NavController) {}

  agree() {
    console.log('Has ido al login ');
    this.navCtrl.navigateForward('/login');
  }
}
