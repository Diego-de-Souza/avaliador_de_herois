import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post login', () => {
    const loginData = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { user: mockUser, session_token: 'token' };

    service.postLogin(loginData).subscribe(response => {
      expect(response.user).toEqual(mockUser);
      expect(response.session_token).toBe('token');
    });

    const req = httpMock.expectOne(`${environment.apiURL}/auth/signin`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.data).toEqual(loginData);
    req.flush(mockResponse);
  });

  it('should logout', () => {
    localStorage.setItem('session_token', 'test-token');
    const mockResponse = { success: true };

    service.logout().subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/auth/logout-session`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('X-Session-Token')).toBe(true);
    req.flush(mockResponse);
  });

  it('should check session', () => {
    const mockResponse = { user: mockUser };

    service.checkSession().subscribe(response => {
      expect(response.user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should validate Google login', () => {
    const idToken = 'google-id-token';
    const mockResponse = { user: mockUser };

    service.validateGoogleLogin(idToken).subscribe(response => {
      expect(response.user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/auth/google`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ idToken });
    req.flush(mockResponse);
  });
});
