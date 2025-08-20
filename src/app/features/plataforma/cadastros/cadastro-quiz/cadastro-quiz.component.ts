import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { QuizService } from '../../../../core/service/quiz/quiz.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Difficulty } from '../../../../core/enums/difficulty.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-quiz',
  standalone: true,
  imports: [CommonModule, HeaderPlatformComponent, ReactiveFormsModule],
  templateUrl: './cadastro-quiz.component.html',
  styleUrl: './cadastro-quiz.component.css'
})
export class CadastroQuizComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private fb = inject(FormBuilder);
  private readonly quizService = inject(QuizService);
  private modalService = inject(NgbModal)
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  destroy$ = new Subject<void>();

  public title:string = '';
  public message: string = '';
  public editingQuizId: number | null = null;
  public editingQuizLevelId: number | null = null;

  public _quizForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    theme: ['', Validators.required],
    quiz_levels: this.fb.array([
      this.fb.group({
        name_quiz_level: ['', Validators.required],
        questions_count: [0, [Validators.required, Validators.min(1)]],
        xp_reward: [0, [Validators.required, Validators.min(100)]],
        difficulty: ['', Validators.required]
      })
    ])
  });

  _quizTheme: string = 'dark';

  ngOnInit() {
    this._quizTheme = this.themeService.getTheme();

    this.route.paramMap.subscribe(params => {
      const quizId = params.get('id');
      const quizLevelId = params.get('level_id');
      if (quizId) {
        this.editingQuizId = +quizId;
      }
      if (quizLevelId) {
        this.editingQuizLevelId = +quizLevelId;
      }
      if (this.editingQuizId && this.editingQuizLevelId) {
        this.loadQuizAndLevelsForEdit(this.editingQuizId, this.editingQuizLevelId);
      }
      
    });
  }

  get quizLevels(): FormArray {
    return this._quizForm.get('quiz_levels') as FormArray;
  }

  addQuizLevel() {
    this.quizLevels.push(this.fb.group({
      name_quiz_level: ['', Validators.required],
      questions_count: [0, [Validators.required, Validators.min(1)]],
      xp_reward: [0, [Validators.required, Validators.min(100)]],
      difficulty: ['', Validators.required]
    }));
  }

  loadQuizAndLevelsForEdit(id: number, levelId: number) {
    this.quizService.getQuizWithLevelsById(id, levelId).subscribe({
      next: (quiz) => {
        this._quizForm.patchValue({
          name: quiz.dataUnit.quiz.name,
          theme: quiz.dataUnit.quiz.theme,
        });
        const levelsArray = new FormArray<FormGroup<any>>([
          this.fb.group({
            name_quiz_level: [quiz.dataUnit.quiz_level.name, Validators.required],
            questions_count: [quiz.dataUnit.quiz_level.questions, [Validators.required, Validators.min(1)]],
            xp_reward: [quiz.dataUnit.quiz_level.xp_reward, [Validators.required, Validators.min(100)]],
            difficulty: [quiz.dataUnit.quiz_level.difficulty, Validators.required]
          })
        ]);
        this._quizForm.setControl('quiz_levels', levelsArray);
      },
      error: (err) => {
        this.title = 'Erro';
        this.message = 'Não foi possível carregar os dados do quiz.';
        this.openModal(this.title, this.message);
      }
    });
  }

  removeQuizLevel(index: number) {
    if (this.quizLevels.length > 1) {
      this.quizLevels.removeAt(index);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this._quizForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isLevelFieldInvalid(index: number, field: string): boolean {
    const levelGroup = this.quizLevels.at(index) as FormGroup;
    const control = levelGroup.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this._quizForm.valid) {
      const payload = this._quizForm.value;
      if (this.editingQuizId && this.editingQuizLevelId) {
        // Atualiza quiz e quiz_levels juntos
        this.quizService.updateQuiz(this.editingQuizId, this.editingQuizLevelId, payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.title = 'Edição de Quiz';
              this.message = 'Quiz atualizado com sucesso!';
              this.openModal(this.title, this.message);
              this.router.navigate(['/plataforma/view/view-quiz']);
            },
            error: (error) => {
              this.title = 'Erro';
              this.message = 'Erro ao atualizar quiz.';
              this.openModal(this.title, this.message);
            }
          });
      } else {
        this.quizService.createQuiz(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.title = 'Cadastro de Quiz';
              this.message = 'Quiz cadastrado com sucesso!';
              this.openModal(this.title, this.message);
              this.router.navigate(['/plataforma/view/view-quiz']);
            },
            error: (error) => {
              this.title = 'Erro';
              this.message = 'Erro ao cadastrar quiz.';
              this.openModal(this.title, this.message);
            }
          });
      }
    } else {
      this.title = 'Erro';
      this.message = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      this.openModal(this.title, this.message);
    }
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
    modalRef.componentInstance.modalTitle = title; 
    modalRef.componentInstance.modalMessage = message; 
  }

  onCancel() {
    this._quizForm.reset();
    while (this.quizLevels.length > 1) {
      this.quizLevels.removeAt(0);
    }
  }
}