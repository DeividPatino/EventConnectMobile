import { Injectable } from '@angular/core';
import {
  Auth as Authfirebase,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(
    private readonly authFirebase: Authfirebase,
    private readonly router: Router
  ) {}

  // ✅ Registrar usuario y devolver UID
  async register(email: string, password: string): Promise<string> {
    try {
      const res: UserCredential = await createUserWithEmailAndPassword(
        this.authFirebase,
        email,
        password
      );
      console.log('✅ Usuario creado:', res.user.uid);
      return res.user.uid;
    } catch (error) {
      console.error('❌ Error en el registro:', (error as any).message);
      throw error;
    }
  }

  // ✅ Iniciar sesión
  async login(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(this.authFirebase, email, password);
      if (res) {
        console.log('✅ Sesión iniciada correctamente:', res.user.email);
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', (error as any).message);
    }
  }

  // ✅ Cerrar sesión
  async logOut() {
    try {
      await signOut(this.authFirebase);
      console.log('👋 Sesión cerrada');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', (error as any).message);
    }
  }
}
