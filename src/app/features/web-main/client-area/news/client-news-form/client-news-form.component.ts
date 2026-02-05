import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../../core/service/auth/auth.service';
import { ToastService } from '../../../../../core/service/toast/toast.service';
import { ClientNews, ClientNewsRequest } from '../../../../../core/interface/client-news.interface';
import { NewsletterCategory } from '../../../../../core/interface/newsletter.interface';
import { NewsService } from '../../../../../core/service/news/news.service';

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
  private readonly newsService = inject(NewsService);
  private readonly toastService = inject(ToastService);

  theme = 'dark';
  userId: string | null = null;
  newsForm!: FormGroup;
  isEditMode = false;
  newsId: string | null = null;
  isLoading = false;
  imagePreview: string | null = null;
  categories = NewsletterCategory;

  get categoryControl(): FormControl {
    return this.newsForm.get('category') as FormControl;
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
        this.newsId = id;
        this.loadNews(id);
      }
    });
  }

  initForm(): void {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      image: [''],
      link: [''],
      category: [],
      date: ['', [Validators.required]],
      read_time: ['', [Validators.required]],
      author: ['']
    });
  }

  loadNews(id: string): void {
    this.isLoading = true;
    this.newsService.getClientNewsletterById(id).subscribe({
      next: (response: unknown) => {
        const res = response as { dataUnit?: ClientNews; data?: ClientNews; [k: string]: unknown };
        const news: ClientNews = res.dataUnit ?? res.data ?? (response as ClientNews);
        this.newsForm.patchValue({
          title: news.title || '',
          description: news.description || '',
          image: news.image || '',
          link: news.link ?? '',
          category: (news as { category?: string }).category ?? '',
          date: (news as { date?: string }).date ?? '',
          read_time: (news as { read_time?: string }).read_time ?? '',
          author: news.author ?? ''
        });
        if (news.image) {
          this.imagePreview = news.image;
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Erro ao carregar notícia', 'Erro');
        this.isLoading = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.toastService.error('Apenas imagens JPG, PNG ou WebP são permitidas.', 'Erro');
      return;
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.toastService.error(`A imagem deve ter no máximo ${maxSizeMB}MB.`, 'Erro');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (result) {
        this.imagePreview = result;
        this.newsForm.patchValue({ image: result });
      }
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.imagePreview = null;
    this.newsForm.patchValue({ image: '' });
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    if (this.newsForm.invalid || !this.userId) {
      this.newsForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getUser();
    this.newsForm.patchValue({
      author: user?.nickname
    });

    this.isLoading = true;
    const newsData: ClientNewsRequest = {
      ...this.newsForm.value,
      usuario_id: this.userId!
    };

    const operation = this.isEditMode && this.newsId
      ? this.newsService.updateClientNewsletter(this.newsId, newsData)
      : this.newsService.createClientNewsletter(newsData);

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
