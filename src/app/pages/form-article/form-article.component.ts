import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { articlesProps } from '../../types/articles';
import { Router } from '@angular/router';
import { ArticleService } from '../../service/article.service';

@Component({
  selector: 'app-form-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  saveArticle() {
    if (this.article.title && this.article.text && this.article.category) {
      const newArticle: articlesProps = {
        ...this.article,
        keyWords: this.keywordsInput.split(',').map(k => k.trim()),
        created_at: new Date().toISOString()
      } as articlesProps;

      this.articleService.addArticle(newArticle);
      alert('Artigo salvo com sucesso!');

      // resetar formulário
      this.article = {};
      this.keywordsInput = '';

      // redirecionar
      this.router.navigate(['/artigos']);
    } else {
      alert('Preencha os campos obrigatórios.');
    }
  }
}
