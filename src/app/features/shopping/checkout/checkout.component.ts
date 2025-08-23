import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CartService } from '../../../core/service/shopping/cart.service';
import { StripeService } from '../../../core/service/shopping/stripe.service';
import { PaymentService } from '../../../core/service/shopping/payment.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart } from '../../../core/interface/cart.interface';
import { StripeCardElement } from '@stripe/stripe-js';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @ViewChild('cardElement', { static: true }) cardElement!: ElementRef;

  cartService = inject(CartService);
  stripeService = inject(StripeService);
  paymentService = inject(PaymentService);
  router = inject(Router);
  themeService = inject(ThemeService);
  fb = inject(FormBuilder);

  cart: Cart = { items: [], total: 0, currency: 'BRL' };
  checkoutForm: FormGroup;
  _themeCheckout: string = 'dark';
  
  loading = false;
  cardElementReady = false;
  card: StripeCardElement | null = null;
  
  private destroy$ = new Subject<void>();

  constructor() {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    // Carregar carrinho
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        if (cart.items.length === 0) {
          this.router.navigate(['/features/shopping/plans']);
        }
      });

    // Aplicar tema
    this.themeService.theme$.subscribe(theme => {
      this._themeCheckout = theme;
      this.applyTheme(theme);
    });

    // Inicializar Stripe
    await this.initializeStripe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async initializeStripe(): Promise<void> {
    try {
      await this.stripeService.initializeStripe();
      this.card = this.stripeService.createCardElement();
      
      if (this.card) {
        this.card.mount(this.cardElement.nativeElement);
        this.card.on('ready', () => {
          this.cardElementReady = true;
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
    }
  }

  async processPayment(): Promise<void> {
    if (this.checkoutForm.invalid || !this.card || this.loading) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;

    try {
      // Preparar dados de cobrança
      const billingDetails = {
        name: this.checkoutForm.get('fullName')?.value,
        email: this.checkoutForm.get('email')?.value,
        phone: this.checkoutForm.get('phone')?.value,
        address: {
          country: 'BR', // Brasil
        }
      };

      // Criar Payment Intent
      const paymentIntent = await this.paymentService.createPaymentIntent(
        this.cart.total
      ).toPromise();

      if (!paymentIntent) {
        throw new Error('Erro ao criar intenção de pagamento');
      }

      // Confirmar pagamento com Stripe incluindo billing details
      const result = await this.stripeService.confirmPayment(
        paymentIntent.clientSecret,
        this.card,
        billingDetails
      );

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Confirmar pagamento no backend
      await this.paymentService.confirmPayment(
        paymentIntent.paymentIntentId
      ).toPromise();

      // Limpar carrinho e redirecionar
      this.cartService.clearCart();
      this.router.navigate(['/features/shopping/payment-success'], {
        queryParams: { paymentId: paymentIntent.paymentIntentId }
      });

    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      this.handlePaymentError(error);
    } finally {
      this.loading = false;
    }
  }

  private handlePaymentError(error: any): void {
    let errorMessage = 'Erro desconhecido no pagamento';

    if (error.type === 'card_error' || error.type === 'validation_error') {
      errorMessage = error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(`Erro no pagamento: ${errorMessage}`);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  // Método para aplicar tema no Stripe Elements
  async applyStripeTheme(theme: string): Promise<void> {
    if (theme === 'dark') {
      this.stripeService.setDarkTheme();
    } else {
      this.stripeService.setLightTheme();
    }

    // Recriar o card element com o novo tema
    if (this.card) {
      this.card.unmount();
      this.card = this.stripeService.createCardElement();
      if (this.card) {
        this.card.mount(this.cardElement.nativeElement);
        this.card.on('ready', () => {
          this.cardElementReady = true;
        });
      }
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  goBackToCart(): void {
    this.router.navigate(['/features/shopping/cart']);
  }

  async applyTheme(theme: string) {
    const el = document.getElementById('checkout_container');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }

    await this.applyStripeTheme(theme);
  }
}
