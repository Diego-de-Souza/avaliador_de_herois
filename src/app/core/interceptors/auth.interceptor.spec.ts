import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth/auth.service';
import { runInInjectionContext, Injector } from '@angular/core';

// Mock environment
const mockEnvironment = {
  apiURL: 'http://localhost:3020/api'
};

describe('authInterceptor', () => {
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let next: jest.Mocked<(req: HttpRequest<any>) => any>;
  let injector: Injector;

  beforeEach(() => {
    localStorage.clear();
    
    const authServiceMock = {
      forceLogout: jest.fn(),
      user$: of(null)
    };

    const routerMock = {
      navigate: jest.fn()
    };

    next = jest.fn().mockReturnValue(of({} as HttpEvent<any>));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    injector = TestBed.inject(Injector);
  });

  it('should add X-Session-Token header when session token exists', () => {
    localStorage.setItem('session_token', 'test-token');
    const request = new HttpRequest('GET', `${mockEnvironment.apiURL}/test`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe();

      expect(next).toHaveBeenCalled();
      const handledRequest = (next as jest.Mock).mock.calls[0][0];
      expect(handledRequest.headers.has('X-Session-Token')).toBe(true);
      expect(handledRequest.headers.get('X-Session-Token')).toBe('test-token');
    });
  });

  it('should not add X-Session-Token header when session token does not exist', () => {
    localStorage.clear();
    const request = new HttpRequest('GET', `${mockEnvironment.apiURL}/test`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe();

      expect(next).toHaveBeenCalled();
    });
  });

  it('should skip auth for external URLs', () => {
    const request = new HttpRequest('GET', 'https://viacep.com.br/api/test');
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe();

      expect(next).toHaveBeenCalled();
    });
  });

  it('should skip auth for Google APIs', () => {
    const request = new HttpRequest('GET', 'https://apis.google.com/test');
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe();

      expect(next).toHaveBeenCalled();
    });
  });

  it('should force logout on 401 error', () => {
    localStorage.setItem('session_token', 'test-token');
    const request = new HttpRequest('GET', `${mockEnvironment.apiURL}/test`);
    const errorResponse = { status: 401 } as any;
    
    (next as jest.Mock).mockReturnValue(
      throwError(() => errorResponse)
    );

    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe({
        error: () => {
          expect(authService.forceLogout).toHaveBeenCalled();
        }
      });
    });
  });

  it('should add withCredentials to requests', () => {
    const request = new HttpRequest('GET', `${mockEnvironment.apiURL}/test`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe();

      expect(next).toHaveBeenCalled();
      const handledRequest = (next as jest.Mock).mock.calls[0][0];
      expect(handledRequest.withCredentials).toBe(true);
    });
  });
});
