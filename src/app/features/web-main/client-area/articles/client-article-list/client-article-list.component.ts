import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../../core/service/auth/auth.service';
import { ToastService } from '../../../../../core/service/toast/toast.service';
import { ClientArticle } from '../../../../../core/interface/client-article.interface';
import { ArticleService } from '../../../../../core/service/articles/articles.service';

@Component({
  selector: 'app-client-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FontAwesomeModule, HeaderComponent, FooterComponent],
  templateUrl: './client-article-list.component.html',
  styleUrl: './client-article-list.component.css'
})
export class ClientArticleListComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly articleService = inject(ArticleService);
  private readonly toastService = inject(ToastService);

  theme = 'dark';
  userId: string | null = null;
  articles: ClientArticle[] = [];
  selectedArticles = new Set<string>();
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

    this.loadArticles();
  }

  loadArticles(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.articleService.getAllClientArticles(this.userId).subscribe({
      next: (response: any) => {
        // A API retorna { status, message, data: [...] }
        if (response.data && Array.isArray(response.data)) {
          this.articles = response.data;
        } else if (response.articles && Array.isArray(response.articles)) {
          // Fallback para formato antigo caso necessário
          this.articles = response.articles;
        } else {
          this.articles = [];
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar artigos:', error);
        this.toastService.error('Erro ao carregar artigos', 'Erro');
        this.isLoading = false;
      }
    });
  }

  toggleSelection(id: string): void {
    if (this.selectedArticles.has(id)) {
      this.selectedArticles.delete(id);
    } else {
      this.selectedArticles.add(id);
    }
  }

  toggleSelectAll(): void {
    if (this.selectedArticles.size === this.articles.length) {
      this.selectedArticles.clear();
    } else {
      this.articles.forEach(article => this.selectedArticles.add(String(article.id)));
    }
  }

  editArticle(id: string): void {
    this.router.navigate(['/webmain/client-area/articles/edit', id]);
  }

  deleteArticle(id: string): void {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      this.articleService.deleteClientArticle(id).subscribe({
        next: () => {
          this.toastService.success('Artigo excluído com sucesso!', 'Sucesso');
          this.loadArticles();
          this.selectedArticles.delete(id);
        },
        error: () => {
          this.toastService.error('Erro ao excluir artigo', 'Erro');
        }
      });
    }
  }

  deleteSelected(): void {
    if (this.selectedArticles.size === 0) {
      this.toastService.warning('Selecione pelo menos um artigo', 'Atenção');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir ${this.selectedArticles.size} artigo(s)?`)) {
      const ids = Array.from(this.selectedArticles);
      this.articleService.deleteManyClientArticles(ids).subscribe({
        next: () => {
          this.toastService.success(`${ids.length} artigo(s) excluído(s) com sucesso!`, 'Sucesso');
          this.loadArticles();
          this.selectedArticles.clear();
        },
        error: () => {
          this.toastService.error('Erro ao excluir artigos', 'Erro');
        }
      });
    }
  }

  get hasSelection(): boolean {
    return this.selectedArticles.size > 0;
  }

  get allSelected(): boolean {
    return this.articles.length > 0 && this.selectedArticles.size === this.articles.length;
  }
}
