import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, HeaderComponent, FooterComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  theme = 'dark';
  isLoggedIn = false;

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => {
      this.theme = t;
    });

    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }

  navigateTo(type: 'article' | 'news' | 'faq' | 'sac'): void {
    switch(type) {
      case 'article':
        this.router.navigate(['/webmain/client-area/articles']);
        break;
      case 'news':
        this.router.navigate(['/webmain/client-area/news']);
        break;
      case 'faq':
        this.router.navigate(['/webmain/client-area/faq']);
        break;
      case 'sac':
        this.router.navigate(['/webmain/client-area/sac']);
        break;
    }
  }
}
