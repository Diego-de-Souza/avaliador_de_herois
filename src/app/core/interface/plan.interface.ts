export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'quarterly' | 'semiannually' | 'yearly';
  features: string[];
  stripePriceId: string;
  active: boolean;
}