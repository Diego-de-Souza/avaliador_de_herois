import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [NgbCarouselModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
	public themeBanner: string | null = 'dark';
  public images = [
	{
		url: '/img/home/a1.jpg',
		Title: 'Busque seus heróis favoritos',
		Description: 'Conheca mais sobre os herois.',
		rota:'/busca_heroes'
	},
	{
		url: '/img/home/a2.jpg',
		Title: 'Artigos inteiros sobre herois',
		Description: 'Detalhes impressionantes e marcantes.',
		rota: '/busca_heroes'
	},
	{
		url: '/img/home/a3.jpg',
		Title: 'Curiosidades do mundo Geek',
		Description: 'se quer saber mais e so vim ver!',
		rota: '/busca_heroes'
	},
	{
		url: '/img/home/a4.jpg',
		Title: 'Games',
		Description: 'mostre sua forca em nossos jogos.',
		rota: '/busca_heroes'
	}
	];


	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = false;
	pauseOnFocus = false;

	@ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

	ngOnInit() {
		this.updateTheme();
		window.addEventListener('storage', () => this.updateTheme());
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

	updateTheme(){
		this.themeBanner = localStorage.getItem('theme');
		let classTheme = document.getElementById('theme_banner')
		if(this.themeBanner === 'light'){
		  classTheme?.classList.add('light');
		  classTheme?.classList.remove('dark');
		}else{
		  classTheme?.classList.add('dark');
		  classTheme?.classList.remove('light');
		}
	}
}
