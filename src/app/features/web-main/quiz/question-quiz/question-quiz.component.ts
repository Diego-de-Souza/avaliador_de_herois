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
export class QuestionQuizComponent implements OnInit, OnDestroy{
  private themeService= inject(ThemeService);
  private router = inject(Router);
  private quizService = inject(QuizService);

  _themeAll:string='dark';
  form: FormGroup;
  isSubmitting = false;
  // _questions!:any;
  _question!:any;
  _countdown: number = 120;
  _timer: any;
  _notResponse: Boolean = false;
  _index: number = 0;

  _questions = [
          {
            text: 'Quem é o líder dos Vingadores?',
            options: ['Capitão América', 'Homem de Ferro', 'Thor', 'Hulk']
          },
          {
            text: 'Qual o nome verdadeiro do Batman?',
            options: ['Clark Kent', 'Tony Stark', 'Bruce Wayne', 'Peter Parker']
          },
          {
            text: 'Qual herói tem um martelo mágico?',
            options: ['Thor', 'Superman', 'Flash', 'Capitão América']
          }
      ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selected: [null]
    });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
      this.applyTheme(theme);
    })

    // const navigation = this.router.getCurrentNavigation();
    // this._questions = navigation?.extras.state?.['quizData'];

    // if (!this._question) {
    //   console.warn('Nenhum dado de quiz encontrado!');
    //   this.router.navigate(['/webmain/quiz']);
    // }

    this.processQuestions(this._questions)

    this.startTimer();
    console.log('Dados recebidos do quiz:', this._question);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  applyTheme(theme: string){
    this._themeAll = theme
  }

  processQuestions(questions: any){
    const state = 'process'
    const data = this.quizService.processQuestion(questions)
    this._question = data.question;
    this._index = data.index;
    this.form.reset();
  }

  onSubmit() {
    console.log("entrou no onSubmit")
    console.log(this.form.value.selected, this.isSubmitting, this._notResponse)
    if ((!this.form.value.selected || this.isSubmitting) && !this._notResponse) return;

    this.isSubmitting = true;
    this.clearTimer();
    this._notResponse = false;
    console.log('passou aqui')

    this.quizService.reprocessQuestion().then((response)=> {
      this._question = response.question;
      this._index = response.index;
      this.isSubmitting = false;
      this.startTimer();

      if(response.nextLevel == true){
        this.router.navigate(['/webmain/quiz'])
      }
    })
    
    this.form.reset();
  }

  startTimer(): void {
    this._countdown = 120;
    this._timer = setInterval(() => {
      this._countdown--;
      console.log(this._countdown)
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
      console.log('Tempo esgotado. Submetendo automaticamente...');
      this.onSubmit(); 
    }
  }

  get formattedCountdown(): string {
    const minutes = Math.floor(this._countdown / 60);
    const seconds = this._countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
}
