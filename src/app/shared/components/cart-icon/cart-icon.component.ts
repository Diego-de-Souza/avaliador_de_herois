import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/service/shopping/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.css'
})
export class CartIconComponent implements OnInit, OnDestroy{
  _themeAll = 'dark';
  private readonly themeService = inject(ThemeService);
  private readonly cartService = inject(CartService);

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  cartCount = 0;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
    });

    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartCount = cart.items.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async goToCart(): Promise<void> {
    try {
      const user = await this.authService.getUser();
      
      if (!user) {
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: '/shopping/cart' } 
        });
        return;
      }
      this.router.navigate(['/shopping/cart']);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/shopping/cart' } 
      });
    }
  }
}
