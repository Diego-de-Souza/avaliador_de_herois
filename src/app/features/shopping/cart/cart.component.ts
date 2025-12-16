import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Cart } from '../../../core/interface/cart.interface';
import { CartService } from '../../../core/service/shopping/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  cartService = inject(CartService);
  router = inject(Router);
  cart: Cart = { items: [], total: 0, currency: 'BRL' };
  private destroy$ = new Subject<void>();

  _themeCart: string = 'dark';

  ngOnInit(): void {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this._themeCart = theme;
      });

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeItem(planId: string): void {
    this.cartService.removeFromCart(planId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    if (this.cart.items.length === 0) {
      return;
    }

    this.router.navigate(['/shopping/modern-checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/shopping/plans']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getDurationText(duration: string): string {
    switch(duration) {
      case 'monthly': return 'mês';
      case 'quarterly': return '3 meses';
      case 'semiannually': return '6 meses';
      case 'yearly': return 'ano';
      default: return 'período';
    }
  }
}
