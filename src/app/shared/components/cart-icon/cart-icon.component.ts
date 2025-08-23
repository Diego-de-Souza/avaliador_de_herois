import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/service/shopping/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.css'
})
export class CartIconComponent implements OnInit, OnDestroy{
  _themeAll = 'dark';
  themeService = inject(ThemeService);
  cartService = inject(CartService);
  router = inject(Router);

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

  goToCart(): void {
    const token = sessionStorage.getItem('access_token');
    
    if (!token) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/features/shopping/cart' } 
      });
      return;
    }
    this.router.navigate(['/shopping/cart']);
  }
}
