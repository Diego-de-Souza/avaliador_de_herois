import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewsletterNewsItem } from '../../../../core/interface/client-news.interface';
import { NewsService } from '../../../../core/service/news/news.service';

@Component({
  selector: 'app-view-newsletter',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule],
  templateUrl: './view-newsletter.component.html',
  styleUrl: './view-newsletter.component.css'
})
export class ViewNewsletterComponent implements OnInit {
  private readonly newsletterService = inject(NewsService);
  
  private readonly router = inject(Router);

  isList = false;
  newsletters = signal<NewsletterNewsItem[]>([]);

  ngOnInit(): void {
    this.newsletterService.getList().subscribe({
      next: (items: NewsletterNewsItem[]) => {
        this.newsletters.set(items);
        this.isList = items.length > 0;
      },
      error: err => console.error('Erro ao carregar newsletter:', err)
    });
  }

  editItem(id: string): void {
    this.router.navigate([`/plataforma/cadastro/newsletter/${id}`]);
  }

  deleteItem(id: string): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.newsletterService.delete(id).subscribe({
        next: () => {
          this.newsletters.update(items => items.filter(item => item.id !== id));
        },
        error: err => console.error('Erro ao excluir newsletter:', err)
      });
    }
  }

  addNew(): void {
    this.router.navigate(['/plataforma/cadastro/newsletter']);
  }
}
