import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { ToastService } from '../../../core/service/toast/toast.service';
import { BehaviorSubject } from 'rxjs';
import { render, screen, fireEvent } from '@testing-library/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeService: jest.Mocked<ThemeService>;
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  const mockUserSubject = new BehaviorSubject<any>(null);

  beforeEach(async () => {
    const themeServiceMock = {
      theme$: new BehaviorSubject('dark'),
      setTheme: jest.fn(),
      getTheme: jest.fn().mockReturnValue('dark')
    };

    const authServiceMock = {
      user$: mockUserSubject.asObservable(),
      isLoggedIn: jest.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dark theme', () => {
    component.ngOnInit();
    expect(component._themeAll).toBe('dark');
  });

  it('should update theme when theme service emits new theme', () => {
    component.ngOnInit();
    (themeService.theme$ as BehaviorSubject<string>).next('light');
    expect(component._themeAll).toBe('light');
  });

  it('should update isLoggedIn when user logs in', () => {
    component.ngOnInit();
    mockUserSubject.next({ id: 1, email: 'test@example.com' });
    expect(component.isLoggedIn).toBe(true);
  });

  it('should toggle theme when changeTheme is called', () => {
    component._themeAll = 'dark';
    component.changeTheme();
    expect(themeService.setTheme).toHaveBeenCalledWith('light');
  });

  it('should toggle theme from light to dark', () => {
    component._themeAll = 'light';
    component.changeTheme();
    expect(themeService.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should check screen size on init', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    });
    component.checkScreenSize();
    expect(component.isMobile).toBe(true);
  });

  it('should detect desktop screen size', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200
    });
    component.checkScreenSize();
    expect(component.isMobile).toBe(false);
  });

  it('should toggle menu on mobile', () => {
    component.isMobile = true;
    component.isMenuOpen = false;
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
  });

  it('should close menu when closeMenu is called', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBe(false);
  });
});
