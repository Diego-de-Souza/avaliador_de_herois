import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { NgClass } from '@angular/common';
import { QuizService } from '../../../../core/service/quiz/quiz.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Quiz_Level } from '../../../../core/interface/hero-level.interface';

@Component({
  selector: 'app-first-alert-quiz',
  standalone: true,
  imports: [NgClass],
  templateUrl: './first-alert-quiz.component.html',
  styleUrl: './first-alert-quiz.component.css'
})
export class FirstAlertQuizComponent implements OnInit{
  private router = inject(Router)
  private route = inject(ActivatedRoute);
  private themeService = inject(ThemeService);
  private quizService = inject(QuizService);
  private modalService = inject(NgbModal)

  public _level_quiz!: Quiz_Level;
  public _levelData: any;
  public _themeAll: string = "dark";
  public _title!:string;
  public _message!: string;

  timePerQuestion: number = 30;

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
      this.applyTheme(theme);
    });

    this._level_quiz = history.state['level'];
  }

  startQuiz() {
    this.quizService.getQuestion(this._level_quiz).subscribe(
      (response) =>{
        this.router.navigate(['/webmain/quiz/question'], {
          state: { quizData: response.data }
        });
      }, (error)=>{
        this._title = 'Questões';
        this._message = 'Houve uma falha na busca das questões';
        this.openModal(this._title, this._message);
      }
    )
    
  }

  applyTheme(theme: string) {
    this._themeAll = theme;
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
    modalRef.componentInstance.modalTitle = title; 
    modalRef.componentInstance.modalMessage = message; 
  }

}
