import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth';
import { Firestore, collection, getDocs, doc, updateDoc } from '@angular/fire/firestore';
import { NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: false,
})
export class AdminDashboardPage implements OnInit {
  users: any[] = [];
  events: any[] = [];
  organizers: any[] = [];
  currentSection: string = 'users';
  stadiumSubsection: 'list' | 'create' | 'edit' = 'list';

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private readonly navCtrl: NavController,
    private readonly toastCtrl: ToastController,
    private readonly alertCtrl: AlertController,
    private readonly router: Router
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.loadUsers();
    await this.loadEvents();
    await this.loadOrganizers();
  }

  async loadUsers() {
    try {
      const ref = collection(this.firestore, 'users');
      const snapshot = await getDocs(ref);
      this.users = snapshot.docs.map(doc => doc.data());
      console.log('Usuarios cargados:', this.users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  async loadEvents() {
    try {
      const refPlural = collection(this.firestore, 'events');
      const snapPlural = await getDocs(refPlural);
      let events = snapPlural.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      // Fallback a colección singular si no hay resultados (por configuración previa)
      if (!events.length) {
        const refSingular = collection(this.firestore, 'event');
        const snapSingular = await getDocs(refSingular);
        events = snapSingular.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      }
      this.events = events;
      console.log('Eventos cargados:', this.events);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  }

  async loadOrganizers() {
    try {
      const ref = collection(this.firestore, 'organizers');
      const snapshot = await getDocs(ref);
      this.organizers = snapshot.docs.map(doc => doc.data());
      console.log('Organizadores cargados:', this.organizers);
    } catch (error) {
      console.error('Error al cargar organizadores:', error);
    }
  }

  async verifyOrganizer(uid: string) {
    const alert = await this.alertCtrl.create({
      header: 'Verificar organizador',
      message: '¿Confirmas que deseas verificar a este organizador? Esta acción marcará el organizador como verificado.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Verificar',
          handler: async () => {
            try {
              const orgRef = doc(this.firestore, `organizers/${uid}`);
              await updateDoc(orgRef, { verified: true });

              // Also update users/{uid} if exists
              try {
                const userRef = doc(this.firestore, `users/${uid}`);
                await updateDoc(userRef, { verified: true });
              } catch (e) {
                // ignore if users doc doesn't exist
              }

              const toast = await this.toastCtrl.create({
                message: 'Organizador verificado correctamente.',
                duration: 2000,
                color: 'success'
              });
              await toast.present();
              await this.loadOrganizers();
            } catch (err) {
              console.error('Error verificando organizador:', err);
              const toast = await this.toastCtrl.create({
                message: 'Error al verificar organizador.',
                duration: 2500,
                color: 'danger'
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async rejectOrganizer(uid: string) {
    const alert = await this.alertCtrl.create({
      header: 'Rechazar organizador',
      message: '¿Confirmas que deseas rechazar a este organizador? Esta acción marcará el organizador como rechazado.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Rechazar',
          handler: async () => {
            try {
              const orgRef = doc(this.firestore, `organizers/${uid}`);
              await updateDoc(orgRef, { verified: false, rejected: true });

              // Also update users/{uid} if exists
              try {
                const userRef = doc(this.firestore, `users/${uid}`);
                await updateDoc(userRef, { verified: false, rejected: true });
              } catch (e) {
                // ignore if users doc doesn't exist
              }

              const toast = await this.toastCtrl.create({
                message: 'Organizador rechazado correctamente.',
                duration: 2000,
                color: 'warning'
              });
              await toast.present();
              await this.loadOrganizers();
            } catch (err) {
              console.error('Error rechazando organizador:', err);
              const toast = await this.toastCtrl.create({
                message: 'Error al rechazar organizador.',
                duration: 2500,
                color: 'danger'
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.auth.logout();
    this.navCtrl.navigateRoot('/login');
  }

  selectSection(section: string) {
    this.currentSection = section;
    if (section === 'stadiums') {
      this.stadiumSubsection = 'list';
    }
  }

  openStadiums(action: 'list' | 'create' | 'edit') {
    this.currentSection = 'stadiums';
    this.stadiumSubsection = action;
  }
}