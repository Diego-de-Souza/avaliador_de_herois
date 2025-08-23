import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-sucess',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './payment-sucess.component.html',
  styleUrl: './payment-sucess.component.css'
})
export class PaymentSucessComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  themeService = inject(ThemeService);

  paymentId: string | null = null;
  _themeSuccess: string = 'dark';

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.queryParams['paymentId'];
    
    this.themeService.theme$.subscribe(theme => {
      this._themeSuccess = theme;
      this.applyTheme(theme);
    });

    // Auto-redirect após 10 segundos
    setTimeout(() => {
      this.goToDashboard();
    }, 10000);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToPlans(): void {
    this.router.navigate(['/features/shopping/plans']);
  }

  applyTheme(theme: string) {
    const el = document.getElementById('success_container');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
