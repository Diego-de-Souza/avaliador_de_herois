import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with dark theme when localStorage is empty', () => {
    expect(service.getTheme()).toBe('dark');
  });

  it('should initialize with theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    const newService = new ThemeService();
    expect(newService.getTheme()).toBe('light');
  });

  it('should set theme and save to localStorage', () => {
    service.setTheme('light');
    expect(service.getTheme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should emit theme changes through observable', (done) => {
    service.theme$.subscribe(theme => {
      if (theme === 'light') {
        expect(theme).toBe('light');
        done();
      }
    });
    service.setTheme('light');
  });

  it('should get current theme value', () => {
    service.setTheme('light');
    expect(service.getTheme()).toBe('light');
  });
});
