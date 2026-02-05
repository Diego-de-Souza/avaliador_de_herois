import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../../core/service/auth/auth.service';
import { ToastService } from '../../../../../core/service/toast/toast.service';
import { ClientNews } from '../../../../../core/interface/client-news.interface';
import { NewsService } from '../../../../../core/service/news/news.service';

@Component({
  selector: 'app-client-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FontAwesomeModule, HeaderComponent, FooterComponent],
  templateUrl: './client-news-list.component.html',
  styleUrl: './client-news-list.component.css'
})
export class ClientNewsListComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);
  private readonly toastService = inject(ToastService);

  theme = 'dark';
  userId: string | null = null;
  news: ClientNews[] = [];
  selectedNews = new Set<string>();
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

    this.loadNews();
  }

  loadNews(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.newsService.getAllClientNewsletters(this.userId).subscribe({
      next: (response: any) => {
        // A API retorna { status, message, data: [...] }
        if (response.data && Array.isArray(response.data)) {
          this.news = response.data;
        } else if (response.news && Array.isArray(response.news)) {
          // Fallback para formato antigo caso necessário
          this.news = response.news;
        } else {
          this.news = [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar notícias:', error);
        this.toastService.error('Erro ao carregar notícias', 'Erro');
        this.isLoading = false;
      }
    });
  }

  toggleSelection(id: string): void {
    if (this.selectedNews.has(id)) {
      this.selectedNews.delete(id);
    } else {
      this.selectedNews.add(id);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedNews.size === this.news.length) {
      this.selectedNews.clear();
    } else {
      this.news.forEach(n => this.selectedNews.add(n.id));
    }
  }

  editNews(id: string): void {
    this.router.navigate(['/webmain/client-area/news/edit', id]);
  }

  deleteNews(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      this.newsService.deleteClientNewsletter(id).subscribe({
        next: () => {
          this.toastService.success('Notícia excluída com sucesso!', 'Sucesso');
          this.loadNews();
          this.selectedNews.delete(id);
        },
        error: () => {
          this.toastService.error('Erro ao excluir notícia', 'Erro');
        }
      });
    }
  }

  deleteSelected(): void {
    if (this.selectedNews.size === 0) {
      this.toastService.warning('Selecione pelo menos uma notícia', 'Atenção');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir ${this.selectedNews.size} notícia(s)?`)) {
      const ids = Array.from(this.selectedNews);
      this.newsService.deleteManyClientNewsletters(ids as string[]).subscribe({
        next: () => {
          this.toastService.success(`${ids.length} notícia(s) excluída(s) com sucesso!`, 'Sucesso');
          this.loadNews();
          this.selectedNews.clear();
        },
        error: () => {
          this.toastService.error('Erro ao excluir notícias', 'Erro');
        }
      });
    }
  }

  get hasSelection(): boolean {
    return this.selectedNews.size > 0;
  }

  get allSelected(): boolean {
    return this.news.length > 0 && this.selectedNews.size === this.news.length;
  }
}
