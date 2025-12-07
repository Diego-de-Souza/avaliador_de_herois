import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentIntent, SubscriptionData } from '../../interface/subscriptionData.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string = 'brl'): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.apiUrl}/payment/create-intent`,
      {
        amount: amount * 100, 
        currency
      },
      { withCredentials: true }
    );
  }

  createSubscription(subscriptionData: SubscriptionData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/subscription/create`,
      subscriptionData,
      { withCredentials: true }
    );
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/payment/confirm`,
      { paymentIntentId },
      { withCredentials: true }
    );
  }
}