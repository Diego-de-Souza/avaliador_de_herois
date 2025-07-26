import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Add this import
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NgClass } from '@angular/common';
import { CardQuizLevelComponent } from '../../../shared/components/card-quiz-level/card-quiz-level.component';
import { StudioQuiz } from '../../../data/studios-quiz';
import { Studio } from '../../../core/interface/studio.interface';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [HeaderComponent, CardQuizLevelComponent, NgClass, FooterComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit{
  studios: Studio[] = StudioQuiz;
  router = inject(Router);
  themeService = inject(ThemeService);
  themeAll = "dark";

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeAll = theme;
      this.applyTheme(theme);
      console.log(theme)
    });
  }

  startLevel(levelId: number) {
    this.router.navigate(['/hero-quiz', levelId]);
  }

  applyTheme(theme: string) {
    this.themeAll = theme;
  }
}