export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface SubscriptionData {
  planId: string;
  userId: string;
  paymentMethodId?: string;
}