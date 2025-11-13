import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.page.html',
  styleUrls: ['./homescreen.page.scss'],
  standalone: false,
})
export class HomescreenPage implements OnInit {

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async openCreateEvent() {
    const alert = await this.alertCtrl.create({
      header: 'Crear evento',
      message: '¿Qué te gustaría hacer? Pulsa Crear para continuar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: () => {
            console.log('Crear evento seleccionado');
            // Aquí puedes navegar a la página de creación de evento o abrir un modal
          }
        }
      ]
    });

    await alert.present();
  }

}
