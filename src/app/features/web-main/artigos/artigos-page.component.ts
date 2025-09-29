import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { ArtigosComponent } from '../../../shared/components/artigos/artigos.component';
import { NewsletterComponent } from '../../../shared/components/newsletter/newsletter.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { articlesProps } from '../../../core/interface/articles.interface';
import { ArticleService } from '../../../core/service/articles/articles.service';

interface imagesProps {
  url: string;
  title: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-artigos-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    CarouselComponent,
    ArtigosComponent,
    NewsletterComponent,
    FooterComponent],
  templateUrl: './artigos-page.component.html',
  styleUrl: './artigos-page.component.css'
})
export class ArtigosPageComponent implements OnInit {
  images: imagesProps[] = [];
  getRecentArticles: articlesProps[] = [];

  constructor(
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    this.getRecentArticles = this.articleService.getRecentArticles(5);
    this.images = this.getImages();
  }

  getImages(): imagesProps[] {
    const recentArticles = this.getRecentArticles;
    if (recentArticles.length === 0) return [];
    return recentArticles.map(article => ({
      url: article.thumbnail,
      title: article.title,
      description: article.description,
      route: article.route
    }));
  }
}
