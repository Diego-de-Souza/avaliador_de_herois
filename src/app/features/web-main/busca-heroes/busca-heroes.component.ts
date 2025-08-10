import { Component, ElementRef, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeroisService } from '../../../core/service/herois/herois.service';
import { HeroisModel } from '../../../core/Model/herois.model';
import { HeroisMenuModel } from '../../../core/Model/heroisMenu.model';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-busca-heroes',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './busca-heroes.component.html',
  styleUrl: './busca-heroes.component.css'
})
export class BuscaHeroesComponent implements OnInit, OnDestroy {
  // ===== INJEÇÕES COM inject() (MODERNO) =====
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private searchHerois = inject(HeroisService);
  
  // ===== CLEANUP =====
  private destroy$ = new Subject<void>();
  
  // ===== PROPRIEDADES EXISTENTES =====
  _themeSearch: string = 'dark';
  anoLancamento: string = '';

  herois: HeroisModel[] = [];
  heroisMenuEditora: any[] = [];
  heroisMenuEquipe: any[] = [];
  heroisMenuMoralidade: any[] = [];
  heroisMenuOrigem: any[] = [];
  heroisMenuSexo: any[] = [];

  // ===== SISTEMA DE ACCORDION MELHORADO =====
  private accordionStates = {
    editora: false,
    equipe: false,
    origem: false,
    ano: false,
    moralidade: false,
    sexo: false
  };

  // Getters para manter compatibilidade com seu HTML
  get statusEditora(): number { return this.accordionStates.editora ? 1 : 0; }
  get statusEquipe(): number { return this.accordionStates.equipe ? 1 : 0; }
  get statusOrigem(): number { return this.accordionStates.origem ? 1 : 0; }
  get statusAno(): number { return this.accordionStates.ano ? 1 : 0; }
  get statusMoralidade(): number { return this.accordionStates.moralidade ? 1 : 0; }
  get statusSexo(): number { return this.accordionStates.sexo ? 1 : 0; }

  // ===== CONSTRUTOR VAZIO (MODERNO) =====
  constructor() {}

  ngOnInit(): void {
    this.getDadosMenu();
    
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this._themeSearch = theme;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDadosMenu(): void {
    this.searchHerois.getDadosMenu()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log('=== DEBUG DADOS MENU ===');
          console.log('Resposta completa:', response);
          
          if (response && response.dataUnit && Array.isArray(response.dataUnit)) {
            this.heroisMenuEditora = response.dataUnit[0] || [];
            this.heroisMenuEquipe = response.dataUnit[1] || [];
            this.heroisMenuMoralidade = response.dataUnit[2] || [];
            this.heroisMenuSexo = response.dataUnit[3] || [];
            
            console.log('Studios após extração:', this.heroisMenuEditora);
            console.log('Teams após extração:', this.heroisMenuEquipe);
            console.log('Morality após extração:', this.heroisMenuMoralidade);
            console.log('Genre após extração:', this.heroisMenuSexo);
          } else {
            console.warn('Estrutura de dados inesperada:', response);
            this.initializeEmptyArrays();
          }
        },
        error: (error) => {
          console.error('Erro ao carregar heróis', error);
          this.initializeEmptyArrays();
        }
      });
  }

  private initializeEmptyArrays(): void {
    this.heroisMenuEditora = [];
    this.heroisMenuEquipe = [];
    this.heroisMenuMoralidade = [];
    this.heroisMenuSexo = [];
  }

  // ===== SISTEMA DE ACCORDION ROBUSTO =====
  private toggleAccordion(section: keyof typeof this.accordionStates): void {
    // Fechar todos os outros
    Object.keys(this.accordionStates).forEach(key => {
      if (key !== section) {
        this.accordionStates[key as keyof typeof this.accordionStates] = false;
      }
    });
    
    // Toggle apenas o selecionado
    this.accordionStates[section] = !this.accordionStates[section];
    
    console.log(`Accordion ${section} ${this.accordionStates[section] ? 'aberto' : 'fechado'}`);
  }

  // ===== MÉTODOS DE ACCORDION =====
  openEditoras() {
    this.toggleAccordion('editora');
  }

  openEquipe() {
    this.toggleAccordion('equipe');
  }

  openOrigem() {
    this.toggleAccordion('origem');
  }

  openAno() {
    this.toggleAccordion('ano');
  }

  openMoralidade() {
    this.toggleAccordion('moralidade');
  }

  openSexo() {
    this.toggleAccordion('sexo');
  }

  // ===== MÉTODOS DE NAVEGAÇÃO =====
  openForPublisher(studioId: number): void {
    console.log('Navegando para studio:', studioId);
    this.router.navigate(['/webmain/cards'], { queryParams: { studioId } });
  }

  openForTeam(team: string): void {
    console.log('Navegando para team:', team);
    this.router.navigate(['/webmain/cards'], { queryParams: { team } });
  }

  buscaPorAno() {
    if (this.anoLancamento && this.anoLancamento.trim() !== '') {
      console.log('Navegando para ano:', this.anoLancamento);
      this.router.navigate(['/webmain/cards'], { queryParams: { anoLancamento: this.anoLancamento } });
    }
  }

  openForMorality(morality: string): void {
    console.log('Navegando para morality:', morality);
    this.router.navigate(['/webmain/cards'], { queryParams: { morality } });
  }

  openForSexy(genre: string): void {
    console.log('Navegando para genre:', genre);
    this.router.navigate(['/webmain/cards'], { queryParams: { genre } });
  }
}