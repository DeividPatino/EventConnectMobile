import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StadiumsPageRoutingModule } from './stadiums-routing.module';

import { StadiumsPage } from './stadiums.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StadiumsPageRoutingModule
  ],
  declarations: [StadiumsPage]
})
export class StadiumsPageModule {}
