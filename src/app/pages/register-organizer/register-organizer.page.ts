import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/providers/auth';
import { Organizer } from 'src/app/interfaces/organizer';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-organizer',
  templateUrl: './register-organizer.page.html',
  styleUrls: ['./register-organizer.page.scss'],
  standalone: false,
})
export class RegisterOrganizerPage implements OnInit {

  organizer: Organizer = {
    uid: '',
    email: '',
    companyName: '',
    representativeName: '',
    nit: '',
    phone: '',
    website: '',
    category: '',
    address: '',
    city: '',
    description: '',
    logo: '',
    role: 'organizer',
    verified: false,
    socials: {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      whatsapp: ''
    },
    eventsCount: 0,
    rating: 0
  } as Organizer;

  password = '';
  step = 1;
  previewLogo: string | null = null;
  logoFile: File | null = null;

  constructor(private auth: Auth) { }

  ngOnInit() {
  }

  async submit(form?: NgForm) {
    try {
      if (form && form.invalid) {
        // mark fields as touched/shown by template-driven errors
        return;
      }

      await this.auth.registerOrganizer(this.organizer, this.password, this.logoFile || undefined);
      // navegar o mostrar éxito
    } catch (err) {
      console.error('Error registrando organizer', err);
    }
  }

  next() {
    if (this.step < 4) this.step++;
  }

  prev() {
    if (this.step > 1) this.step--;
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.logoFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewLogo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
