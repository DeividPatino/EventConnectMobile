import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutPage } from './checkout.page';
import { CheckoutPageRoutingModule } from './checkout-routing.module';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CheckoutPageRoutingModule, SharedModule],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}
