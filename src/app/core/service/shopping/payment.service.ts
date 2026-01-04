import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PaymentIntent, SubscriptionData } from '../../interface/subscriptionData.interface';
import { CreatePaymentIntentRequest, PaymentIntentResponse, SetupIntentResponse } from '../../interface/payment.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Cria Payment Intent para pagamentos únicos (versão moderna)
   */
  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<PaymentIntentResponse> {
    this.setLoading(true);
    return this.http.post<PaymentIntentResponse>(
      `${this.apiUrl}/payment/create-payment-intent`,
      {
        planType: request.planType,
        amount: request.amount
      },
      { withCredentials: true }
    ).pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }



  /**
   * Cria assinatura recorrente (se usar)
   */
  createSubscription(planType: 'mensal' | 'trimestral' | 'semestral' | 'anual'): Observable<any> {
    this.setLoading(true);
    return this.http.post(
      `${this.apiUrl}/payment/create-subscription`,
      { planType },
      { withCredentials: true }
    ).pipe(
      tap(() => this.setLoading(false)),
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
  getPremiumStatus(): Observable<{
    hasPremium: boolean;
    subscription: any;
    daysRemaining: number;
    planType: string;
    expiresAt: string;
    message: string;
  }> {
    return this.http.get<{
      hasPremium: boolean;
      subscription: any;
      daysRemaining: number;
      planType: string;
      expiresAt: string;
      message: string;
    }>(
      `${this.apiUrl}/payment/premium-status`,
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