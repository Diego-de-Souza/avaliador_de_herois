import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PaymentIntent, SubscriptionData } from '../../interface/subscriptionData.interface';
import { environment } from '../../../../environments/environment';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  payment_method_types?: string[];
  metadata?: Record<string, string>;
  setup_future_usage?: 'on_session' | 'off_session';
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiURL;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Cria Payment Intent para pagamentos únicos (versão moderna)
   */
  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<PaymentIntentResponse>;
  /**
   * Cria Payment Intent (versão legacy para compatibilidade)
   * @deprecated Use the version with CreatePaymentIntentRequest
   */
  createPaymentIntent(amount: number, currency?: string): Observable<PaymentIntent>;
  createPaymentIntent(requestOrAmount: CreatePaymentIntentRequest | number, currency?: string): Observable<PaymentIntentResponse | PaymentIntent> {
    // Verificar se é a chamada legacy
    if (typeof requestOrAmount === 'number') {
      const amount = requestOrAmount;
      const curr = currency || 'brl';
      
      this.setLoading(true);
      
      return this.http.post<PaymentIntent>(
        `${this.apiUrl}/payment/create-payment-intent`,
        {
          amount: amount * 100,
          currency: curr
        },
        { withCredentials: true }
      ).pipe(
        tap(() => this.setLoading(false)),
        catchError(this.handleError.bind(this))
      );
    }

    // Versão moderna
    const request = requestOrAmount as CreatePaymentIntentRequest;
    this.setLoading(true);
    
    const payload = {
      amount: request.amount * 100, // Converter para centavos
      currency: request.currency.toLowerCase(),
      payment_method_types: request.payment_method_types || ['card', 'pix'],
      metadata: request.metadata || {},
      setup_future_usage: request.setup_future_usage
    };

    return this.http.post<PaymentIntentResponse>(
      `${this.apiUrl}/payment/create-payment-intent`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Cria Setup Intent para salvar métodos de pagamento
   */
  createSetupIntent(customerId?: string): Observable<SetupIntentResponse> {
    this.setLoading(true);
    
    return this.http.post<SetupIntentResponse>(
      `${this.apiUrl}/payment/create-setup-intent`,
      { customer_id: customerId },
      { withCredentials: true }
    ).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Cria assinatura com Payment Element
   */
  createSubscription(subscriptionData: SubscriptionData): Observable<any> {
    this.setLoading(true);
    
    return this.http.post(
      `${this.apiUrl}/subscription/create`,
      subscriptionData,
      { withCredentials: true }
    ).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Confirma pagamento no backend
   */
  confirmPayment(paymentIntentId: string, metadata?: Record<string, any>): Observable<any> {
    this.setLoading(true);
    
    return this.http.post(
      `${this.apiUrl}/payment/confirm`,
      { 
        paymentIntentId,
        metadata: metadata || {}
      },
      { withCredentials: true }
    ).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Obtém histórico de pagamentos
   */
  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/payment/history`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Cancela Payment Intent
   */
  cancelPaymentIntent(paymentIntentId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/payment/cancel`,
      { paymentIntentId },
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Lista planos de assinatura disponíveis
   */
  getPlans(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/payment/plans`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Verifica status premium do usuário
   */
  getPremiumStatus(): Observable<{ premium: boolean }> {
    return this.http.get<{ premium: boolean }>(
      `${this.apiUrl}/payment/premium-status`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Obtém assinatura ativa do usuário
   */
  getActiveSubscription(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/payment/subscription`,
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Cancela assinatura premium do usuário
   */
  cancelSubscription(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/payment/cancel-subscription`,
      {},
      { withCredentials: true }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Gerencia estado de loading
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Tratamento de erros
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.setLoading(false);
    
    let errorMessage = 'Erro desconhecido no pagamento';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('❌ Erro no PaymentService:', error);
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}