import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { articlesProps } from '../../../../../core/interface/articles.interface';
import { ArticleService } from '../../../../../core/service/articles/articles.service';
import { HeaderComponent } from '../../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-form-article',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './form-article.component.html',
  styleUrls: ['./form-article.component.css']
})
export class FormArticleComponent {
  article: Partial<articlesProps> = {
    category: '',
    title: '',
    description: '',
    text: '',
    img: '',
    imgAlt: '',
    keyWords: []
  };

  keywordsInput = '';

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {
    this.articleService.loadFromLocalStorage();
  }

  generateId(): number {
    return Number(crypto.randomUUID());
  }

  saveArticle() {
    if (this.article.title && this.article.text && this.article.category) {
      const newArticle: articlesProps = {
        ...(this.article as articlesProps),
        id: this.generateId(),
        keyWords: this.keywordsInput.split(',').map(k => k.trim()),
        created_at: new Date().toISOString()
      };

      this.articleService.addArticle(newArticle);
      alert('Artigo salvo com sucesso!');

      // resetar formulário
      this.article = {};
      this.keywordsInput = '';

      // redirecionar
      this.router.navigate(['/']);
    } else {
      alert('Preencha os campos obrigatórios.');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
