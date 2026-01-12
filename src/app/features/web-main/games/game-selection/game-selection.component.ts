import { CommonModule } from '@angular/common';
import { Component, inject, input, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { PaymentService } from '../../../../core/service/shopping/payment.service';
import { GamesHttpService } from '../../../../core/service/http/game-http.service';
import { AuthService } from '../../../../core/service/auth/auth.service';

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './game-selection.component.html',
  styleUrl: './game-selection.component.css'
})
export class GameSelectionComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly gamesHttpService = inject(GamesHttpService);

  public hasSignature: boolean | undefined = false;
  public showModal = false;
  public modalMessage = 'Esta área é exclusiva para assinantes. Assine ou renove sua assinatura para acessar.';

  public _themeService = 'dark';
  public games: any[] = [];

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })
    
    this.paymentService.getPremiumStatus().subscribe({
      next: (response) => {
        this.hasSignature = response.hasPremium;
      },
      error: (error) => {
        console.error('Erro ao verificar status de assinatura:', error);
      }
    });

    this.getGames();
  }

  hasPermission(link: string): void {
    if (this.hasSignature) {
      this.router.navigate([link]);
      return;
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  goToPlans(): void {
    this.showModal = false;
    this.router.navigate(['/shopping/plans']);
  }

  getGames(): void {
    this.gamesHttpService.getAllGames().subscribe({
      next: (response) => {
        this.games = response.data;
      },
      error: (error) => {
        console.error('Erro ao buscar jogos:', error);
      }
    });
  }
}
