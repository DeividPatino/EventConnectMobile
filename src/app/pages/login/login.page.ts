import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private navCtrl: NavController) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }

  onlogin() {
    if (this.loginForm.valid) {
      console.log('Inicio de sesión exitoso:', this.loginForm.value);
      this.navCtrl.navigateForward('/home');
    }
  }
}
