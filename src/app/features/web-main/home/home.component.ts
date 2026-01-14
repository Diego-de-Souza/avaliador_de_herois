import { Component, inject, OnInit} from '@angular/core';
import { ArtigosComponent } from '../../../shared/components/artigos/artigos.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CuriosidadesComponent } from '../../../shared/components/curiosidades/curiosidades.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DestaqueComponent } from '../../../shared/components/destaque/destaque.component';
import { ReviewComponent } from '../../../shared/components/review/review.component';
import { NewsletterComponent } from "../../../shared/components/newsletter/newsletter.component";
import { EventosComponent } from '../../../shared/components/eventos/eventos.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { NovidadesComponent } from '../../../shared/components/novidades/novidades.component';
import { BannerVideos } from '../../../shared/components/banner-videos/banner-videos';
import { DataEvents } from '../../../core/interface/data-events.interface';
import { bannerInit } from '../../../data/banner_init';
import { AuthService } from '../../../core/service/auth/auth.service';
import { SeoService } from '../../../core/service/seo/seo.service';
import { HeroSectionComponent } from '../../../shared/components/hero-section/hero-section.component';
import { WhyChooseComponent } from '../../../shared/components/why-choose/why-choose.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BannerVideos,
    ReviewComponent,
    ArtigosComponent,
    FooterComponent,
    CuriosidadesComponent,
    EventosComponent,
    HeaderComponent,
    NewsletterComponent,
    NovidadesComponent,
    DestaqueComponent,
    HeroSectionComponent,
    WhyChooseComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly seoService = inject(SeoService);
  
  public themeHome: string | null = 'dark';

  public dataBanner: DataEvents[] = bannerInit;

  constructor(private themeService: ThemeService){}

  ngOnInit() {
    // Configurar SEO para a home
    this.seoService.updateMetaTags({
      title: 'Heroes Platform - Seu Universo de Heróis',
      description: 'A maior plataforma brasileira sobre heróis, cultura geek, jogos interativos e quizzes. Explore artigos exclusivos, jogue games únicos e teste seus conhecimentos sobre Marvel, DC, Anime e muito mais!',
      keywords: 'heróis, super-heróis, marvel, dc comics, anime, cultura geek, jogos, quizzes, artigos, notícias, eventos geek',
      type: 'website'
    });

    this.themeService.theme$.subscribe(theme =>{
      this.themeHome = theme;
      this.applyTheme(theme);
    })

    this.authService.registerAcessoUser();
  }


  applyTheme(theme: string) {
    const el = document.getElementById('container-home');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}


