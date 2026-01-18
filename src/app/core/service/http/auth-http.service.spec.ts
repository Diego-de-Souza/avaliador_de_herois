import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthHttpService } from './auth-http.service';
import { environment } from '../../../../environments/environment';

describe('AuthHttpService', () => {
  let service: AuthHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthHttpService]
    });
    service = TestBed.inject(AuthHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user access', () => {
    const mockResponse = { success: true };

    service.registerAcessoUser().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/auth/register-acesso-user`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
