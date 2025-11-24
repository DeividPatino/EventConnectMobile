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
        path: 'mis-eventos',
        loadChildren: () => import('./my-event/my-event.module').then( m => m.MyEventPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'my-event',
    loadChildren: () => import('./my-event/my-event.module').then( m => m.MyEventPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  }
  ,{
    path: 'event-details/:eventId',
    loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerPanelPageRoutingModule {}
