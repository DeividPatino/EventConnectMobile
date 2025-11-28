import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EventsService } from '../../shared/services/events.service';
import { PurchaseService } from '../../shared/services';
import { Event } from '../../interfaces/event';
import { Zone } from '../../interfaces/zone';
import { Auth } from '../../core/providers/auth';
import { Paypal } from 'src/app/shared/services/paypal';


declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone:false,
})
export class CheckoutPage implements OnInit, AfterViewInit, OnChanges {

  @Input() eventId!: string;
  @Input() zoneId!: string;

  event?: Event;
  zone?: Zone;

  quantity: number = 1;
  loaded = false;
  paymentMethod: 'card' | 'paypal' = 'paypal'; // Predeterminado a PayPal
  processing = false;
  paypalResult: any;
  errorMsg = '';
  successMsg = '';

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private purchaseService: PurchaseService,
    private paypalService: Paypal,
    private auth: Auth,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const rid = this.route.snapshot.paramMap.get('eventId');
    const rzn = this.route.snapshot.paramMap.get('zoneId');
    if (!this.eventId) this.eventId = rid || '';
    if (!this.zoneId) this.zoneId = rzn || '';

    this.eventsService.getEvent(this.eventId).subscribe(ev => this.event = ev);
    this.eventsService.getZones(this.eventId).subscribe(zs => {
      this.zone = zs.find(z => z.id === this.zoneId);
      this.loaded = true;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderPayPalButton(), 800);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quantity'] && this.paymentMethod === 'paypal') {
      setTimeout(() => this.renderPayPalButton(), 300); // Actualiza el monto si cambia la cantidad
    }
  }

  goToHome() {
    this.router.navigate(['/homescreen']);
  }

  renderPayPalButton() {
    if (!this.zone || this.paymentMethod !== 'paypal') return;

    // Limpiar contenedor anterior
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';

    const amount = (this.zone.price * this.quantity).toFixed(2);

    paypal.Buttons({
      createOrder: () => {
        return this.paypalService.createOrder(amount).toPromise().then((res: any) => res.orderID);
      },
      onApprove: async (data: any) => {
        try {
          this.processing = true;
          const capture = await this.paypalService.captureOrder(data.orderID).toPromise();
          this.paypalResult = capture;

          const user = this.auth.getUser();
          await this.purchaseService.finalizeExternalPurchase({
            userUid: (user as any).uid,
            eventId: this.eventId,
            zoneId: this.zoneId,
            quantity: this.quantity,
            unitPrice: this.zone!.price,
            paymentMethod: 'paypal',
            externalOrderId: capture.id
          });

          this.successMsg = `Pago PayPal completado! ID: ${capture.id}`;
        } catch (err: any) {
          console.error(err);
          this.errorMsg = err.message || 'Error procesando PayPal';
        } finally {
          this.processing = false;
        }
      },
      onError: (err: any) => {
        console.error(err);
        this.errorMsg = 'Error en PayPal';
      }
    }).render('#paypal-button-container');
  }
}
