import { Injectable } from '@angular/core';
import {
  Auth as AuthFirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc
} from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { GlobalUser } from './global-user';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private currentUser!: User | null;

  constructor(
    private authFirebase: AuthFirebase,
    private firestore: Firestore,
    private navCtrl: NavController,
    private globalUser: GlobalUser
  ) {}

  // ✅ Guarda temporalmente el usuario actual
  setUser(user: User) {
    this.currentUser = user;
  }

  // ✅ Devuelve el usuario actual (por ejemplo, para Chatbot)
  getUser(): User | null {
    return this.currentUser;
  }

  // ✅ Registro de usuario
  async finishRegistration(): Promise<void> {
    try {
      const userData: User = this.globalUser.getData();

      if (!userData.email || !userData.password) {
        throw new Error('Faltan campos obligatorios: email o contraseña.');
      }

      // Registro en Firebase Auth
      const res: UserCredential = await createUserWithEmailAndPassword(
        this.authFirebase,
        userData.email,
        userData.password
      );

      const uid = res.user.uid;
      console.log('✅ Usuario registrado con UID:', uid);

      // Guarda datos en Firestore
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
        role: 'user',
        createdAt: new Date()
      });

      console.log('📦 Datos guardados correctamente en Firestore');
      this.globalUser.clearData();
      this.navCtrl.navigateRoot('/login');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.error('⚠️ Este correo ya está en uso.');
        this.navCtrl.navigateRoot('/register');
      } else if (error.code === 'auth/invalid-email') {
        console.error('⚠️ Correo con formato inválido.');
      } else {
        console.error('❌ Error al registrar:', error.message);
      }
    }
  }

  // ✅ Inicio de sesión
  async login(email: string, password: string): Promise<void> {
    try {
      // Admin directo
      const adminEmail = 'admin.eventconnect@eve.co';
      const adminPassword = 'Admin1234';

      if (email === adminEmail && password === adminPassword) {
        console.log('👑 Bienvenido Administrador');
        this.navCtrl.navigateRoot('/admin-dashboard');
        return;
      }

      // Login normal
      const res = await signInWithEmailAndPassword(this.authFirebase, email, password);
      console.log('✅ Usuario autenticado:', res.user.email);

      // Buscar sus datos en Firestore
      const userRef = doc(this.firestore, `users/${res.user.uid}`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        this.setUser(data);
        console.log('👤 Usuario cargado:', data.firstName);
      }

      // Redirigir
      this.navCtrl.navigateRoot('/homescreen');

    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error.message);
      throw error;
    }
  }

  // ✅ Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.authFirebase);
      console.log('👋 Usuario deslogueado');
      this.currentUser = null;
      this.navCtrl.navigateRoot('/login');
    } catch (error: any) {
      console.error('❌ Error al cerrar sesión:', error.message);
    }
  }

  // ✅ Obtener todos los usuarios de una colección
  async getAll(collectionName: string): Promise<User[] | null> {
    try {
      const ref = collection(this.firestore, collectionName);
      const snapshot = await getDocs(ref);

      if (snapshot.empty) {
        console.warn('⚠️ No hay usuarios en la colección');
        return null;
      }

      return snapshot.docs.map(doc => doc.data() as User);
    } catch (error) {
      console.error('❌ Error en getAll:', error);
      return null;
    }
  }
}