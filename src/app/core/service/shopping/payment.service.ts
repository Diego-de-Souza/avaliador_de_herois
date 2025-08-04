import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const headers = this.getAuthHeaders();
    
    return this.http.post<PaymentIntent>(`${this.apiUrl}/payment/create-intent`, {
      amount: amount * 100, // Stripe trabalha com centavos
      currency
    }, { headers });
  }

  createSubscription(subscriptionData: SubscriptionData): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.post(`${this.apiUrl}/subscription/create`, subscriptionData, { headers });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.post(`${this.apiUrl}/payment/confirm`, {
      paymentIntentId
    }, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}