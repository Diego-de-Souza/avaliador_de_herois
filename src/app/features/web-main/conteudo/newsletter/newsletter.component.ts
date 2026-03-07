import {
  Component,
  inject,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  computed,
  DestroyRef,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { fromEvent } from 'rxjs';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  state
} from '@angular/animations';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { NewsletterNewsItem } from '../../../../core/interface/client-news.interface';
import { Category , NewsletterCategory} from '../../../../core/interface/newsletter.interface';
import { NewsService } from '../../../../core/service/news/news.service';
import { ApiResponse } from '../../../../core/interface/api-response.interface';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate(
          '600ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('staggerItem', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms 300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('cardHover', [
      state(
        'normal',
        style({
          transform: 'translateY(0)'
        })
      ),
      state(
        'hovered',
        style({
          transform: 'translateY(-10px)'
        })
      ),
      transition('normal => hovered', animate('200ms ease-in')),
      transition('hovered => normal', animate('200ms ease-out'))
    ]),
    trigger('bounceIn', [
      transition(
        ':enter',
        animate(
          '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          keyframes([
            style({ opacity: 0, transform: 'scale(0.8)', offset: 0 }),
            style({ opacity: 1, transform: 'scale(1.05)', offset: 0.5 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 })
          ])
        )
      )
    ]),
    trigger('glitch', [
      transition(
        ':enter',
        animate(
          '3s infinite',
          keyframes([
            style({ transform: 'translate(0)', offset: 0 }),
            style({ transform: 'translate(-2px, 2px)', offset: 0.2 }),
            style({ transform: 'translate(-2px, -2px)', offset: 0.4 }),
            style({ transform: 'translate(2px, 2px)', offset: 0.6 }),
            style({ transform: 'translate(2px, -2px)', offset: 0.8 }),
            style({ transform: 'translate(0)', offset: 1 })
          ])
        )
      )
    ])
  ]
})
export class NewsletterComponent implements AfterViewInit, OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly newsletterService = inject(NewsService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('particles') particlesRef!: ElementRef;

  readonly theme = toSignal(this.themeService.theme$, { initialValue: 'dark' });
  readonly email = signal('');
  readonly subscribed = signal(false);
  readonly submitting = signal(false);
  readonly loading = signal(false);
  readonly hoverState = signal<'normal' | 'hovered'>('normal');
  
  // CORRIGIDO: featuresNews deve ser um objeto, não array
  readonly featuresNews = signal<NewsletterNewsItem | null>(null);
  
  readonly tabs = signal<Category[]>(NewsletterCategory);
  readonly selectedTab = signal<Category>(NewsletterCategory[0]);
  
  // Signals para paginação
  readonly pageSize = signal(6); // Quantos itens por página
  readonly currentPage = signal(1); // Página atual
  readonly allNews = signal<NewsletterNewsItem[]>([]); // Todos os itens carregados
  readonly hasMoreNews = signal(true); // Indica se existem mais itens

  // Computed para pegar apenas os itens da página atual
  readonly paginatedNews = computed(() => {
    const all = this.allNews();
    const page = this.currentPage();
    const size = this.pageSize();
    
    return all.slice(0, page * size);
  });

  // Filtered news list usando paginatedNews
  readonly filteredNewsList = computed(() => {
    const list = this.paginatedNews();
    const tab = this.selectedTab();
    if (!tab || tab.value === 'ALL') return list;
    
    const normalize = (s: string) => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tabNorm = normalize(tab.value);
    
    return list.filter(
      news => news.category && normalize(news.category) === tabNorm
    );
  });

  ngOnInit(): void {
    this.loadFeaturesNews();
  }
  
  private readonly defaultNewsImage = '/img/diversos/newsletter_300x300.jpeg';

  private processNewsItem(news: NewsletterNewsItem): NewsletterNewsItem {
    const img = (news as { image?: string; thumbnail?: string }).image ?? (news as { image?: string; thumbnail?: string }).thumbnail ?? '';
    const hasNoImage = !img || (typeof img === 'string' && img.trim() === '');
    return { ...news, image: hasNoImage ? this.defaultNewsImage : img };
  }

  private loadFeaturesNews(): void {
    this.newsletterService.getListNewsletters().subscribe({
      next: (response: ApiResponse<NewsletterNewsItem>) => {
        const raw = response.data ?? [];
        const processed = raw.map(news => this.processNewsItem(news));
        
        // Armazena TODAS as notícias
        this.allNews.set(processed);
        
        // Define se existem mais notícias (se total > pageSize)
        this.hasMoreNews.set(processed.length > this.pageSize());
        
        // CORRIGIDO: Define a primeira notícia como destaque (objeto, não array)
        if (processed.length > 0) {
          this.featuresNews.set(processed[0]);
        }
      },
      error: (error) => {
        console.error('Erro ao buscar notícias:', error);
        this.allNews.set([]);
        this.hasMoreNews.set(false);
        this.featuresNews.set(null);
      }
    });
  }

  ngAfterViewInit(): void {
    this.createParticles();
    this.setupScrollListener();
  }

  private setupScrollListener(): void {
    fromEvent(window, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onScroll());
  }

  subscribe(): void {
    const emailValue = this.email();
    if (emailValue && this.validateEmail(emailValue)) {
      this.submitting.set(true);

      setTimeout(() => {
        this.subscribed.set(true);
        this.submitting.set(false);
        this.email.set('');
        this.showNotification('Inscrição realizada com sucesso!');
      }, 1500);
    }
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  editPreferences(): void {
    this.subscribed.set(false);
  }

  readArticle(news: NewsletterNewsItem): void {
    const link = news.link;
    if (link) {
      window.open(link, '_blank');
    }
  }

  filterNews(value: string): void {
    const tab = NewsletterCategory.find(tab => tab.value === value);
    if (tab) {
      this.selectedTab.set(tab);
      // Reseta para a primeira página ao filtrar
      this.currentPage.set(1);
      this.hasMoreNews.set(this.allNews().length > this.pageSize());
    }
  }

  loadMore(): void {
    // Verifica se já está carregando ou se não existem mais notícias
    if (this.loading() || !this.hasMoreNews()) {
      return;
    }

    this.loading.set(true);

    // Simula um carregamento assíncrono (remova o setTimeout se estiver usando um serviço real)
    setTimeout(() => {
      const nextPage = this.currentPage() + 1;
      const totalItems = this.allNews().length;
      const itemsToShow = nextPage * this.pageSize();
      
      // Verifica se ainda existem itens para mostrar
      if (itemsToShow < totalItems) {
        this.currentPage.set(nextPage);
        this.hasMoreNews.set(true);
      } else if (itemsToShow >= totalItems) {
        // Se já mostrou todos os itens, define hasMoreNews como false
        this.currentPage.set(nextPage);
        this.hasMoreNews.set(false);
      }
      
      this.loading.set(false);
    }, 1000); // Simula latência de rede
  }

  shareNews(news: NewsletterNewsItem): void {
    if (navigator.share) {
      void navigator.share({
        title: news.title,
        text: news.description,
        url: news.link
      });
    } else {
      void navigator.clipboard.writeText(news.link);
      this.showNotification('Link copiado para a área de transferência!');
    }
  }

  bookmarkNews(_news: NewsletterNewsItem): void {
    this.showNotification('Notícia salva nos favoritos!');
  }

  private showNotification(message: string): void {
    console.log(message);
  }

  private createParticles(): void {
    const container = this.particlesRef?.nativeElement;
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.background =
        i % 3 === 0
          ? 'var(--bg-blue)'
          : i % 3 === 1
            ? 'var(--bg-pink)'
            : 'var(--bg-orange)';
      particle.style.borderRadius = '50%';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;

      particle.animate(
        [
          { transform: 'translateY(0px)' },
          { transform: `translateY(${Math.random() * 100 - 50}px)` }
        ],
        {
          duration: Math.random() * 3000 + 2000,
          iterations: Infinity,
          direction: 'alternate'
        }
      );

      container.appendChild(particle);
    }
  }

  onCardMouseEnter(): void {
    this.hoverState.set('hovered');
  }

  onCardMouseLeave(): void {
    this.hoverState.set('normal');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('features_articles.png')) {
      img.src = this.defaultNewsImage;
    }
  }

  onScroll(): void {
    const scrolled = window.pageYOffset;
    const parallax = this.particlesRef?.nativeElement;

    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }

  setEmail(value: string): void {
    this.email.set(value);
  }
}