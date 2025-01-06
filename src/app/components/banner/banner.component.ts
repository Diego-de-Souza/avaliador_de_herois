import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [NgbCarouselModule, FormsModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  public images = [
	{
		url: 'assets/img/home/a1.jpg',
		Title: 'Busque seus heróis favoritos',
		Description: 'Conheca mais sobre os herois.'
	},
	{
		url: 'assets/img/home/a2.jpg',
		Title: 'Artigos inteiros sobre herois',
		Description: 'Detalhes impressionantes e marcantes.'
	},
	{
		url: 'assets/img/home/a3.jpg',
		Title: 'Curiosidades do mundo Geek',
		Description: 'se quer saber mais e so vim ver!'
	},
	{
		url: 'assets/img/home/a4.jpg',
		Title: 'Games',
		Description: 'mostre sua forca em nossos jogos.'
	}
	];


	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = false;
	pauseOnFocus = false;

	@ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

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
