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

  setData(key: keyof User, value: any) {
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


