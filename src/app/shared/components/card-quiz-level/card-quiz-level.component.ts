import { Component, inject, Input, OnInit } from '@angular/core';
import { Quiz_Level } from '../../../core/interface/hero-level.interface';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { gsap } from 'gsap';
import { ThemeService } from '../../../core/service/theme/theme.service';

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
  router = inject(Router);
  themeService = inject(ThemeService);

  public _themeAll: string = 'dark';

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
      this.applyTheme(theme);
    });
  }

  startLevel(level_quiz: Quiz_Level) {
    this.router.navigate(
      [`/webmain/quiz/first-alert`, level_quiz],
      {
        state: {
          level: level_quiz
        }
      }
    );

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
