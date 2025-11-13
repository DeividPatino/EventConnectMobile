import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizerPanelPageRoutingModule } from './organizer-panel-routing.module';

import { OrganizerPanelPage } from './organizer-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizerPanelPageRoutingModule
  ],
  declarations: [OrganizerPanelPage]
})
export class OrganizerPanelPageModule {}
