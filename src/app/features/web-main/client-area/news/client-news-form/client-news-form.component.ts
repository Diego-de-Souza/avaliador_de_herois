import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../../core/service/auth/auth.service';
import { ClientNewsHttpService } from '../../../../../core/service/http/client-news-http.service';
import { ToastService } from '../../../../../core/service/toast/toast.service';
import { ClientNews } from '../../../../../core/interface/client-news.interface';

@Component({
  selector: 'app-client-news-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './client-news-form.component.html',
  styleUrl: './client-news-form.component.css'
})
export class ClientNewsFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly newsService = inject(ClientNewsHttpService);
  private readonly toastService = inject(ToastService);

  theme = 'dark';
  userId: number | null = null;
  newsForm!: FormGroup;
  isEditMode = false;
  newsId: number | null = null;
  isLoading = false;

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
        this.newsId = parseInt(id, 10);
        this.loadNews(this.newsId);
      }
    });
  }

  initForm(): void {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      content: ['', [Validators.required]],
      type_news_letter: ['', [Validators.required]],
      theme: ['', [Validators.required]]
    });
  }

  loadNews(id: number): void {
    this.isLoading = true;
    this.newsService.getById(id).subscribe({
      next: (response: any) => {
        // A API retorna { status, message, dataUnit: {...} }
        const news: ClientNews = response.dataUnit || response;
        
        this.newsForm.patchValue({
          title: news.title || '',
          description: news.description || '',
          content: news.content || '',
          type_news_letter: news.type_news_letter || '',
          theme: news.theme || ''
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar notícia:', error);
        this.toastService.error('Erro ao carregar notícia', 'Erro');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.newsForm.invalid || !this.userId) {
      this.newsForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const newsData = {
      ...this.newsForm.value,
      usuario_id: this.userId
    };

    const operation = this.isEditMode && this.newsId
      ? this.newsService.update(this.newsId, newsData)
      : this.newsService.create(newsData);

    operation.subscribe({
      next: () => {
        this.toastService.success(
          this.isEditMode ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!',
          'Sucesso'
        );
        this.router.navigate(['/webmain/client-area/news']);
      },
      error: () => {
        this.toastService.error('Erro ao salvar notícia', 'Erro');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/webmain/client-area/news']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.newsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
