import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Quiz_Level } from '../../../core/interface/hero-level.interface';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { gsap } from 'gsap';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { PaymentService } from '../../../core/service/shopping/payment.service';

@Component({
  selector: 'app-card-quiz-level',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-quiz-level.component.html',
  styleUrl: './card-quiz-level.component.css'
})
export class CardQuizLevelComponent implements OnInit {
  @Input() level!: Quiz_Level;
  @Input() logo: string= '';
  @Output() premiumStatus = new EventEmitter<boolean>();
  
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly paymentService = inject(PaymentService);

  public _themeAll: string = 'dark';
  public hasPermission: boolean = false;

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
      this.applyTheme(theme);
    });

    this.paymentService.getPremiumStatus().subscribe({
      next: (response) => {
        this.hasPermission = response.hasPremium;
      },
      error: (error) => {
        console.error('Erro ao verificar status de assinatura:', error);
      }
    });
  }

  startLevel(level_quiz: Quiz_Level) {
    if(this.hasPermission === true){
      this.router.navigate(
        [`/webmain/quiz/first-alert`, level_quiz],
        {
          state: {
            level: level_quiz
          }
        }
      );
    }else {
      this.premiumStatus.emit(this.hasPermission); 
    }
  }

  unlockLevel(level: Quiz_Level) {
    if (!level.unlocked) {
      // Lógica para desbloquear (pode verificar XP do usuário)
      level.unlocked = true;
      gsap.from(`#hero-${level.id}`, {
        scale: 0.5,
        duration: 0.5,
        ease: 'back.out'
      });
    }
  }

  applyTheme(theme: string) {
    this._themeAll = theme;
  }
}
