import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../core/providers/auth';
import { Organizer } from '../../../interfaces/organizer';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProfilePage implements OnInit {
  organizer: Organizer | null = null;
  showHelp = false;
  showTerms = false;
  showPrivacy = false;
  showInterests = false;
  showFollowing = false;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    const u = this.auth.getUser();
    if (u && (u as any).role === 'organizer') {
      this.organizer = (u as unknown) as Organizer;
    }
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

  toggleInterests() {
    this.showInterests = !this.showInterests;
  }

  toggleFollowing() {
    this.showFollowing = !this.showFollowing;
  }
}
