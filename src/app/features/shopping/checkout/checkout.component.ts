import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CartService } from '../../../core/service/shopping/cart.service';
import { StripeService } from '../../../core/service/shopping/stripe.service';
import { PaymentService, CreatePaymentIntentRequest } from '../../../core/service/shopping/payment.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart } from '../../../core/interface/cart.interface';
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
  paymentElement: any = null;
  paymentElementReady = false;
  
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
    this.themeService.theme$.subscribe(async theme => {
      this._themeCheckout = theme;
      await this.applyTheme(theme);
    });

    // Inicializar Stripe moderno
    await this.initializeStripe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async initializeStripe(): Promise<void> {
    try {
      await this.stripeService.initializeStripe(this._themeCheckout as 'light' | 'dark');
      // Criar PaymentIntent
      const paymentIntent = await this.paymentService.createPaymentIntent({
        amount: this.cart.total,
        currency: 'brl'
      }).toPromise();
      if (!paymentIntent) throw new Error('Erro ao criar intenção de pagamento');
      await this.stripeService.createElements(paymentIntent.clientSecret, this._themeCheckout as 'light' | 'dark');
      this.paymentElement = this.stripeService.createPaymentElement();
      if (this.paymentElement) {
        this.paymentElement.mount(this.cardElement.nativeElement);
        this.paymentElement.on('ready', () => {
          this.paymentElementReady = true;
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar Stripe:', error);
    }
  }

  async processPayment(): Promise<void> {
    if (this.checkoutForm.invalid || !this.paymentElement || this.loading) {
      this.markFormGroupTouched();
      return;
    }
    this.loading = true;
    try {
      // Confirmar pagamento usando Payment Element
      const result = await this.stripeService.confirmPayment();
      if (result.error) throw new Error(result.error.message);
      // Confirmar pagamento no backend
      await this.paymentService.confirmPayment(
        result.paymentIntent?.id || '',
        {
          userEmail: this.checkoutForm.get('email')?.value,
          userName: this.checkoutForm.get('fullName')?.value
        }
      ).toPromise();
      // Limpar carrinho e redirecionar
      this.cartService.clearCart();
      this.router.navigate(['/features/shopping/payment-success'], {
        queryParams: { paymentId: result.paymentIntent?.id }
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

  async applyTheme(theme: string) {
    const el = document.getElementById('checkout_container');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
    await this.stripeService.updateTheme(theme as 'light' | 'dark');
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
}
