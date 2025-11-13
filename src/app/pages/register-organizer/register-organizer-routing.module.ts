import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterOrganizerPage } from './register-organizer.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterOrganizerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterOrganizerPageRoutingModule {}
