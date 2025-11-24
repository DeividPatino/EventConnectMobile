import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StadiumsPage } from './stadiums.page';

const routes: Routes = [
  {
    path: '',
    component: StadiumsPage
  },  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StadiumsPageRoutingModule {}
