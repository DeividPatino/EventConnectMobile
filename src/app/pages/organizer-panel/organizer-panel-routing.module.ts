import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizerPanelPage } from './organizer-panel.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizerPanelPage,
    children: [
      {
        path: 'nuevo-evento',
        loadChildren: () => import('./new-event/new-event.module').then( m => m.NewEventPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerPanelPageRoutingModule {}
