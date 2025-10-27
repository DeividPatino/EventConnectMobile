import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Auth } from 'src/app/core/providers/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  public email!: FormControl;
  public password!: FormControl;
  public loginForm!: FormGroup;

  constructor(
    private readonly auth: Auth,
    private readonly navCtrl: NavController
  ) {
    this.initForm();
  }

  ngOnInit() {}

  private initForm() {
    this.email = new FormControl('', [Validators.email, Validators.required]);
    this.password = new FormControl('', [Validators.required]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  public async onlogin() {
    if (this.loginForm.invalid) {
      console.log(' El formulario no es válido. Completa todos los campos.');
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log(' Iniciando sesión con:', this.loginForm.value);

    try {
      await this.auth.login(this.email.value, this.password.value);
      console.log('inicio de sesión exitoso');
      this.navCtrl.navigateRoot('/homescreen'); 
    } catch (error: any) {
      console.log(' Error al iniciar sesión:', error.message);
    }
  }
}
