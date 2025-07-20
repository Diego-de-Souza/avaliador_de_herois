import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Add this import
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NgClass } from '@angular/common';
import { CardQuizLevelComponent } from '../../../shared/components/card-quiz-level/card-quiz-level.component';
import { StudioQuiz } from '../../../data/studios-quiz';
import { Studio } from '../../../core/interface/studio.interface';
import { HeroLevel } from '../../../core/interface/hero-level.interface';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [HeaderComponent, CardQuizLevelComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  studios: Studio[] = StudioQuiz;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.initAnimations();
  }

  initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero cards animation
    gsap.from('.hero-card', {
      scrollTrigger: {
        trigger: '.hero-card',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2
    });

    // Background elements animation
    gsap.to('.particle', {
      duration: 20,
      rotation: 360,
      repeat: -1,
      ease: 'none'
    });
  }

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