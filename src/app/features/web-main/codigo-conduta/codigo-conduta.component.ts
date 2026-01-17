import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { SeoService } from '../../../core/service/seo/seo.service';
import { StructuredDataComponent, StructuredDataConfig } from '../../../shared/components/structured-data/structured-data.component';

@Component({
  selector: 'app-codigo-conduta',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, StructuredDataComponent],
  templateUrl: './codigo-conduta.component.html',
  styleUrl: './codigo-conduta.component.css'
})
export class CodigoCondutaComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly seoService = inject(SeoService);

  public themeCodigo: string = 'dark';
  public structuredData!: StructuredDataConfig;

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeCodigo = theme;
      this.applyTheme(theme);
    });

    // SEO
    this.seoService.updateMetaTags({
      title: 'Código de Conduta da Comunidade - Heroes Platform',
      description: 'Como garantimos um ambiente seguro, inclusivo e respeitoso para todos os membros da comunidade Heroes Platform. Diretrizes de comportamento e políticas de segurança.',
      keywords: 'código de conduta, comunidade, segurança, inclusão, respeito, diversidade, políticas',
      type: 'article'
    });

    // Structured Data
    this.structuredData = StructuredDataComponent.createArticleData({
      title: 'Código de Conduta da Comunidade HEROES',
      description: 'Como garantimos um ambiente seguro e inclusivo para todos',
      author: 'Heroes Platform',
      publishedTime: new Date().toISOString(),
      url: window.location.href
    });
  }

  applyTheme(theme: string) {
    const el = document.getElementById('container-codigo');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
