import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';

// Services
import { CartService } from '../../../core/service/shopping/cart.service';
import { StripeService } from '../../../core/service/shopping/stripe.service';
import { PaymentService, CreatePaymentIntentRequest } from '../../../core/service/shopping/payment.service';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { ToastService } from '../../../core/service/toast/toast.service';

// Components
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

// Interfaces
import { Cart } from '../../../core/interface/cart.interface';
import { StripePaymentElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-modern-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HeaderComponent, 
    FooterComponent
  ],
  templateUrl: './modern-checkout.component.html',
  styleUrls: ['./modern-checkout.component.css']
})
export class ModernCheckoutComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('paymentElement', { static: false }) paymentElementRef!: ElementRef;
  private paymentElementMounted = false;
  ngAfterViewInit(): void {
    console.log('[Stripe Debug] ngAfterViewInit chamado', {
      paymentElement: this.paymentElement,
      paymentElementRef: this.paymentElementRef?.nativeElement
    });
    // Apenas log para debug, montagem garantida no ngAfterViewChecked
  }

  ngAfterViewChecked(): void {
    if (this.paymentElement && this.paymentElementRef?.nativeElement && !this.paymentElementMounted) {
      try {
        this.paymentElement.mount(this.paymentElementRef.nativeElement);
        this.paymentElementMounted = true;
        console.debug('[Stripe Debug] mount chamado via ngAfterViewChecked');
      } catch (e) {
        console.error('[Stripe Debug] Erro ao montar Payment Element em ngAfterViewChecked:', e);
      }
    }
  }
  @ViewChild('addressElement', { static: false }) addressElementRef?: ElementRef;

  // Services
  private cartService = inject(CartService);
  private stripeService = inject(StripeService);
  private paymentService = inject(PaymentService);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Form
  checkoutForm: FormGroup;

  // State
  cart: Cart = { items: [], total: 0, currency: 'BRL' };
  currentUser: any = null;
  currentTheme: 'light' | 'dark' = 'light';
  
  // Stripe Elements
  paymentElement: StripePaymentElement | null = null;
  addressElement: any = null;

  // Loading States
  isInitializing = true;
  isProcessingPayment = false;
  elementsReady = false;

  // Error handling
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor() {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      savePaymentMethod: [false],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  async ngOnInit(): Promise<void> {
    this.initializeSubscriptions();
    await this.initializeCheckout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stripeService.cleanup();
  }

  /**
   * Inicializa subscriptions
   */
  private initializeSubscriptions(): void {
    // Combinar dados necessários
    combineLatest([
      this.cartService.cart$,
      this.themeService.theme$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([cart, theme]) => {
      this.cart = cart;
      this.currentTheme = theme === 'dark' ? 'dark' : 'light';

      // Redirecionar se carrinho vazio
      if (cart.items.length === 0) {
        this.router.navigate(['/shopping/plans']);
      }
    });

    // Carregar dados do usuário separadamente
    this.loadUserData();
  }

  /**
   * Carrega dados do usuário
   */
  private async loadUserData(): Promise<void> {
    try {
      this.currentUser = await this.authService.getUser();
      
      // Pré-preencher dados do usuário logado
      if (this.currentUser && !this.checkoutForm.get('email')?.value) {
        this.checkoutForm.patchValue({
          email: this.currentUser.email || '',
          fullName: this.currentUser.nickname || this.currentUser.name || ''
        });
      }
    } catch (error) {
      console.log('Usuário não logado ou erro ao carregar dados');
    }
  }

  /**
   * Inicializa processo de checkout
   */
  private async initializeCheckout(): Promise<void> {
    try {
      this.isInitializing = true;
      this.error = null;

      // 1. Inicializar Stripe
      await this.stripeService.initializeStripe(this.currentTheme);

      // 2. Criar Payment Intent
      const paymentIntentData = await this.createPaymentIntent();
      console.debug('[Stripe Debug] paymentIntentData:', paymentIntentData);
      // 3. Criar Elements
      if (paymentIntentData?.clientSecret) {
        console.debug('[Stripe Debug] clientSecret:', paymentIntentData.clientSecret);
        await this.stripeService.createElements(paymentIntentData.clientSecret, this.currentTheme);
      } else {
        throw new Error('Client secret não recebido');
      }
      // 4. Criar e montar Payment Element
      await this.createAndMountElements();
      this.isInitializing = false;
      console.log('✅ Checkout inicializado com sucesso');

    } catch (error: any) {
      this.isInitializing = false;
      this.error = error.message || 'Erro ao inicializar checkout';
      console.error('❌ Erro na inicialização:', error);
    }
  }

  /**
   * Cria Payment Intent
   */
  private async createPaymentIntent() {
    const request: CreatePaymentIntentRequest = {
      planType: 'mensal', // ou obtenha do carrinho/plano selecionado
      amount: this.cart.total
    };
    return this.paymentService.createPaymentIntent(request).toPromise();
  }

  /**
   * Cria e monta elementos Stripe
   */
  private async createAndMountElements(): Promise<void> {
    // Criar Payment Element
    this.paymentElement = this.stripeService.createPaymentElement();
    console.debug('[Stripe Debug] paymentElement:', this.paymentElement);
    console.debug('[Stripe Debug] paymentElementRef:', this.paymentElementRef?.nativeElement);
    if (!this.paymentElement) {
      console.error('[Stripe Debug] Payment Element não foi criado! Verifique se o clientSecret é válido e se o Stripe Elements foi inicializado.');
      return;
    }
    // Only mount if nativeElement is available, else wait for ngAfterViewInit
    if (this.paymentElementRef?.nativeElement) {
      try {
        this.paymentElement.mount(this.paymentElementRef.nativeElement);
        this.paymentElementMounted = true;
        console.debug('[Stripe Debug] mount chamado com sucesso');
      } catch (e) {
        console.error('[Stripe Debug] Erro ao montar Payment Element:', e);
      }
    } else {
      console.warn('[Stripe Debug] paymentElementRef.nativeElement não está disponível, aguardando ngAfterViewInit');
    }
    // Listeners
    this.paymentElement.on('ready', () => {
      this.elementsReady = true;
    });
    this.paymentElement.on('change', (event: any) => {
      if (event.error) {
        this.error = event.error.message;
      } else {
        this.error = null;
      }
    });

    // Criar Address Element (opcional)
    if (this.addressElementRef?.nativeElement) {
      this.addressElement = this.stripeService.createAddressElement();
      if (this.addressElement) {
        this.addressElement.mount(this.addressElementRef.nativeElement);
      }
    }
  }

  /**
   * Processa o pagamento
   */
  async processPayment(): Promise<void> {
    if (!this.validateForm()) return;

    this.isProcessingPayment = true;
    this.error = null;

    try {
      const formData = this.checkoutForm.value;

      const confirmParams = {
        payment_method_data: {
          billing_details: {
            name: formData.fullName,
            email: formData.email,
          }
        }
      };

      // Confirmar pagamento com Stripe
      const result = await this.stripeService.confirmPayment({
        confirmParams,
        // Stripe exige URL absoluta para return_url
        return_url: `${window.location.origin}/shopping/payment-success`
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent?.status === 'succeeded') {
        // Exibir toast de sucesso
        this.toastService.paymentSuccess(this.cart.total, result.paymentIntent.id);

        // Limpar carrinho
        this.cartService.clearCart();

        // Abrir modal do comprovante e redirecionar após fechar
        const dialogRef = this.toastService['dialog'].open(
          (window as any).ComprovanteComponent || (await import('../../../shared/components/comprovante/comprovante.component')).ComprovanteComponent,
          {
            data: { paymentId: result.paymentIntent.id },
            width: '500px',
            maxWidth: '95vw',
            disableClose: false
          }
        );
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['shopping/payment-success'], {
            queryParams: {
              payment_intent: result.paymentIntent?.id,
              status: 'success'
            }
          });
        });
        return;
      }

      // Se não for succeeded, exibe info e não redireciona
      this.toastService.info('Pagamento em processamento. Aguarde a confirmação.');

    } catch (error: any) {
      this.error = error.message || 'Erro ao processar pagamento';
      this.toastService.paymentError(error.message);
      console.error('❌ Erro no pagamento:', error);
    } finally {
      this.isProcessingPayment = false;
    }
  }

  /**
   * Valida formulário
   */
  private validateForm(): boolean {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched();
      return false;
    }

    if (!this.elementsReady) {
      this.error = 'Aguarde o carregamento dos métodos de pagamento';
      return false;
    }

    return true;
  }

  /**
   * Marca todos os campos como touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Retorna ao carrinho
   */
  goBackToCart(): void {
    this.router.navigate(['/shopping/cart']);
  }

  /**
   * Formata preço
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  /**
   * Obtém mensagem de erro do campo
   */
  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return 'Mínimo de 3 caracteres';
    }
    
    return '';
  }
}