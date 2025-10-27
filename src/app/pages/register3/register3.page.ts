import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth';

import { GlobalUser } from 'src/app/core/providers/global-user';

@Component({
  selector: 'app-register3',
  templateUrl: './register3.page.html',
  styleUrls: ['./register3.page.scss'],
  standalone: false,
})
export class Register3Page {
  photos: string[] = [];

  constructor(
    private readonly navCtrl: NavController,
    private readonly globalUser: GlobalUser,
    private readonly authService: Auth
  ) {}

  
  triggerFileInput() {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    input.click();
  }

 
  onFilesSelected(event: any) {
    const files = Array.from(event.target.files);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.photos.length < 9) {
          this.photos.push(e.target.result);
          console.log(' Foto agregada:', file.name);
        } else {
          console.log(' Máximo de 9 fotos alcanzado');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  
  removePhoto(index: number) {
    console.log(' Foto eliminada:', this.photos[index]);
    this.photos.splice(index, 1);
  }

  
  async finishRegister() {
    if (this.photos.length === 0) {
      console.log(' Debes subir al menos una foto antes de continuar');
      return;
    }

    try {
      
      this.globalUser.setData('photos' as any, this.photos);

      console.log(' Datos finales del usuario:', this.globalUser.getData());

      await this.authService.finishRegistration();

      console.log(' Registro completado con éxito');
      this.navCtrl.navigateRoot('/login');
    } catch (error: any) {
      console.error(' Error al finalizar el registro:', error.message);
    }
  }
}
