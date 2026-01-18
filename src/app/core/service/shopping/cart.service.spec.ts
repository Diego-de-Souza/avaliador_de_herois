import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add plan to cart', () => {
    const plan = { 
      id: '1', 
      name: 'Premium Plan', 
      price: 29.99,
      features: [],
      duration: 'monthly'
    } as any;
    
    service.addToCart(plan);
    
    service.cart$.subscribe(cart => {
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].planId).toBe('1');
      expect(cart.items[0].plan).toEqual(plan);
    });
  });

  it('should remove plan from cart', () => {
    const plan = { 
      id: '1', 
      name: 'Premium Plan', 
      price: 29.99 
    } as any;
    
    service.addToCart(plan);
    service.removeFromCart('1');
    
    service.cart$.subscribe(cart => {
      expect(cart.items.length).toBe(0);
      expect(cart.total).toBe(0);
    });
  });

  it('should clear cart', () => {
    const plan = { 
      id: '1', 
      name: 'Premium Plan', 
      price: 29.99 
    } as any;
    
    service.addToCart(plan);
    service.clearCart();
    
    service.cart$.subscribe(cart => {
      expect(cart.items.length).toBe(0);
      expect(cart.total).toBe(0);
    });
  });

  it('should not add duplicate plan', () => {
    const plan = { 
      id: '1', 
      name: 'Premium Plan', 
      price: 29.99 
    } as any;
    
    const consoleSpy = jest.spyOn(console, 'warn');
    service.addToCart(plan);
    service.addToCart(plan);
    
    service.cart$.subscribe(cart => {
      expect(cart.items.length).toBe(1);
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should calculate total correctly', () => {
    const plan1 = { id: '1', name: 'Plan 1', price: 10, features: [], duration: 'monthly' } as any;
    const plan2 = { id: '2', name: 'Plan 2', price: 5, features: [], duration: 'monthly' } as any;
    
    service.addToCart(plan1);
    service.addToCart(plan2);
    
    expect(service.getCartTotal()).toBe(15);
    expect(service.getCartCount()).toBe(2);
  });

  it('should load cart from sessionStorage', () => {
    const savedCart = {
      items: [{
        planId: '1',
        plan: { id: '1', name: 'Plan', price: 10, features: [], duration: 'monthly' },
        quantity: 1,
        addedAt: new Date().toISOString()
      }],
      total: 10,
      currency: 'BRL'
    };
    sessionStorage.setItem('shopping_cart', JSON.stringify(savedCart));
    
    const newService = new CartService();
    newService.cart$.subscribe(cart => {
      expect(cart.items.length).toBe(1);
      expect(cart.total).toBe(10);
    });
  });
});
