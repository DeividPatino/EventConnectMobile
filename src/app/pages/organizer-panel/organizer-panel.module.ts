import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizerPanelPageRoutingModule } from './organizer-panel-routing.module';

import { OrganizerPanelPage } from './organizer-panel.page';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizerPanelPageRoutingModule,
    SharedModule
  ],
  declarations: [OrganizerPanelPage]
})
export class OrganizerPanelPageModule {}
