import { Component, inject, OnInit } from '@angular/core';
import { Plan } from '../../../core/interface/plan.interface';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { Router } from '@angular/router';
import { CartService } from '../../../core/service/shopping/cart.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
  themeService = inject(ThemeService);
  router = inject(Router);
  cartService = inject(CartService);
  
  _themePlans: string = 'dark';
    
  plans: Plan[] = [
      {
        id: '1',
        name: 'Plano Básico',
        duration: 'monthly',  
        price: 29.90,
        currency: 'BRL',
        description: `Acesso total por 30 dias`,
        features:['Acesso a área gamer.', 'Acesso a área do quiz.', 'Acesso ao ranking de pontos.'],
        stripePriceId: 'price_basic_monthly',
        active: true
      },
      {
        id: '2',
        name: 'Plano Premium',
        duration: 'quarterly',
        price: 79.90,
        currency: 'BRL',
        description: `Economize com 3 meses de acesso.`,
        features:['Acesso a área gamer.', 'Acesso a área do quiz.', 'Acesso ao ranking de pontos.'],
        stripePriceId: 'price_basic_quarterly',
        active: true
      },
      {
        id: '3',
        name: 'Plano Gold',
        duration: 'semiannually',
        price: 169.90,
        currency: 'BRL',
        description: `Economize com 6 meses de acesso.`,
        features:['Acesso a área gamer.', 'Acesso a área do quiz.', 'Acesso ao ranking de pontos.', 'Recebimento das novidades via e-mail.', 'Acesso a dicas sobre o quiz.', 'Acesso a dicas dos games.', 'acesso ao ranking de pontos.'],
        stripePriceId: 'price_basic_semiannually',
        active: true
      },
      {
        id: '4',
        name: 'Plano Anual',
        duration: 'yearly',
        price: 329.90,
        currency: 'BRL',
        description: `Melhor custo-benefício por 1 ano!`,
        features:['Acesso a área gamer.', 'Acesso a área do quiz.', 'Acesso ao ranking de pontos.', 'Recebimento das novidades via e-mail.', 'Acesso a dicas sobre o quiz.', 'Acesso a dicas dos games.', 'Insignia Heroes conforme seu ranking disponivel.', 'Acesso Premium aos artigos, visualização de artigos antecipado.', 'acesso ao ranking de pontos.'],
        stripePriceId: 'price_basic_yearly',
        active: true
      },
  ];

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this._themePlans = theme;
    });
  }

  addToCart(plan: Plan): void {
    const token = sessionStorage.getItem('access_token');
    
    if (!token) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/shopping/plans' } 
      });
      return;
    }

    this.cartService.addToCart(plan);
    this.router.navigate(['/shopping/cart']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  getDurationText(duration: string): string {
    switch(duration) {
      case 'monthly': return 'mês';
      case 'quarterly': return '3 meses';
      case 'semiannually': return '6 meses';
      case 'yearly': return 'ano';
      default: return 'período';
    }
  }
}
