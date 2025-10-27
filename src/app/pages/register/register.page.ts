import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { GlobalUser } from 'src/app/core/providers/global-user';

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

  constructor(
    private readonly navCtrl: NavController,
    private readonly globalUser: GlobalUser
  ) {
    this.initForm();
  }

  ngOnInit() {}

 
  private initForm() {
    this.firstName = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.lastName = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.registerForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });
  }

  
  public async doRegister() {
    if (!this.registerForm.valid) {
      console.log(' Completa todos los campos antes de continuar');
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } = this.registerForm.value;

    this.globalUser.setData('firstName', firstName);
    this.globalUser.setData('lastName', lastName);
    this.globalUser.setData('email', email);
    this.globalUser.setData('password', password);

    console.log(' Datos guardados en GlobalUser:', this.globalUser.getData());

    
    this.navCtrl.navigateForward('/register2');
  }
}
