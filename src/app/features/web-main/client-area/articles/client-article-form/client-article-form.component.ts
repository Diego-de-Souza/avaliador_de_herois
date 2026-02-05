import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../../core/service/auth/auth.service';
import { ToastService } from '../../../../../core/service/toast/toast.service';
import { ClientArticle, ClientArticleRequest } from '../../../../../core/interface/client-article.interface';
import { ArticleService } from '../../../../../core/service/articles/articles.service';

@Component({
  selector: 'app-client-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, HeaderComponent, FooterComponent],
  templateUrl: './client-article-form.component.html',
  styleUrl: './client-article-form.component.css'
})
export class ClientArticleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly articleService = inject(ArticleService);
  private readonly toastService = inject(ToastService);

  theme = 'dark';
  userId: string | null = null;
  articleForm!: FormGroup;
  isEditMode = false;
  articleId: string | null = null;
  isLoading = false;

  get summaryArray(): FormArray {
    return this.articleForm.get('summary') as FormArray;
  }

  get keyWordsArray(): string[] {
    const keyWords = this.articleForm.get('keyWords')?.value || '';
    return keyWords.split(',').map((kw: string) => kw.trim()).filter((kw: string) => kw);
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe((t: string) => {
      this.theme = t;
    });

    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.articleId = id;
        this.loadArticle(this.articleId);
      }
    });
  }

  initForm(): void {
    this.articleForm = this.fb.group({
      category: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      text: ['', [Validators.required]],
      summary: this.fb.array([]),
      keyWords: [''],
      theme: [''],
      themeColor: ['#00D2FF']
    });
  }

  loadArticle(id: string): void {
    this.isLoading = true;
    this.articleService.getClientArticleById(id).subscribe({
      next: (response: any) => {
        // A API retorna { status, message, dataUnit: {...} }
        const article: ClientArticle = response.dataUnit || response;
        
        this.articleForm.patchValue({
          category: article.category || '',
          title: article.title || '',
          description: article.description || '',
          text: article.text || '',
          keyWords: article.keyWords ? (Array.isArray(article.keyWords) ? article.keyWords.join(', ') : article.keyWords) : '',
          theme: article.theme || '',
          themeColor: article.themeColor || '#00D2FF'
        });

        if (article.summary && Array.isArray(article.summary) && article.summary.length > 0) {
          // Limpar array existente
          while (this.summaryArray.length !== 0) {
            this.summaryArray.removeAt(0);
          }
          // Adicionar itens do artigo
          article.summary.forEach((item: { text: string; level: number }) => {
            this.addSummaryItem(item.text, item.level);
          });
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar artigo:', error);
        this.toastService.error('Erro ao carregar artigo', 'Erro');
        this.isLoading = false;
      }
    });
  }

  addSummaryItem(text: string = '', level: number = 1): void {
    this.summaryArray.push(this.fb.group({
      text: [text, Validators.required],
      level: [level, [Validators.required, Validators.min(1), Validators.max(5)]]
    }));
  }

  removeSummaryItem(index: number): void {
    this.summaryArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.articleForm.invalid || !this.userId) {
      this.articleForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.articleForm.value;
    const keyWordsArray = formValue.keyWords
      ? formValue.keyWords.split(',').map((kw: string) => kw.trim()).filter((kw: string) => kw)
      : [];

    const articleData = {
      ...formValue,
      keyWords: keyWordsArray,
      summary: formValue.summary,
      usuario_id: this.userId
    };

    const operation = this.isEditMode && this.articleId
      ? this.articleService.updateClientArticle(this.articleId, articleData)
      : this.articleService.createClientArticle(articleData as unknown as ClientArticleRequest);

    operation.subscribe({
      next: () => {
        this.toastService.success(
          this.isEditMode ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!',
          'Sucesso'
        );
        this.router.navigate(['/webmain/client-area/articles']);
      },
      error: (error: any) => {
        this.toastService.error('Erro ao salvar artigo', 'Erro');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/webmain/client-area/articles']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.articleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
