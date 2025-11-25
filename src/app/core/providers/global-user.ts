import { Injectable } from "@angular/core";
import { User } from "src/app/interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class GlobalUser {
  private userData: User = {
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

  setData<K extends keyof User>(key: K, value: User[K]) {
    this.userData[key] = value;
  }

  getData(): User {
    return this.userData;
  }

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


