import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Paypal {

  private api = "https://eventconnectmobile.onrender.com";

  constructor(private http: HttpClient) {}

  createOrder(amount: string): Observable<any> {
    return this.http.post(`${this.api}/create-order`, { amount });
  }

  captureOrder(orderID: string): Observable<any> {
    return this.http.post(`${this.api}/capture-order`, { orderID });
  }
}
