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

const INITIAL_NEWS: NewsletterNewsItem[] = [
  {
    title: 'Novo filme dos Vingadores anunciado para 2026',
    description:
      'Marvel confirma novo arco cinematográfico "Avengers: Doomsday" com estreia prevista para 2026 e retorno de personagens icônicos.',
    image: '/img/teste/avengersageofultron_lob_crd_03.jpg',
    link: 'https://www.marvel.com/movies/avengers-doomsday',
    category: 'Filmes',
    date: '25 Jan 2026',
    read_time: '5 min',
    author: 'Marvel Studios'
  },
  {
    title: 'Deadpool 3 bate recordes de bilheteria mundial',
    description:
      'HQ do anti-herói bate recordes históricos e reforça força do personagem fora do cinema com nova série anunciada.',
    image: '/img/teste/avengersdoomsday_lob_crd_02.jpg',
    link: 'https://www.marvel.com/comics/deadpool',
    category: 'HQs',
    date: '24 Jan 2026',
    read_time: '4 min',
    author: 'Comic Geek'
  },
  {
    title: 'Capitã Marvel ganha nova série exclusiva',
    description:
      'Produção chega ao Disney+ com foco em narrativa cósmica e conexões profundas com o Universo Cinematográfico Marvel.',
    image: '/img/teste/avengersendgame_card_0.jpg',
    link: 'https://www.marvel.com/tv-shows',
    category: 'Séries',
    date: '23 Jan 2026',
    read_time: '6 min',
    author: 'Streaming News'
  },
  {
    title: 'Novo jogo do Homem-Aranha promete revolução',
    description:
      'Insomniac Games anuncia sequência com mecânicas inéditas e história que conecta múltiplos universos do herói.',
    image: '/img/teste/features_articles.png',
    link: '#',
    category: 'Games',
    date: '22 Jan 2026',
    read_time: '7 min',
    author: 'Game Master'
  },
  {
    title: 'DC anuncia reboot completo do universo',
    description:
      'Novos filmes e séries prometem trazer personagens clássicos com abordagens modernas e interconectadas.',
    image: '/img/teste/avengersageofultron_lob_crd_03.jpg',
    link: '#',
    category: 'Filmes',
    date: '21 Jan 2026',
    read_time: '8 min',
    author: 'DC Insider'
  },
  {
    title: 'Anime de Attack on Titan ganha final estendido',
    description:
      'Estúdio MAPPA confirma episódios extras para conclusão definitiva da aclamada série de Hajime Isayama.',
    image: '/img/teste/avengersdoomsday_lob_crd_02.jpg',
    link: '#',
    category: 'Anime',
    date: '20 Jan 2026',
    read_time: '5 min',
    author: 'Anime World'
  }
];

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
  readonly newsList = signal<NewsletterNewsItem[]>([]);
  readonly featuresNews = signal<NewsletterNewsItem>(INITIAL_NEWS[0]);
  readonly tabs = signal<Category[]>(NewsletterCategory);
  readonly selectedTab = signal<Category>(NewsletterCategory[0]);

  readonly filteredNewsList = computed(() => {
    const list = this.newsList();
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
        this.newsList.set(processed);
        const first = processed[0];
        if (first) {
          this.featuresNews.set(first);
        }
      },
      error: (error) => {
        console.error('Erro ao buscar notícias:', error);
        this.newsList.set([]); // Define array vazio em caso de erro
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
    }
  }

  loadMore(): void {
    this.loading.set(true);

    setTimeout(() => {
      const current = this.newsList();
      this.newsList.set([...current, ...current]);
      this.loading.set(false);
    }, 1000);
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
