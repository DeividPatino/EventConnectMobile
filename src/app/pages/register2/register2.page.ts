import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { GlobalUser } from 'src/app/core/providers/global-user';

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

  public calculatedAge: number | null = null;

  constructor(
    private readonly navCtrl: NavController,
    private readonly globalUser: GlobalUser
  ) {
    this.initForm();
  }

  ngOnInit() {}

  private initForm() {
    this.birthDate = new FormControl('', [Validators.required]);
    this.idType = new FormControl('', [Validators.required]);
    this.idNumber = new FormControl('', [Validators.required, Validators.minLength(10)]);
    this.phone = new FormControl('', [Validators.required, Validators.minLength(10)]);

    this.registerForm = new FormGroup({
      birthDate: this.birthDate,
      idType: this.idType,
      idNumber: this.idNumber,
      phone: this.phone,
    });
  }


  public calculateAge() {
    const value = this.birthDate.value;
    if (!value) {
      this.calculatedAge = null;
      return;
    }

    const birthDateValue = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDateValue.getFullYear();
    const monthDiff = today.getMonth() - birthDateValue.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateValue.getDate())) {
      age--;
    }

    this.calculatedAge = age;
    console.log(`You are ${age} years old 🎉`);
  }

  public async doRegister2() {
    if (!this.registerForm.valid) {
      console.log('Completa todos los campos antes de continuar');
      this.registerForm.markAllAsTouched();
      return;
    }

    const { birthDate, idType, idNumber, phone } = this.registerForm.value;

    this.globalUser.setData('birthDate', birthDate);
    this.globalUser.setData('idType', idType);
    this.globalUser.setData('idNumber', idNumber);
    this.globalUser.setData('phone', phone);

    console.log('Datos guardados en GlobalUser:', this.globalUser.getData());

    this.navCtrl.navigateForward('/register3');
  }
}