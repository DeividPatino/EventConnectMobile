import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false,
})
export class AdminDashboardPage implements OnInit {
  users: any[] = [];
  events: any[] = [];

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private readonly navCtrl: NavController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.loadUsers();
    await this.loadEvents();
  }

  async loadUsers() {
    try {
      const ref = collection(this.firestore, 'users');
      const snapshot = await getDocs(ref);
      this.users = snapshot.docs.map(doc => doc.data());
      console.log(' Usuarios cargados:', this.users);
    } catch (error) {
      console.error(' Error al cargar usuarios:', error);
    }
  }

  async loadEvents() {
    try {
      const ref = collection(this.firestore, 'events');
      const snapshot = await getDocs(ref);
      this.events = snapshot.docs.map(doc => doc.data());
      console.log(' Eventos cargados:', this.events);
    } catch (error) {
      console.error(' Error al cargar eventos:', error);
    }
  }

  logout() {
    this.auth.logout();
    this.navCtrl.navigateRoot('/login');
  }
}
