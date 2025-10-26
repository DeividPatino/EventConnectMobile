import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Register2PageRoutingModule } from './register2-routing.module';

import { Register2Page } from './register2.page';
import { SharedModule } from "src/app/shared/shared-module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Register2PageRoutingModule,
    SharedModule
],
  declarations: [Register2Page]
})
export class Register2PageModule {}
