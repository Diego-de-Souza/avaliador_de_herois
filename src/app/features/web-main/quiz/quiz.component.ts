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
  public quizData: Quiz[] | undefined;
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly quizService = inject(QuizService);
  public themeAll: string = "dark";

  public _isLoading: boolean = false;
  public hasSignature: boolean | undefined = false;
  public showModal = false;
  public modalMessage = 'Esta área é exclusiva para assinantes. Assine ou renove sua assinatura para acessar.';

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

  closeModal(): void {
    this.showModal = false;
  }

  goToPlans(): void {
    this.showModal = false;
    this.router.navigate(['/shopping/plans']);
  }

  onPremiumStatus(isPremium: boolean) {
    if (isPremium === false) {
      this.showModal = true; // ou sua lógica para abrir a modal
    }
  }
}