import { Injectable } from '@angular/core';
import {
  Auth as AuthFirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, getDocs } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { GlobalUser } from './global-user';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(
    private authFirebase: AuthFirebase,
    private firestore: Firestore,
    private navCtrl: NavController,
    private globalUser: GlobalUser
  ) {}

  // 🧩 Registrar usuario y guardar en Firestore
  async finishRegistration() {
    try {
      const userData: User = this.globalUser.getData();

      if (!userData.email || !userData.password) {
        console.error('⚠️ Email o contraseña vacíos. Completa los campos.');
        return;
      }

      // 🔹 Crear usuario en Firebase Authentication
      const res = await createUserWithEmailAndPassword(
        this.authFirebase,
        userData.email,
        userData.password
      );

      const uid = res.user.uid;
      console.log('✅ Usuario registrado con UID:', uid);

      // 🔹 Guardar datos en Firestore
      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userRef, {
        uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        idType: userData.idType,
        idNumber: userData.idNumber,
        phone: userData.phone,
        birthDate: userData.birthDate || '',
        photos: userData.photos || [],
        createdAt: new Date()
      });

      console.log(' Datos guardados correctamente en Firestore ');
      this.globalUser.clearData();
      this.navCtrl.navigateRoot('/login');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.error(' Este correo ya está en uso. Usa otro.');
        this.navCtrl.navigateRoot('/register');
      } else if (error.code === 'auth/invalid-email') {
        console.error(' Formato de correo inválido.');
      } else {
        console.error(' Error al completar el registro:', error.message);
      }
    }
  }

  async login(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(this.authFirebase, email, password);
      console.log('👋 Bienvenid@:', res.user.email);
      this.navCtrl.navigateRoot('/home');
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error.message);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.authFirebase);
      console.log('👋 Usuario deslogueado');
      this.navCtrl.navigateRoot('/login');
    } catch (error: any) {
      console.error(' Error al cerrar sesión:', error.message);
    }
  }

  async getAll(collectionName: string) {
    try {
      const ref = collection(this.firestore, collectionName);
      const snapshot = await getDocs(ref);

      if (snapshot.empty) {
        console.warn(' No hay usuarios en la colección');
        return null;
      }

      return snapshot.docs.map(doc => ({
        ...(doc.data() as User)
      }));
    } catch (error) {
      console.error(' Error en getAll:', error);
      return;
    }
  }
}
