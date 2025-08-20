import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { QuizService } from '../../../../core/service/quiz/quiz.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-quiz',
  standalone: true,
  imports: [CommonModule, HeaderPlatformComponent, FormsModule],
  templateUrl: './view-quiz.component.html',
  styleUrl: './view-quiz.component.css'
})
export class ViewQuizComponent {
  public quizzes: any[] = [];
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  private modalService = inject(NgbModal);

  public title: string = '';
  public message: string = '';
  public _confirmEdit: boolean = false;
  public _confirmDelete: boolean = false;
  public _selectedItem: { id?: number; [key: string]: any } | null = null;
  public _messageQuiz: string = '';
  public _messageQuestion: string = '';
  public _questionExcluded: boolean = false;
  public _selectedQuestionNumber: number | null = null;
  public _delete_quiz_level_id = 0;
  public _delete_quiz_id = 0;

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizWithLevels().subscribe({
      next: (data) => {
        this.quizzes = data.data;
        this.title = 'Lista de Quiz';
        this.message = data.message;
        this.openModal(this.title, this.message);
      },
      error: (error) => {
        console.error("Erro ao carregar os Quizzes", error);
        this.title = 'Erro';
        this.message = 'Houve um erro ao tentar realizar o cadastro. Tente novamente.';
        this.openModal(this.title, this.message);
      }
    });
  }

  deleteQuiz(quiz: any, type: string): void {
    
    if (quiz !== null) {
      this._selectedItem = { ...quiz };
      this._delete_quiz_level_id = quiz.level_id
    }

    if (quiz !== null && type !== 'all' && type !== 'unit') {
      if (quiz.has_questions) {
        this._messageQuiz = 'Excluir Quiz';
        this._messageQuestion = 'Excluir Questões';
        this._confirmDelete = true;
      } else {
        if (confirm('Tem certeza que deseja excluir este Quiz?')) {
          this.quizService.deleteAllQuiz(quiz.quiz_id, quiz.level_id).subscribe({
            next: () => {
              this.loadQuizzes();
              this._questionExcluded = false;
              this._confirmDelete = false;
            },
            error: (error) => {
              console.error("Erro ao excluir o Quiz", error);
            }
          });
        }
      }
    } else if (quiz === null && (type === 'all' || type === 'unit')) {
      if (type === 'all') {
        if (typeof this._delete_quiz_level_id === 'number' && confirm('Tem certeza que deseja excluir todo o Quiz? Essa ação irá apagar o Quiz, os quiz level e as questões')) {
          this.quizService.deleteAllQuestions(this._delete_quiz_level_id).subscribe({
            next: () => {
              this.loadQuizzes();
              this._questionExcluded = false;
              this._confirmDelete = false;
            },
            error: (error) => {
              console.error("Erro ao excluir o Quiz", error);
            }
          });
        } else if (typeof this._delete_quiz_id !== 'number') {
          console.error("ID do quiz inválido para exclusão.");
        }
      } else if (type === 'unit') {
        if (this._selectedQuestionNumber !== null) {
          //exclui somente 1 questão
          if (confirm(`Tem certeza que deseja excluir a questão número ${this._selectedQuestionNumber}?`)) {
            this.quizService.deleteQuizQuestion(this._delete_quiz_level_id, this._selectedQuestionNumber).subscribe({
              next: () => {
                this._questionExcluded = false;
                this._confirmDelete = false;
                this.loadQuizzes();
              },
              error: (error) => {
                console.error("Erro ao excluir a questão", error);
              }
            });
          }
        } else {
          console.error("ID do quiz ou número da questão inválido.");
        }
      }
    }
  }

  editQuiz(quiz: any): void {
    if (quiz.has_questions) {
      this._messageQuiz = 'Editar Quiz';
      this._messageQuestion = 'Editar Questões';
      this._selectedItem = { ...quiz };
      this._confirmEdit = true;
    } else {
      console.log('sem opções');
      // this.router.navigate(['/plataforma/quiz/edit', quiz.id]);
    }
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent);
    modalRef.componentInstance.modalTitle = title;
    modalRef.componentInstance.modalMessage = message;
  }

  confirmEdit(selection: number) {
    if (selection === 1 && this._confirmEdit) {
      this._confirmEdit = false;
      this.router.navigate([
        '/plataforma/cadastro/quiz-cadastro',
        this._selectedItem?.['quiz_id'],
        this._selectedItem?.['level_id']
      ]);
    } else if (selection === 2 && this._confirmEdit) {
      this._confirmEdit = false;
      this.router.navigate([
        '/plataforma/cadastro/question-cadastro',
        this._selectedItem?.['level_id']
      ]);
    } else if (selection === 1 && this._confirmDelete) {
      if (confirm('Tem certeza que deseja excluir este Quiz?')) {
        this.quizService.deleteAllQuiz(this._selectedItem?.['quiz_id'], this._selectedItem?.['level_id']).subscribe({
          next: () => {
            this.loadQuizzes();
          },
          error: (error) => {
            console.error("Erro ao excluir o Quiz", error);
          }
        });
      }
    } else if (selection === 2 && this._confirmDelete) {
      if (confirm('Tem certeza que deseja excluir as questões?')) {
        this._questionExcluded = true;
      }
    }
  }

  cancel() {
    this._confirmEdit = false;
    this._confirmDelete = false;
    this._selectedItem = null;
    this._questionExcluded = false;
    this._selectedQuestionNumber = null;
  }

  setSelectedQuestionNumber(num: number) {
    this._selectedQuestionNumber = num;
  }

  getQuestionOptions(): number[] {
    const count = this._selectedItem?.['questions_count'] || 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}