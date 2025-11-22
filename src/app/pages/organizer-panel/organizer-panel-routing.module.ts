import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizerPanelPage } from './organizer-panel.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizerPanelPage
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'mis-eventos',
    loadChildren: () => import('./mis-eventos/mis-eventos.module').then( m => m.MisEventosPageModule)
  },
  {
    path: 'nuevo-evento',
    loadChildren: () => import('./nuevo-evento/nuevo-evento.module').then( m => m.NuevoEventoPageModule)
  },
  {
    path: 'mi-perfil',
    loadChildren: () => import('./mi-perfil/mi-perfil.module').then( m => m.MiPerfilPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerPanelPageRoutingModule {}
