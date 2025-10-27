import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class GlobalUser {
  private userData: User = {
    uid: '',
    email: '',
    firstName: '',
    lastName: '',
    idType: 'cc', // valor inicial por defecto
    idNumber: '',
    phone: '',
    password: '',
    birthDate: '',
    photos: []
  };

  // 🟢 Actualiza una propiedad específica
  setData(key: keyof User, value: any) {
    this.userData[key] = value;
    console.log('📦 User data actualizada:', this.userData);
  }

  // 🟢 Devuelve todos los datos del usuario
  getData(): User {
    return this.userData;
  }

  // 🧹 Limpia todos los datos del usuario
  clearData() {
    this.userData = {
      uid: '',
      email: '',
      firstName: '',
      lastName: '',
      idType: 'cc',
      idNumber: '',
      phone: '',
      password: '',
      birthDate: '',
      photos: []
    };
  }
}
