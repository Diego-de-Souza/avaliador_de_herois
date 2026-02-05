import { expect, jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth/auth.service';
import { runInInjectionContext, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';

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

  it('should add X-Session-Token header when session token exists', (done) => {
    localStorage.setItem('session_token', 'test-token');
    const request = new HttpRequest('GET', `${environment.apiURL}/test`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(() => {
        expect(next).toHaveBeenCalled();
        const handledRequest = (next as jest.Mock).mock.calls[0][0] as HttpRequest<unknown>;
        expect(handledRequest.headers.has('X-Session-Token')).toBe(true);
        expect(handledRequest.headers.get('X-Session-Token')).toBe('test-token');
        done();
      });
    });
  });

  it('should not add X-Session-Token header when session token does not exist', (done) => {
    localStorage.clear();
    const request = new HttpRequest('GET', `${environment.apiURL}/test`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(() => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should skip auth for external URLs', (done) => {
    const request = new HttpRequest('GET', 'https://viacep.com.br/api/test');
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(() => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should skip auth for Google APIs', (done) => {
    const request = new HttpRequest('GET', 'https://apis.google.com/test');
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(() => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should force logout on 401 error', (done) => {
    localStorage.setItem('session_token', 'test-token');
    const request = new HttpRequest('GET', `${environment.apiURL}/test`);
    const errorResponse = { status: 401 } as any;
    
    (next as jest.Mock).mockReturnValue(
      throwError(() => errorResponse)
    );

    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe({
        error: () => {
          expect(authService.forceLogout).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should add withCredentials to requests', (done) => {
    const request = new HttpRequest('GET', `${environment.apiURL}/test`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(() => {
        expect(next).toHaveBeenCalled();
        const handledRequest = (next as jest.Mock).mock.calls[0][0] as HttpRequest<unknown>;
        expect(handledRequest.withCredentials).toBe(true);
        done();
      });
    });
  });

  it('should insert /api after domain when not present', (done) => {
    const baseUrl = environment.apiURL || 'http://localhost:3020';
    const request = new HttpRequest('GET', `${baseUrl}/auth/signin`);
    
    runInInjectionContext(injector, () => {
      authInterceptor(request, next).subscribe(() => {
        const handledRequest = (next as jest.Mock).mock.calls[0][0] as HttpRequest<unknown>;
        const expectedUrl = baseUrl.includes('/api') ? `${baseUrl}/auth/signin` : `${baseUrl}/api/auth/signin`;
        expect(handledRequest.url).toBe(expectedUrl);
        done();
      });
    });
  });
});
