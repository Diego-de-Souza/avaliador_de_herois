import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataUserComponent } from './data-user/data-user.component';
import { SecurityUserComponent } from './security-user/security-user.component';
import { HistoryPaymentUserComponent } from './history-payment-user/history-payment-user.component';
import { GamesConquestUserComponent } from './games-conquest-user/games-conquest-user.component';
import { QuizUserComponent } from './quiz-user/quiz-user.component';
import { ConnectionsUserComponent } from './connections-user/connections-user.component';
import { PrivacyUserComponent } from './privacy-user/privacy-user.component';
import { PreferencesUserComponent } from './preferences-user/preferences-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [ 
    CommonModule, 
    DataUserComponent, 
    SecurityUserComponent,
    HistoryPaymentUserComponent,
    GamesConquestUserComponent,
    QuizUserComponent,
    ConnectionsUserComponent, 
    PrivacyUserComponent,
    PreferencesUserComponent
  ],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.css'
})
export class UserConfigComponent{
  private router: Router = inject(Router);

  voltarPaginaAnterior() {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate(['/']); 
    }
  }
}