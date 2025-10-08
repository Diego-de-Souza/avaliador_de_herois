import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
// Removido ng-bootstrap
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';


@Component({
	selector: 'app-banner',
	standalone: true,
	imports: [FormsModule, RouterLink, CommonModule],
	templateUrl: './banner.component.html',
	styleUrl: './banner.component.css'
})
export class BannerComponent {
	private readonly themeService: ThemeService = inject(ThemeService);

	public _themeBanner: string | null = 'dark';

	public images = [
		{
			url: '/img/home/a7.jpg',
			Title: 'Busque seus heróis favoritos',
			Description: 'Conheça mais sobre os heróis.',
			rota: '/webmain/busca_heroes',
			date: 'AUGUST 20',
			MenuDesc: 'The Fantastic Four: First Steps'
		},
		{
			url: '/img/home/a2.jpg',
			Title: 'Artigos inteiros sobre heróis',
			Description: 'Detalhes impressionantes e marcantes.',
			rota: '/busca_heroes',
			date: 'AUGUST 21',
			MenuDesc: 'Eyes Of Wakanda'
		},
		{
			url: '/img/home/a3.png',
			Title: 'Curiosidades do mundo Geek',
			Description: 'Se quer saber mais é só vim ver!',
			rota: '/webmain/conteudo/newsletter',
			date: 'AUGUST 22',
			MenuDesc: 'The Official Marvel Podcast'
		},
		{
			url: '/img/home/a5.jpg',
			Title: 'Games',
			Description: 'Mostre sua força em nossos jogos.',
			rota: '/webmain/games',
			date: 'AUGUST 23',
			MenuDesc: 'How To Read Fantastic Four'
		}
	];

	public activeIndex = 0;
	public progress = 0;

	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = false;
	pauseOnFocus = false;

	// Remover referência ao NgbCarousel

	setActive(index: number) {
		this.activeIndex = index;
		this.progress = ((index + 1) / this.images.length) * 100;
	}

	ngOnInit() {
		this.themeService.theme$.subscribe(theme => {
			this._themeBanner = theme;
		});
		this.progress = ((this.activeIndex + 1) / this.images.length) * 100;
		// Simular carregamento automático do banner
		setInterval(() => {
			this.activeIndex = (this.activeIndex + 1) % this.images.length;
			this.progress = ((this.activeIndex + 1) / this.images.length) * 100;
		}, 5000);
	}

	togglePaused() {
		// Adapte a lógica de pausar/retomar banner para JS puro ou remova se não for necessário
		this.paused = !this.paused;
	}

	// Remover método onSlide e lógica relacionada ao NgbSlideEvent
}
