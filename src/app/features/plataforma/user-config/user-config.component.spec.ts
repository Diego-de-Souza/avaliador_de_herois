import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../core/service/auth/auth.service';
import { UserService } from '../../../core/service/user/user.service';
import { of } from 'rxjs';

import { UserConfigComponent } from './user-config.component';

describe('UserConfigComponent', () => {
  let component: UserConfigComponent;
  let fixture: ComponentFixture<UserConfigComponent>;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const authServiceMock = {
      getUser: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' })
    };

    const userServiceMock = {
      getFindOneUser: jest.fn().mockReturnValue(of({ dataUnit: { fullname: 'Test User', nickname: 'testuser' } }))
    };

    await TestBed.configureTestingModule({
      imports: [UserConfigComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserConfigComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    userService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
