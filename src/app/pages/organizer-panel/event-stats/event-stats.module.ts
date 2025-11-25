import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EventStatsPage } from './event-stats.page';

@NgModule({
  declarations: [EventStatsPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild([{ path: '', component: EventStatsPage }])]
})
export class EventStatsPageModule {}
