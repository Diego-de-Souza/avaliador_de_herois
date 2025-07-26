import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { NgClass } from '@angular/common';
import { QuizService } from '../../../../core/service/quiz/quiz.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  _difficulty!: string;
  _levelData: any;
  _themeAll: string = "dark";
  _title!:string;
  _message!: string;

  totalQuestions = 10; 
  timePerQuestion = 30;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this._difficulty = params.get('difficulty') || 'basic';
      console.log('Nível de dificuldade recebido:', this._difficulty);
    });

    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
      this.applyTheme(theme);
    });

    this._levelData = history.state['level'];
    console.log('Dados recebidos via state:', this._levelData);


    console.log('Dados recebidos via state:', this._levelData);
  }

  startQuiz() {
    // this.quizService.getQuestion('teste').subscribe(
    //   (response) =>{
    //     this.router.navigate(['/webmain/quiz/question'],{
    //     state: { quizData: response } 
    //   });
    //     console.log('Quiz iniciado!');
    //   }, (error)=>{
    //     this._title = 'Cadastro de Usuario';
    //     this._message = 'Hove uma falha no cadastro dos dados do Usuario.';
    //     this.openModal(this._title, this._message);
    //   }
    // )
    this.router.navigate(['/webmain/quiz/question'],{
        // state: { quizData: response } 
      });
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
