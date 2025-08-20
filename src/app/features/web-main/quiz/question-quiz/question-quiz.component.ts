import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../../../core/service/quiz/quiz.service';

@Component({
  selector: 'app-question-quiz',
  standalone: true,
  imports: [NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './question-quiz.component.html',
  styleUrl: './question-quiz.component.css'
})
export class QuestionQuizComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private quizService = inject(QuizService);

  _themeAll: string = 'dark';
  form: FormGroup;
  isSubmitting = false;
  _question!: any;
  _countdown: number = 120;
  _timer: any;
  _notResponse: Boolean = false;
  _index: number = 0;

  _questions: any = [];
  userAnswers: any[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selected: [null]
    });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
      this.applyTheme(theme);
    });

    // Resetar estado do serviço ao iniciar o quiz
    this.quizService._currentQuestionIndex = 0;
    this.quizService._nextLevel = false;

    const navigation = this.router.getCurrentNavigation();
    this._questions = navigation?.extras.state?.['quizData'] || window.history.state.quizData;

    if (!this._questions) {
      console.warn('Nenhum dado de quiz encontrado!');
      this.router.navigate(['/webmain/quiz']);
      return;
    }

    this.processQuestions(this._questions);

    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  applyTheme(theme: string) {
    this._themeAll = theme;
  }

  processQuestions(questions: any) {
    const data = this.quizService.processQuestion(questions);
    this._question = data.question;
    this._index = data.index;
    this.form.reset();
  }

  onSubmit() {
    if ((!this.form.value.selected || this.isSubmitting) && !this._notResponse) return;

    this.isSubmitting = true;
    this.clearTimer();
    this._notResponse = false;

    // Salva a resposta do usuário
    this.userAnswers.push({
      questionId: this._question.id,
      selected: this.form.value.selected
    });

    this.quizService.reprocessQuestion().then((response) => {
      this._question = response.question;
      this._index = response.index;
      this.isSubmitting = false;
      this.startTimer();

      if (response.nextLevel == true) {
        const data = {
          quiz_level_id: this._questions[0].quiz_level_id,
          answers: this.userAnswers
        };
        this.quizService.sendAnswer(data).subscribe(
          (res) => {
            this.router.navigateByUrl('/webmain/quiz', { skipLocationChange: false }).then(() => {
              window.location.href = '/webmain/quiz';
            });
          },
          (error) => {
            console.error('Erro ao enviar resposta:', error);
          }
        );
        
      }
    });

    this.form.reset();
  }

  startTimer(): void {
    this._countdown = 120;
    this._timer = setInterval(() => {
      this._countdown--;
      if (this._countdown <= 0) {
        this.clearTimer();
        this.autoSubmit();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._countdown = 120;
    }
  }

  autoSubmit(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this._notResponse = true;
      this.onSubmit();
    }
  }

  get formattedCountdown(): string {
    const minutes = Math.floor(this._countdown / 60);
    const seconds = this._countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
}