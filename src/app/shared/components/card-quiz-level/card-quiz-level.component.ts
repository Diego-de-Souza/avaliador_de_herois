import { Component, inject, Input } from '@angular/core';
import { HeroLevel } from '../../../core/interface/hero-level.interface';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Difficulty } from '../../../core/enums/difficulty.enum'; // Importe o enum
import { gsap } from 'gsap';

@Component({
  selector: 'app-card-quiz-level',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-quiz-level.component.html',
  styleUrl: './card-quiz-level.component.css'
})
export class CardQuizLevelComponent {
  @Input() level!: HeroLevel;
  router = inject(Router);

  startLevel(levelId: number) {
    this.router.navigate(['/hero-quiz', levelId]);
  }

  unlockLevel(level: HeroLevel) {
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
}
