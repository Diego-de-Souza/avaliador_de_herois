import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { SeoService } from '../../../core/service/seo/seo.service';
import { StructuredDataComponent, StructuredDataConfig } from '../../../shared/components/structured-data/structured-data.component';

@Component({
  selector: 'app-manual-redator',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, StructuredDataComponent],
  templateUrl: './manual-redator.component.html',
  styleUrl: './manual-redator.component.css'
})
export class ManualRedatorComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly seoService = inject(SeoService);

  public themeManual: string = 'dark';
  public structuredData!: StructuredDataConfig;

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeManual = theme;
      this.applyTheme(theme);
    });

    // SEO
    this.seoService.updateMetaTags({
      title: 'Manual do Redator - Heroes Platform',
      description: 'Guia completo de ética e boas práticas jornalísticas para redatores da Heroes Platform. Diretrizes editoriais, compromisso com integridade e combate à desinformação.',
      keywords: 'manual redator, ética jornalística, diretrizes editoriais, boas práticas, compliance, jornalismo',
      type: 'article'
    });

    // Structured Data
    this.structuredData = StructuredDataComponent.createArticleData({
      title: 'Manual do Redator HEROES',
      description: 'Guia completo de ética e boas práticas jornalísticas',
      author: 'Heroes Platform',
      publishedTime: new Date().toISOString(),
      url: window.location.href
    });
  }

  applyTheme(theme: string) {
    const el = document.getElementById('container-manual');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
