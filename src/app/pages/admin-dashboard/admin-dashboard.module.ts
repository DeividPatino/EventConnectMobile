import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminDashboardPageRoutingModule } from './admin-dashboard-routing.module';

import { AdminDashboardPage } from './admin-dashboard.page';
import { SharedModule } from 'src/app/shared/shared-module';
import { CreatePageModule } from '../admin-dashboard/stadiums/create/create.module';
import { ListPageModule } from '../admin-dashboard/stadiums/list/list.module';
import { EditPageModule } from '../admin-dashboard/stadiums/edit/edit.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDashboardPageRoutingModule,
    SharedModule,
    CreatePageModule,
    ListPageModule,
    EditPageModule
  ],
  declarations: [
    AdminDashboardPage
  ]
})
export class AdminDashboardPageModule {}
