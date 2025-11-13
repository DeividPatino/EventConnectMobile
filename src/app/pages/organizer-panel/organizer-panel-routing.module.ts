import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizerPanelPage } from './organizer-panel.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizerPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerPanelPageRoutingModule {}
