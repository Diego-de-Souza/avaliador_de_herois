import { Injectable } from '@angular/core';
import { 
  loadStripe, 
  Stripe, 
  StripeElements, 
  StripePaymentElement,
  StripeCardElement,
  PaymentIntent,
  SetupIntent 
} from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StripeConfig {
  theme: 'stripe' | 'night' | 'flat';
  appearance: {
    variables: {
      colorPrimary: string;
      colorBackground: string;
      colorText: string;
      colorDanger: string;
      fontFamily: string;
      spacingUnit: string;
      borderRadius: string;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null> | null = null;
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private currentClientSecret: string | null = null;
  
  // Observable para status de inicialização
  private initialized$ = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.initialized$.asObservable();

  constructor() { }

  /**
   * Inicializa o Stripe com configurações personalizadas
   */
  async initializeStripe(theme: 'light' | 'dark' = 'light'): Promise<void> {
    try {
      if (!this.stripePromise) {
        this.stripePromise = loadStripe(environment.stripePublicKey);
      }

      this.stripe = await this.stripePromise;
      
      if (!this.stripe) {
        throw new Error('Falha ao carregar Stripe');
      }

      this.initialized$.next(true);
      console.log('✅ Stripe inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar Stripe:', error);
      this.initialized$.next(false);
      throw error;
    }
  }

  /**
   * Cria elementos Stripe com client secret
   */
  async createElements(clientSecret: string, theme: 'light' | 'dark' = 'light'): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    this.currentClientSecret = clientSecret;
    
    const appearance = this.getThemeConfig(theme);
    
    this.elements = this.stripe.elements({
      clientSecret,
      appearance
    });

    console.log('✅ Stripe Elements criados com sucesso');
  }

  /**
   * Obtém configuração de tema
   */
  private getThemeConfig(theme: 'light' | 'dark'): StripeConfig['appearance'] {
    const themes = {
      light: {
        variables: {
          colorPrimary: '#0570de',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        }
      },
      dark: {
        variables: {
          colorPrimary: '#635bff',
          colorBackground: '#0a0e27',
          colorText: '#ffffff',
          colorDanger: '#fa755a',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        }
      }
    };

    return themes[theme];
  }

  /**
   * Cria Payment Element moderno
   */
  createPaymentElement(): StripePaymentElement | null {
    if (!this.elements) {
      console.error('❌ Stripe Elements não inicializado');
      return null;
    }

    try {
      const paymentElement = this.elements.create('payment', {
        layout: 'tabs',
        defaultValues: {
          billingDetails: {
            address: {
              country: 'BR',
            }
          }
        },
        paymentMethodOrder: ['card', 'pix']
        // Removido fields.billingDetails.address.country: 'never' para deixar o Stripe coletar o país
      });

      console.log('✅ Payment Element criado com sucesso');
      return paymentElement;
    } catch (error) {
      console.error('❌ Erro ao criar Payment Element:', error);
      return null;
    }
  }

  /**
   * Cria Address Element (opcional para checkout completo)
   */
  createAddressElement(): any | null {
    if (!this.elements) {
      console.error('❌ Stripe Elements não inicializado');
      return null;
    }

    try {
      return this.elements.create('address', {
        mode: 'billing',
        allowedCountries: ['BR'],
        defaultValues: {
          address: {
            country: 'BR',
          }
        }
      });
    } catch (error) {
      console.error('❌ Erro ao criar Address Element:', error);
      return null;
    }
  }

  /**
   * Confirma pagamento usando Payment Element
   */
  async confirmPayment(options?: { 
    return_url?: string,
    confirmParams?: any 
  }): Promise<{ error?: any, paymentIntent?: PaymentIntent }> {
    if (!this.stripe || !this.elements) {
      throw new Error('Stripe ou Elements não inicializados');
    }

    try {
      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: options?.return_url || window.location.origin + '/features/shopping/payment-success',
          ...options?.confirmParams
        },
        redirect: 'if_required'
      });

      if (result.error) {
        console.error('❌ Erro na confirmação:', result.error);
      } else {
        console.log('✅ Pagamento confirmado:', result.paymentIntent);
      }

      return result;
    } catch (error) {
      console.error('❌ Erro ao confirmar pagamento:', error);
      throw error;
    }
  }

  /**
   * Processa setup para pagamentos futuros
   */
  async confirmSetup(options?: { 
    return_url?: string,
    confirmParams?: any 
  }): Promise<{ error?: any, setupIntent?: SetupIntent }> {
    if (!this.stripe || !this.elements) {
      throw new Error('Stripe ou Elements não inicializados');
    }

    try {
      const result = await this.stripe.confirmSetup({
        elements: this.elements,
        confirmParams: {
          return_url: options?.return_url || window.location.origin + '/setup-success',
          ...options?.confirmParams
        },
        redirect: 'if_required'
      });

      return result;
    } catch (error) {
      console.error('❌ Erro ao confirmar setup:', error);
      throw error;
    }
  }

  /**
   * Recupera PaymentIntent
   */
  async retrievePaymentIntent(clientSecret: string): Promise<{ paymentIntent?: PaymentIntent, error?: any }> {
    if (!this.stripe) {
      throw new Error('Stripe não inicializado');
    }

    try {
      return await this.stripe.retrievePaymentIntent(clientSecret);
    } catch (error) {
      console.error('❌ Erro ao recuperar PaymentIntent:', error);
      throw error;
    }
  }

  /**
   * Atualiza tema dos elementos
   */
  async updateTheme(theme: 'light' | 'dark'): Promise<void> {
    if (!this.stripe || !this.currentClientSecret) {
      console.warn('⚠️ Não é possível atualizar tema: Stripe ou ClientSecret não disponível');
      return;
    }

    try {
      const appearance = this.getThemeConfig(theme);
      
      this.elements = this.stripe.elements({
        clientSecret: this.currentClientSecret,
        appearance
      });

      console.log(`✅ Tema atualizado para: ${theme}`);
    } catch (error) {
      console.error('❌ Erro ao atualizar tema:', error);
    }
  }

  /**
   * Limpa recursos do Stripe
   */
  cleanup(): void {
    this.elements = null;
    this.currentClientSecret = null;
    this.initialized$.next(false);
    console.log('🧹 Stripe resources cleaned up');
  }

  /**
   * Obtém status de inicialização
   */
  isInitialized(): boolean {
    return this.initialized$.value && !!this.stripe;
  }

  /**
   * Obtém instância do Stripe
   */
  getStripe(): Stripe | null {
    return this.stripe;
  }

  /**
   * Obtém Elements atual
   */
  getElements(): StripeElements | null {
    return this.elements;
  }


}