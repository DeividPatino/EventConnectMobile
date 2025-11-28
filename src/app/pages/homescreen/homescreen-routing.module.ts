import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomescreenPage } from './homescreen.page';

const routes: Routes = [
  {
    path: '',
    component: HomescreenPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then(m => m.CategoriesPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },  {
    path: 'entradas',
    loadChildren: () => import('./entradas/entradas.module').then( m => m.EntradasPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomescreenPageRoutingModule {}
