export interface CreatePaymentIntentRequest {
  planType: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  amount: number; // em reais, ex: 29.9
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

