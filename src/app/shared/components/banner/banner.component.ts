import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';


@Component({
	selector: 'app-banner',
	standalone: true,
	imports: [NgbCarouselModule, FormsModule, RouterLink, CommonModule],
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
			rota: '/busca_heroes',
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
			url: '/img/home/a3.jpg',
			Title: 'Curiosidades do mundo Geek',
			Description: 'Se quer saber mais é só vim ver!',
			rota: '/busca_heroes',
			date: 'AUGUST 22',
			MenuDesc: 'The Official Marvel Podcast'
		},
		{
			url: '/img/home/a5.jpg',
			Title: 'Games',
			Description: 'Mostre sua força em nossos jogos.',
			rota: '/busca_heroes',
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

	@ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

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
		if (this.paused) {
			this.carousel.cycle();
		} else {
			this.carousel.pause();
		}
		this.paused = !this.paused;
	}

	onSlide(slideEvent: NgbSlideEvent) {
		if (
			this.unpauseOnArrow &&
			slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
		) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}
}
