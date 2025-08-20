import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../../../shared/components/header-platform/header-platform.component';
import { QuizService } from '../../../../../core/service/quiz/quiz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSucessoCadastroComponent } from '../../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderPlatformComponent],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit{
  private fb = inject(FormBuilder);
  private readonly quizService = inject(QuizService);
  private modalService = inject(NgbModal);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  quizzes: any[] = [];
  levels: any[] = [];
  selectedQuizId: string = '';
  selectedLevelId: number = 0;
  questionsForm: FormArray = this.fb.array([]);
  showQuestionsModal = false;
  questionsCount = 0;
  currentQuestionIndex = 0;
  public title:string = '';
  public message: string = '';
  _editQuestion: string | null = null;


  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => { 
      const quiz_level_id = params.get('quiz_level_id');
      if (quiz_level_id) {
        this._editQuestion = quiz_level_id;
        this.loadQuestionsForEdit(Number(this._editQuestion)); 
      } else {
        this.fetchAllQuiz();
      }
    });
  }
  
  fetchAllQuiz() {
    this.quizService.getAllQuiz().subscribe({
      next: (response) => {
        this.quizzes = response.data;
      },
      error: (error) => {
        console.error('Erro ao buscar quizzes:', error);
        this.title = 'Erro';
        this.message = 'Houve um erro ao tentar buscar os quizzes. Tente novamente.';
        this.openModal(this.title, this.message);
      }
    });
  }

  loadQuestionsForEdit(id_question: number) {
    if (!id_question) return;

    this.quizService.getQuestionsByQuizLevel(id_question).subscribe({
      next: (response) => {
        // Supondo que response.data seja um array de questões
        this.questionsCount = response.data.length;
        this.questionsForm.clear();
        response.data.forEach((q: any) => {
          this.questionsForm.push(this.fb.group({
            id: [q.id],
            question: [q.question, Validators.required],
            option0: [q.options[0], Validators.required],
            option1: [q.options[1], Validators.required],
            option2: [q.options[2], Validators.required],
            option3: [q.options[3], Validators.required],
            option4: [q.options[4], Validators.required],
            answer: [q.answer, Validators.required]
          }));
        });
        this.currentQuestionIndex = 0;
        this.showQuestionsModal = true;
      },
      error: (error) => {
        this.title = 'Erro';
        this.message = 'Não foi possível carregar as questões.';
        this.openModal(this.title, this.message);
      }
    });
  }

  onQuizSelect() {

    this.quizService.getAllQuizLevelById(this.selectedQuizId).subscribe({
      next: (response) => {
        this.levels = response.data;
        this.selectedLevelId = 0;
      },
      error: (error) => {
        console.error('Erro ao buscar níveis do quiz:', error);
        this.title = 'Erro';
        this.message = 'Houve um erro ao tentar buscar os níveis do quiz. Tente novamente.';
        this.openModal(this.title, this.message);
      }
    });
  }

  onLevelSelect() {
    const level = this.levels.find(l => String(l.id) === String(this.selectedLevelId));
    this.questionsCount = level ? level.questionCount : 0;
    this.questionsForm.clear();
    for (let i = 0; i < this.questionsCount; i++) {
      this.questionsForm.push(this.fb.group({
        question: ['', Validators.required],
        option0: ['', Validators.required],
        option1: ['', Validators.required],
        option2: ['', Validators.required],
        option3: ['', Validators.required],
        option4: ['', Validators.required],
        answer: ['', Validators.required]
      }));
    }
    this.currentQuestionIndex = 0;
    this.showQuestionsModal = true;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questionsForm.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  saveQuestions() {
    const cadastro = {
      quiz_id: this.selectedQuizId,
      quiz_level_id: this.selectedLevelId,
      questions: this.questionsForm.value.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: [q.option0, q.option1, q.option2, q.option3, q.option4],
        answer: q.answer
      }))
    };

    if (this._editQuestion) {
      this.quizService.updateQuestions(cadastro).subscribe({
        next: (response) => {
          this.title = 'Edição de Questões';
          this.message = 'Questões atualizadas com sucesso!';
          this.openModal(this.title, this.message);
          this.router.navigate(['/plataforma/view/view-quiz']);
        },
        error: (error) => {
          this.title = 'Erro';
          this.message = 'Erro ao atualizar questões.';
          this.openModal(this.title, this.message);
        }
      });
    } else {
      this.quizService.createQuestions(cadastro).subscribe({
        next: (response) => {
          this.title = 'Cadastro de Questões';
          this.message = 'Questões cadastradas com sucesso!';
          this.openModal(this.title, this.message);
          this.router.navigate(['/plataforma/view/view-quiz']);
        },
        error: (error) => {
          this.title = 'Erro';
          this.message = 'Erro ao cadastrar questões.';
          this.openModal(this.title, this.message);
        }
      });
    }

    this.showQuestionsModal = false;
  }

  closeQuestionsModal() {
    this.showQuestionsModal = false;
  }

  get currentQuestionGroup(): FormGroup | null {
    if (this.questionsForm.length === 0) return null;
    return this.questionsForm.at(this.currentQuestionIndex) as FormGroup;
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
    modalRef.componentInstance.modalTitle = title; 
    modalRef.componentInstance.modalMessage = message; 
  }
}
