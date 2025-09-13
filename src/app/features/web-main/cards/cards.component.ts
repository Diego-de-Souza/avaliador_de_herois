import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { dadosHeroes } from '../../../data/cards';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroisService } from '../../../core/service/herois/herois.service';
import { HeroisModel } from '../../../core/Model/herois.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';
import { delay, Subject, takeUntil } from 'rxjs';
import { FlashLoadingComponent } from '../../../shared/components/flash-loading/flash-loading.component';
import { ImageService } from '../../../core/service/image/image.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FlashLoadingComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchHeroes = inject(HeroisService);
  private themeService = inject(ThemeService);
  private imageService = inject(ImageService);

  private destroy$ = new Subject<void>();

  cardsHeroes: any[] = [];
  cardsJson: any[] = [];
  currentTheme: string = 'dark';

  isLoading: boolean = false;
  currentFilter: string = '';
  totalResults: number = 0;
  showCards: boolean = false;

  @Input() searchResults: any[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.cardsHeroes.forEach(card => {
      if (card.image && card.image.startsWith('blob:')) {
        URL.revokeObjectURL(card.image);
      }
      if (card.image_cover && card.image_cover.startsWith('blob:')) {
        URL.revokeObjectURL(card.image_cover);
      }
    });

    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    this.setupTheme();
    this.loadDefaultCards();
    this.handleRouteParams();

    setTimeout(() => {
      this.showCards = true;
    }, 300);
  }

  private setupTheme(): void {
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  private loadDefaultCards(): void {
    this.cardsJson = dadosHeroes;
    this.cardsHeroes = [...this.cardsJson];
    this.totalResults = this.cardsHeroes.length;
  }

  private handleRouteParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.processRouteParams(params);
      });
  }

  private processRouteParams(params: any): void {
    const { studioId, team, morality, genre, anoLancamento } = params;
    this.resetResults();

    if (studioId) {
      this.currentFilter = `Editora: ${studioId}`;
      this.filterByStudio(studioId);
    } else if (team) {
      this.currentFilter = `Equipe: ${team}`;
      this.filterByTeam(team);
    } else if (morality) {
      this.currentFilter = `Moralidade: ${morality}`;
      this.filterByMorality(morality);
    } else if (genre) {
      this.currentFilter = `Gênero: ${genre}`;
      this.filterByGenre(genre);
    } else if (anoLancamento) {
      this.currentFilter = `Ano: ${anoLancamento}`;
      this.filterByAnoLancamento(anoLancamento);
    } else {
      this.currentFilter = 'Todos os Heróis';
      this.cardsHeroes = [...this.cardsJson];
      this.totalResults = this.cardsHeroes.length;
      this.isLoading = false;
    }
  }

  private resetResults(): void {
    this.isLoading = true;
    this.cardsHeroes = [];
    this.totalResults = 0;
  }

  private handleSuccess(data: HeroisModel[], filterType: string): void {
    if (!data || !Array.isArray(data)) {
      this.handleError(new Error('Dados inválidos'), filterType);
      return;
    }

    this.cardsHeroes = data.map((hero: any) => ({
      ...hero,
      image: this.imageService.processImageField(hero.image1, 'image/jpeg'),
      image_cover: this.imageService.processImageField(hero.image2, 'image/png')
    }));

    this.totalResults = data.length;
    this.isLoading = false;
  }

  private handleError(error: any, filterType: string): void {
    this.isLoading = false;
    this.cardsHeroes = [];
    this.totalResults = 0;
  }

  filterByStudio(studioId: number): void {
    this.searchHeroes.searchHeroesByStudio(studioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => this.handleSuccess(resp.data, 'Studio'),
        error: (error) => this.handleError(error, 'Studio')
      });
  }

  filterByTeam(team: string): void {
    this.searchHeroes.searchHeroesTeam(team)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.handleSuccess(data, 'Team'),
        error: (error) => this.handleError(error, 'Team')
      });
  }

  filterByMorality(morality: string): void {
    this.searchHeroes.searchHeroesMorality(morality)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.handleSuccess(data, 'Morality'),
        error: (error) => this.handleError(error, 'Morality')
      });
  }

  filterByGenre(genre: string): void {
    this.searchHeroes.searchHeroesGenre(genre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.handleSuccess(data, 'Genre'),
        error: (error) => this.handleError(error, 'Genre')
      });
  }

  filterByAnoLancamento(anoLancamento: number): void {
    this.searchHeroes.searchHeroesReleaseDate(anoLancamento)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.handleSuccess(data, 'Release Date'),
        error: (error) => this.handleError(error, 'Release Date')
      });
  }

  trackByCardId(index: number, card: any): any {
    return card.id || index;
  }

  getMoralityClass(morality: string): string {
    const moralityMap: { [key: string]: string } = {
      'good': 'hero',
      'bad': 'villain',
      'neutral': 'neutral',
      'bom': 'hero',
      'mau': 'villain',
      'neutro': 'neutral'
    };

    return moralityMap[morality?.toLowerCase()] || 'neutral';
  }

  clearFilters(): void {
    this.currentFilter = 'Todos os Heróis';
    this.cardsHeroes = [...this.cardsJson];
    this.totalResults = this.cardsHeroes.length;
  }

  openCardDetails(card: any): void {
    if (card && card.id) {
      this.router.navigate(['/webmain/descriptionHeroes/'+ card.id, card]);
    } else {
      console.error('Card inválido:', card);
    }
  }
}
