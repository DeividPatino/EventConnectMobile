import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEventPageRoutingModule } from './my-event-routing.module';

import { MyEventPage } from './my-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEventPageRoutingModule
  ],
  declarations: [MyEventPage]
})
export class MyEventPageModule {}
