import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../../interface/cart.interface';
import { Plan } from '../../interface/plan.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    total: 0,
    currency: 'BRL'
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(plan: Plan): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(item => item.planId === plan.id);

    if (existingItem) {
      console.warn('Plano já está no carrinho');
      return;
    }

    const newItem: CartItem = {
      planId: plan.id,
      plan: plan,
      quantity: 1,
      addedAt: new Date()
    };

    const updatedCart: Cart = {
      ...currentCart,
      items: [...currentCart.items, newItem]
    };

    this.updateCart(updatedCart);
  }

  removeFromCart(planId: string): void {
    const currentCart = this.cartSubject.value;
    const updatedCart: Cart = {
      ...currentCart,
      items: currentCart.items.filter(item => item.planId !== planId)
    };

    this.updateCart(updatedCart);
  }

  clearCart(): void {
    const clearedCart: Cart = {
      items: [],
      total: 0,
      currency: 'BRL'
    };

    this.updateCart(clearedCart);
  }

  getCartTotal(): number {
    const currentCart = this.cartSubject.value;
    return currentCart.items.reduce((total, item) => total + (item.plan.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cartSubject.value.items.length;
  }

  private updateCart(cart: Cart): void {
    cart.total = this.calculateTotal(cart);
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + (item.plan.price * item.quantity), 0);
  }

  private saveCartToStorage(cart: Cart): void {
    try {
      sessionStorage.setItem('shopping_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = sessionStorage.getItem('shopping_cart');
      if (savedCart) {
        const cart: Cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  }
}