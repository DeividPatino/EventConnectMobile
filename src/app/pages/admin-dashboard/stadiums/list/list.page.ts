import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
})
export class ListPage implements OnInit {
  stadiums: any[] = [];
  constructor(
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.loadStadiums();
  }

  async loadStadiums() {
    // Leer todas las ciudades y aplanar estadios
    const citiesRef = collection(this.firestore, 'cities');
    const snapshot = await getDocs(citiesRef);
    const allStadiums: any[] = [];
    snapshot.forEach(docSnap => {
      const cityData = docSnap.data();
      if (cityData['Stadiums'] && Array.isArray(cityData['Stadiums'])) {
        cityData['Stadiums'].forEach((stadium: any) => {
          allStadiums.push({
            ...stadium,
            City: cityData['Name'] || docSnap.id,
            CityId: docSnap.id
          });
        });
      }
    });
    this.stadiums = allStadiums;
  }

  editStadium(stadium: any) {
    // Navegar a la página de edición pasando el objeto stadium en el state
    this.router.navigate(['/admin-dashboard/stadiums/edit'], { state: { stadium } });
  }

  async confirmDelete(stadium: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar estadio',
      message: `¿Eliminar "${stadium.Name}" de ${stadium.City}? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteStadium(stadium) }
      ]
    });
    await alert.present();
  }

  async deleteStadium(stadium: any) {
    try {
      const cityId = stadium.CityId || stadium.City;
      const cityRef = doc(this.firestore, `cities/${cityId}`);
      const snapshot = await getDoc(cityRef);
      if (!snapshot.exists()) {
        await this.toastCtrl.create({ message: 'Ciudad no encontrada', duration: 2000, color: 'danger' }).then(t => t.present());
        return;
      }
      const data: any = snapshot.data();
      const hasUpper = Array.isArray(data.Stadiums);
      const hasLower = Array.isArray(data.stadiums);
      const currentStadiums: any[] = hasUpper ? data.Stadiums : (hasLower ? data.stadiums : []);
      // Filtrar el estadio a eliminar: comparamos por Nombre + Capacity + MapBase64 como heurística
      const filtered = currentStadiums.filter(s => {
        const sName = s.Name ?? s.name;
        const sCap = Number(s.Capacity ?? s.capacity ?? 0);
        const sMap = s.MapBase64 ?? s.mapBase64 ?? '';
        return !(sName === stadium.Name && sCap === Number(stadium.Capacity) && (sMap || '') === (stadium.MapBase64 || ''));
      });
      const payload = hasUpper ? { Stadiums: filtered } : (hasLower ? { stadiums: filtered } : { Stadiums: filtered });
      await updateDoc(cityRef, payload);
      await this.toastCtrl.create({ message: 'Estadio eliminado', duration: 2000, color: 'success' }).then(t => t.present());
      await this.loadStadiums();
    } catch (e) {
      await this.toastCtrl.create({ message: 'Error eliminando estadio', duration: 2200, color: 'danger' }).then(t => t.present());
    }
  }
}
