import { Component, OnInit} from '@angular/core';
import { BannerComponent } from '../../../shared/components/banner/banner.component';
import { ArtigosComponent } from '../../../shared/components/artigos/artigos.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { CuriosidadesComponent } from '../../../shared/components/curiosidades/curiosidades.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { DestaqueComponent } from '../../../shared/components/destaque/destaque.component';
import { ReviewComponent } from '../../../shared/components/review/review.component';
import { NewsletterComponent } from "../../../shared/components/newsletter/newsletter.component";
import { EventosComponent } from '../../../shared/components/eventos/eventos.component';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BannerComponent,
    DestaqueComponent,
    ReviewComponent,
    ArtigosComponent,
    FooterComponent,
    CuriosidadesComponent,
    EventosComponent,
    HeaderComponent,
    NewsletterComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  public themeHome: string | null = 'dark';

  constructor(private themeService: ThemeService){}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this.themeHome = theme;
      this.applyTheme(theme);
    })
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


