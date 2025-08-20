import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule, NgClass } from '@angular/common';
import { CardQuizLevelComponent } from '../../../shared/components/card-quiz-level/card-quiz-level.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { QuizService } from '../../../core/service/quiz/quiz.service';
import { Quiz } from '../../../core/interface/studio.interface';
import { FlashLoadingComponent } from '../../../shared/components/flash-loading/flash-loading.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [HeaderComponent, CardQuizLevelComponent, NgClass, FooterComponent, FlashLoadingComponent, CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit{
  quizData: Quiz[] | undefined;
  router = inject(Router);
  themeService = inject(ThemeService);
  private readonly quizService = inject(QuizService);
  themeAll = "dark";

  _isLoading = false;

  ngOnInit(): void {
    this.handlerQuizProgress();

    this.themeService.theme$.subscribe(theme => {
      this.themeAll = theme;
      this.applyTheme(theme);
    });
  }

  handlerQuizProgress() {
    this._isLoading = true;
    this.quizService.getProgressQuiz().subscribe({
      next: (data) => {
        this.quizData = data?.dataUnit?.quizzes ?? [];
        this._isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar os quizzes", error);
        this.quizData = []; 
        this._isLoading = false;
      }
    });
  }

  startLevel(levelId: number) {
    this.router.navigate(['/webmain/quiz/first-alert', levelId]);
  }

  applyTheme(theme: string) {
    this.themeAll = theme;
  }
}