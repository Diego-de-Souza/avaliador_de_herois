import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null> | null = null;
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  constructor() { }

  async initializeStripe(): Promise<void> {
    try {
      // Só carregar se ainda não foi carregado
      if (!this.stripePromise) {
        this.stripePromise = loadStripe(environment.stripePublicKey);
      }

      this.stripe = await this.stripePromise;
      
      if (this.stripe) {
        this.elements = this.stripe.elements({
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0570de',
              colorBackground: '#ffffff',
              colorText: '#30313d',
              colorDanger: '#df1b41',
              fontFamily: 'Ideal Sans, system-ui, sans-serif',
              spacingUnit: '2px',
              borderRadius: '4px',
            }
          }
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
      throw error;
    }
  }

  createCardElement(): StripeCardElement | null {
    if (!this.elements) {
      console.error('Stripe Elements não inicializado');
      return null;
    }

    try {
      return this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
            iconColor: '#9e2146',
          },
        },
        hidePostalCode: true, // Esconder CEP se não necessário
      });
    } catch (error) {
      console.error('Erro ao criar card element:', error);
      return null;
    }
  }

  async confirmPayment(clientSecret: string, cardElement: StripeCardElement, billingDetails?: any): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails || {}
        }
      });

      return result;
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      throw error;
    }
  }

  async createPaymentMethod(cardElement: StripeCardElement, billingDetails?: any): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    try {
      const result = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails || {}
      });

      return result;
    } catch (error) {
      console.error('Erro ao criar método de pagamento:', error);
      throw error;
    }
  }

  // Método para definir tema dark
  setDarkTheme(): void {
    if (this.elements) {
      this.elements = this.stripe?.elements({
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#0570de',
            colorBackground: '#1a1b23',
            colorText: '#ffffff',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
          }
        }
      }) || null;
    }
  }

  // Método para definir tema light
  setLightTheme(): void {
    if (this.elements) {
      this.elements = this.stripe?.elements({
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
          }
        }
      }) || null;
    }
  }
}