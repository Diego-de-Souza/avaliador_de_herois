import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-novidades',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule],
  templateUrl: './novidades.component.html',
  styleUrl: './novidades.component.css'
})
export class NovidadesComponent implements OnInit {
  public themeNovidades: string = 'dark';
  public articles: articlesProps[] = [];
  getRecentArticles: articlesProps[] = [];

  @ViewChild('novidadesContainer', { static: true }) novidadesContainer!: ElementRef;

  constructor(
    private articleService: ArticleService,
    private renderer: Renderer2,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.articleService.loadFromLocalStorage();
    this.articles = this.articleService.getArticles();
    this.getRecentArticles = this.articleService.getRecentArticles(4);
    this.themeService.theme$.subscribe(theme => {
      this.themeNovidades = theme;
      this.applyTheme(theme);
    });
  }

  private applyTheme(theme: string): void {
    const el = this.novidadesContainer.nativeElement;
    if (!el) return;

    if (theme === 'dark') {
      this.renderer.removeClass(el, 'light');
      this.renderer.addClass(el, 'dark');
    } else {
      this.renderer.removeClass(el, 'dark');
      this.renderer.addClass(el, 'light');
    }
  }
}
