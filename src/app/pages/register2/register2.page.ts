import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.page.html',
  styleUrls: ['./register2.page.scss'],
  standalone: false,
})
export class Register2Page implements OnInit {
  public birthDate!: FormControl;
  public idType!: FormControl;
  public idNumber!: FormControl;
  public phone!: FormControl;
  public registerForm!: FormGroup;
  public userData!: Partial<User>;

  constructor(private readonly navCtrl: NavController) {
    this.initForm();
  }

  ngOnInit() {
    const savedUser = localStorage.getItem('userDataStep1');
    if (savedUser) {
      this.userData = JSON.parse(savedUser);
    }
  }

  private initForm() {
    this.birthDate = new FormControl('', [Validators.required]);
    this.idType = new FormControl('', [Validators.required]);
    this.idNumber = new FormControl('', [Validators.required]);
    this.phone = new FormControl('', [Validators.required]);

    this.registerForm = new FormGroup({
      birthDate: this.birthDate,
      idType: this.idType,
      idNumber: this.idNumber,
      phone: this.phone,
    });
  }

  public calculateAge() {
    const birthDateValue = this.birthDate.value;
    if (birthDateValue) {
      const today = new Date();
      const birthDate = new Date(birthDateValue);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      console.log(`Edad calculada: ${age} años`);
    }
  }

  public goToRegister3() {
    if (!this.registerForm.valid) {
      console.warn(' Debes completar todos los campos antes de continuar.');
      this.registerForm.markAllAsTouched();
      return;
    }

    const dataStep2 = this.registerForm.value;
    console.log(' Datos del usuario:', dataStep2);

    localStorage.setItem('userDataStep2', JSON.stringify(dataStep2));

    this.navCtrl.navigateForward('/register3');
  }
}
