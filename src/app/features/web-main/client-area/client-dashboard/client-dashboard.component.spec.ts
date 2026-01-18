import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientDashboardComponent } from './client-dashboard.component';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('ClientDashboardComponent', () => {
  let component: ClientDashboardComponent;
  let fixture: ComponentFixture<ClientDashboardComponent>;
  let router: Router;
  let themeService: jest.Mocked<ThemeService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const themeServiceMock = {
      theme$: new BehaviorSubject('dark')
    };

    const authServiceMock = {
      user$: new BehaviorSubject({ id: 1, email: 'test@example.com' })
    };

    await TestBed.configureTestingModule({
      imports: [ClientDashboardComponent, RouterTestingModule],
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    jest.spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dark theme', () => {
    component.ngOnInit();
    expect(component.theme).toBe('dark');
  });

  it('should navigate to articles page', () => {
    component.navigateTo('article');
    expect(router.navigate).toHaveBeenCalledWith(['/webmain/client-area/articles']);
  });

  it('should navigate to news page', () => {
    component.navigateTo('news');
    expect(router.navigate).toHaveBeenCalledWith(['/webmain/client-area/news']);
  });

  it('should navigate to FAQ page', () => {
    component.navigateTo('faq');
    expect(router.navigate).toHaveBeenCalledWith(['/webmain/client-area/faq']);
  });

  it('should navigate to SAC page', () => {
    component.navigateTo('sac');
    expect(router.navigate).toHaveBeenCalledWith(['/webmain/client-area/sac']);
  });
});
