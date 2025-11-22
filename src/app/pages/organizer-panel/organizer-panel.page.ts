import { Routes } from '@angular/router';
import { OrganizerPanelPage } from './organizer-panel.page'; // Ensure this path is correct

const routes: Routes = [
  {
    path: '',
    component: OrganizerPanelPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'mis-eventos',
        loadChildren: () =>
          import('./mis-eventos/mis-eventos.module').then(m => m.MisEventosPageModule)
      },
      {
        path: 'nuevo-evento',
        loadChildren: () =>
          import('./nuevo-evento/nuevo-evento.module').then(m => m.NuevoEventoPageModule)
      },
      {
        path: 'mi-perfil',
        loadChildren: () =>
          import('./mi-perfil/mi-perfil.module').then(m => m.MiPerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
// Removed circular export to avoid import alias definition issues

