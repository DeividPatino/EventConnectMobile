import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEventPage } from './my-event.page';

const routes: Routes = [
  {
    path: '',
    component: MyEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEventPageRoutingModule {}
