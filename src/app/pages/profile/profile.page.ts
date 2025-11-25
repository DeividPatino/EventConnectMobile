import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone:false,
})
export class ProfilePage implements OnInit {
  user: User | null = null;

  constructor(private navCtrl: NavController, private auth: Auth) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  goToLogin() {
    console.log('➡️ Redirigiendo al login...');
    this.navCtrl.navigateForward('/login');
  }

  goToHome() {
    console.log('⬅️ Volviendo al homescreen...');
    this.navCtrl.navigateRoot('/homescreen');
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
  }
}