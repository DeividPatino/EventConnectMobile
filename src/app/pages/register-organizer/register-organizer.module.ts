import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterOrganizerPageRoutingModule } from './register-organizer-routing.module';

import { RegisterOrganizerPage } from './register-organizer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterOrganizerPageRoutingModule
  ],
  declarations: [RegisterOrganizerPage]
})
export class RegisterOrganizerPageModule {}
