import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './core/service/auth/auth.service';
import { ToastService } from './core/service/toast/toast.service';
import { NotificationModalService } from './core/service/modal/notification-modal.service';
import { BehaviorSubject, of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let authService: jest.Mocked<AuthService>;
  let toastService: jest.Mocked<ToastService>;
  let modalService: jest.Mocked<NotificationModalService>;

  beforeEach(async () => {
    const authServiceMock = {
      checkSession: jest.fn().mockResolvedValue(true),
      user$: of(null)
    };

    const toastServiceMock = {
      toasts$: of([])
    };

    const modalServiceMock = {
      isOpen: jest.fn().mockReturnValue(false),
      notifications: jest.fn().mockReturnValue([]),
      selectedNotificationId: jest.fn().mockReturnValue(null),
      theme: jest.fn().mockReturnValue('dark'),
      close: jest.fn(),
      selectNotification: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: NotificationModalService, useValue: modalServiceMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    modalService = TestBed.inject(NotificationModalService) as jest.Mocked<NotificationModalService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should check session on init', async () => {
    await component.ngOnInit();
    expect(authService.checkSession).toHaveBeenCalled();
  });
});
