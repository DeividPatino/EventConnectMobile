import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: User | null = null;

  
  showHelp = false;
  showTerms = false;
  showPrivacy = false;

  constructor(private navCtrl: NavController, private auth: Auth) {}

  ngOnInit() {
    const current = this.auth.getUser();
    if (current && 'firstName' in current) {
      this.user = current as User;
    } else {
      this.user = null;
    }
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

  
  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }

  togglePrivacy() {
    this.showPrivacy = !this.showPrivacy;
  }
}
