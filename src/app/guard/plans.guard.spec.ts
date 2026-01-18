import { TestBed } from '@angular/core/testing';
import { runInInjectionContext, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { plansGuard } from './plans.guard';
import { AuthService } from '../core/service/auth/auth.service';
import { ToastService } from '../core/service/toast/toast.service';

describe('plansGuard', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let toastService: jest.Mocked<ToastService>;
  let injector: Injector;

  const mockRoute = {} as any;
  const mockState = {
    url: '/test-route'
  } as any;

  beforeEach(() => {
    const authServiceMock = {
      getUser: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const toastServiceMock = {
      error: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    injector = TestBed.inject(Injector);

    // Mock window.alert
    window.alert = jest.fn();
  });

  it('should allow access when user is logged in', () => {
    authService.getUser.mockReturnValue({ id: 1, email: 'test@example.com' });

    runInInjectionContext(injector, () => {
      const result = plansGuard(mockRoute, mockState);

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(toastService.error).not.toHaveBeenCalled();
    });
  });

  it('should deny access and navigate to login when user is not logged in', () => {
    authService.getUser.mockReturnValue(null);

    runInInjectionContext(injector, () => {
      const result = plansGuard(mockRoute, mockState);

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(toastService.error).toHaveBeenCalled();
    });
  });

  it('should handle errors and navigate to login', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    authService.getUser.mockImplementation(() => {
      throw new Error('Token error');
    });

    runInInjectionContext(injector, () => {
      const result = plansGuard(mockRoute, mockState);

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(window.alert).toHaveBeenCalled();
    });
    consoleErrorSpy.mockRestore();
  });
});
