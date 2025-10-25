import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public firstName!: FormControl;
  public lastName!: FormControl;
  public email!: FormControl;
  public password!: FormControl;
  public registerForm!: FormGroup;

  constructor(private readonly navCtrl: NavController) {
    this.initForm();
  }

  ngOnInit() {}

  
  private initForm() {
    this.firstName = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.lastName = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]);

    this.registerForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });
  }

  public async doRegister() {
    if (!this.registerForm.valid) {
      console.log('⚠️ Debes completar todos los campos correctamente.');
      this.registerForm.markAllAsTouched();
      alert('Por favor completa todos los campos antes de continuar.');
      return;
    }

    const { firstName, lastName, email, password } = this.registerForm.value;

    console.log(' Datos del usuario:', {
      firstName,
      lastName,
      email,
      password,
    });

   
    this.navCtrl.navigateForward('/register2');
  }
}
