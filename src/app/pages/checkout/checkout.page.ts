import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EventsService } from '../../shared/services/events.service';
import { PurchaseService } from '../../shared/services';
import { Event } from '../../interfaces/event';
import { Zone } from '../../interfaces/zone';
import { Auth } from '../../core/providers/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false,
})
export class CheckoutPage implements OnInit {
  @Input() eventId!: string;
  @Input() zoneId!: string;
  event?: Event; zone?: Zone;
  quantity: number = 1;
  paymentMethod: string = 'card';
  loaded = false;
  processing = false;
  errorMsg = ''; successMsg = '';

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private purchaseService: PurchaseService,
    private auth: Auth,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // If the page was opened via routing, use route params; if opened as modal, inputs may be provided.
    const rid = this.route.snapshot.paramMap.get('eventId');
    const rzn = this.route.snapshot.paramMap.get('zoneId');
    if (!this.eventId) this.eventId = rid || '';
    if (!this.zoneId) this.zoneId = rzn || '';
    if (!this.eventId || !this.zoneId) { this.errorMsg = 'Faltan parámetros.'; return; }

    // Cargar datos básicos (event + zone list) y filtrar zona
    this.eventsService.getEvent(this.eventId).subscribe(ev => this.event = ev);
    this.eventsService.getZones(this.eventId).subscribe(zs => {
      this.zone = zs.find(z => z.id === this.zoneId);
      this.loaded = true;
    });
  }

  async goToHome() {
    try {
      const top = await this.modalCtrl.getTop();
      if (top) {
        await top.dismiss();
      }
    } catch (e) {
      // ignore
    }
    // navigate to homescreen
    this.router.navigate(['/homescreen']);
  }

  async simulatePay() {
    this.errorMsg = ''; this.successMsg = '';
    if (!this.zone || !this.event) { this.errorMsg = 'Datos incompletos.'; return; }
    if (this.quantity < 1 || this.quantity > (this.zone.availableTickets || 0)) { this.errorMsg = 'Cantidad inválida.'; return; }
    const user = this.auth.getUser();
    if (!user) { this.errorMsg = 'Necesitas iniciar sesión.'; return; }

    this.processing = true;
    try {
      const orderId = await this.purchaseService.simulatePurchase({
        userUid: (user as any).uid || (user as any).id || '',
        eventId: this.eventId,
        zoneId: this.zoneId,
        quantity: this.quantity,
        unitPrice: this.zone.price
      });
      this.successMsg = 'Compra realizada. Orden: ' + orderId;
      // Opcional: navegar al perfil o a un resumen
      // this.router.navigate(['/profile']);
    } catch (e:any) {
      this.errorMsg = e.message || 'Error en la compra.';
    } finally {
      this.processing = false;
    }
  }

  /*
   * INTEGRACIÓN REAL PAYPAL (GUÍA):
   * 1. Añadir script SDK en index.html con client-id.
   * 2. Reemplazar el botón de pago simulado por un contenedor.
   * 3. En un lifecycle (ngAfterViewInit) cargar paypal.Buttons({ createOrder, onApprove })
   *    - createOrder llama a backend para crear orden y retorna id.
   *    - onApprove llama backend para capturar y luego purchaseService.finalizePayPal(orderId).
   * 4. Backend valida y firma la transacción.
   *
   * GOOGLE PAY (GUÍA):
   * 1. Preparar paymentDataRequest con merchantInfo y transactionInfo (precio, moneda COP).
   * 2. Inicializar Google Pay client y mostrar botón.
   * 3. Al obtener paymentData, enviar token al backend para procesar.
   * 4. Backend confirma y luego se llama purchaseService.finalizeExternal(orderData).
   */
}
