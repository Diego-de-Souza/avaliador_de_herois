import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let router: Router;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user'
  };

  const mockLoginResponse = {
    user: mockUser,
    session_token: 'mock-session-token',
    has_totp: false
  };

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    const userServiceMock = {
      postLogin: jest.fn(),
      logout: jest.fn(),
      logoutAllSessions: jest.fn(),
      checkSession: jest.fn(),
      validateGoogleLogin: jest.fn(),
      changePassword: jest.fn(),
      enable2FA: jest.fn(),
      disable2FA: jest.fn(),
      validate2FA: jest.fn(),
      generateCodeMFA: jest.fn(),
      validateCodeMFA: jest.fn(),
      getUserSettings: jest.fn(),
      codeSent: jest.fn(),
      logoutSession: jest.fn(),
      getActiveSessions: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserFromStorage', () => {
    it('should return null when localStorage is empty', () => {
      localStorage.clear();
      const user = service['getUserFromStorage']();
      expect(user).toBeNull();
    });

    it('should return user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      const user = service['getUserFromStorage']();
      expect(user).toEqual(mockUser);
    });

    it('should return null when localStorage has invalid JSON', () => {
      localStorage.setItem('user', 'invalid-json');
      const consoleSpy = jest.spyOn(console, 'log');
      const user = service['getUserFromStorage']();
      expect(user).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully and store user data', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      userService.postLogin.mockReturnValue(of(mockLoginResponse));

      const result = await service.login(loginData);

      expect(result.status).toBe(true);
      expect(result.has_totp).toBe(false);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      expect(localStorage.getItem('session_token')).toBe('mock-session-token');
      expect(userService.postLogin).toHaveBeenCalledWith(loginData);
    });

    it('should throw error when login fails', async () => {
      const loginData = { email: 'test@example.com', password: 'wrongpassword' };
      userService.postLogin.mockReturnValue(throwError(() => new Error('Invalid credentials')));

      await expect(service.login(loginData)).rejects.toThrow('Erro ao realizar login. Tente novamente.');
    });

    it('should handle login with 2FA', async () => {
      const loginDataWith2FA = { ...mockLoginResponse, has_totp: true };
      userService.postLogin.mockReturnValue(of(loginDataWith2FA));

      const result = await service.login({ email: 'test@example.com', password: 'password123' });

      expect(result.has_totp).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout successfully and clear user data', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('session_token', 'token');
      const navigateSpy = jest.spyOn(router, 'navigate');
      userService.logout.mockReturnValue(of({}));

      await service.logout();

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('session_token')).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(userService.logout).toHaveBeenCalled();
    });
  });

  describe('logoutAllSessions', () => {
    it('should logout from all sessions', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      const navigateSpy = jest.spyOn(router, 'navigate');
      userService.logoutAllSessions.mockReturnValue(of({ success: true }));

      const result = await service.logoutAllSessions();

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('session_token')).toBeNull();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(result.success).toBe(true);
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no user is logged in', () => {
      localStorage.clear();
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true when user is logged in', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Force update userSubject with the user from storage
      (service as any).userSubject.next(mockUser);
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getUser()).toBeNull();
    });

    it('should return user when logged in', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Force update userSubject with the user from storage
      (service as any).userSubject.next(mockUser);
      expect(service.getUser()).toEqual(mockUser);
    });
  });

  describe('getUserId', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getUserId()).toBeNull();
    });

    it('should return user id when logged in', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Force update userSubject with the user from storage
      (service as any).userSubject.next(mockUser);
      expect(service.getUserId()).toBe(1);
    });
  });

  describe('getUserRole', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getUserRole()).toBeNull();
    });

    it('should return user role when logged in', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Force update userSubject with the user from storage
      (service as any).userSubject.next(mockUser);
      expect(service.getUserRole()).toBe('user');
    });
  });

  describe('checkSession', () => {
    it('should return true and set user when session is valid', async () => {
      userService.checkSession.mockReturnValue(of({ user: mockUser }));

      const result = await service.checkSession();

      expect(result).toBe(true);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('should return false and clear user when session is invalid', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      userService.checkSession.mockReturnValue(throwError(() => new Error('Invalid session')));

      const result = await service.checkSession();

      expect(result).toBe(false);
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('validateGoogleLogin', () => {
    it('should validate Google login successfully', async () => {
      userService.validateGoogleLogin.mockReturnValue(of({ user: mockUser }));

      const result = await service.validateGoogleLogin('google-id-token');

      expect(result.user).toEqual(mockUser);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      expect(userService.validateGoogleLogin).toHaveBeenCalledWith('google-id-token');
    });

    it('should throw error when Google login validation fails', async () => {
      userService.validateGoogleLogin.mockReturnValue(throwError(() => new Error('Invalid token')));

      await expect(service.validateGoogleLogin('invalid-token')).rejects.toThrow();
    });
  });

  describe('forceLogout', () => {
    it('should clear user data without API call', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      service = TestBed.inject(AuthService);

      service.forceLogout();

      expect(localStorage.getItem('user')).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
