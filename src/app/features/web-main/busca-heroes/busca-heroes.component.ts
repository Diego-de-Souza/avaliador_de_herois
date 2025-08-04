import { Component, ElementRef, OnInit, Renderer2, inject } from '@angular/core';
import { Router , RouterLink, RouterLinkActive} from '@angular/router';
import { HeroisService } from '../../../core/service/herois/herois.service';
import { HeroisModel } from '../../../core/Model/herois.model';
import { HeroisMenuModel } from '../../../core/Model/heroisMenu.model';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-busca-heroes',
  standalone: true,
  imports: [RouterLinkActive, FormsModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './busca-heroes.component.html',
  styleUrl: './busca-heroes.component.css'
})
export class BuscaHeroesComponent implements OnInit {
  themeService = inject(ThemeService);
  
  _themeSearch: string = 'dark';
  
  statusEditora: number = 0;
  statusEquipe: number = 0;
  statusOrigem: number = 0;
  statusAno: number = 0;
  statusMoralidade: number = 0;
  statusSexo: number = 0;
  anoLancamento: string = '';

  herois: HeroisModel[] = [];
  heroisMenuEditora: any[] = [];
  heroisMenuEquipe: any[] = [];
  heroisMenuMoralidade: any[] = [];
  heroisMenuOrigem: any[] = [];
  heroisMenuSexo: any[] = [];

  constructor(
    private router: Router, 
    private el: ElementRef, 
    private renderer: Renderer2, 
    private searchHerois: HeroisService
  ) { }

  ngOnInit(): void {
    this.getDadosMenu();
    
    this.themeService.theme$.subscribe(theme => {
      this._themeSearch = theme;
    });
  }

  getDadosMenu(): void {
    this.searchHerois.getDadosMenu().subscribe({
      next: (data) => {
        this.heroisMenuEditora = data[0];
        this.heroisMenuEquipe = data[1];
        this.heroisMenuMoralidade = data[2];
        this.heroisMenuSexo = data[3];
        console.log(data);
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  openEditoras() {
    this.statusEditora = this.statusEditora === 0 ? 1 : 0;
  }

  openEquipe() {
    this.statusEquipe = this.statusEquipe === 0 ? 1 : 0;
  }

  openOrigem() {
    this.statusOrigem = this.statusOrigem === 0 ? 1 : 0;
  }

  openAno() {
    this.statusAno = this.statusAno === 0 ? 1 : 0;
  }

  openMoralidade() {
    this.statusMoralidade = this.statusMoralidade === 0 ? 1 : 0;
  }

  openSexo() {
    this.statusSexo = this.statusSexo === 0 ? 1 : 0;
  }

  openForPublisher(studio: string): void {
    this.router.navigate(['/cards'], { queryParams: { studio } });
  }

  openForTeam(team: string): void {
    this.router.navigate(['/cards'], { queryParams: { team } });
  }

  buscaPorAno() {
    if (this.anoLancamento && this.anoLancamento.trim() !== '') {
      this.router.navigate(['/cards'], { queryParams: { anoLancamento: this.anoLancamento } });
    }
  }

  openForMorality(morality: string): void {
    this.router.navigate(['/cards'], { queryParams: { morality } });
  }

  openForSexy(genre: string): void {
    this.router.navigate(['/cards'], { queryParams: { genre } });
  }
}