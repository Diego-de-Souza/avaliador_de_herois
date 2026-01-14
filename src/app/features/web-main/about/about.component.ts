import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { SeoService } from '../../../core/service/seo/seo.service';
import { StructuredDataComponent, StructuredDataConfig } from '../../../shared/components/structured-data/structured-data.component';
import { Employee } from '../../../core/interface/employes.interface';
import { Employees } from '../../../core/storage/employees/employeees.data';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, StructuredDataComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly seoService = inject(SeoService);

  public themeAbout: string = 'dark';
  public structuredData!: StructuredDataConfig;
  public integrantes: Employee[] = Employees;

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeAbout = theme;
      this.applyTheme(theme);
    });

    // SEO
    this.seoService.updateMetaTags({
      title: 'Sobre Nós - Heroes Platform',
      description: 'Conheça a equipe por trás da Heroes Platform. Um projeto colaborativo desenvolvido por alunos de Engenharia da Computação, criando a maior plataforma brasileira sobre heróis e cultura geek.',
      keywords: 'sobre, equipe, heroes platform, engenharia computação, desenvolvedores',
      type: 'website'
    });

    // Structured Data
    this.structuredData = StructuredDataComponent.createOrganizationData();
  }

  applyTheme(theme: string) {
    const el = document.getElementById('container-about');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
