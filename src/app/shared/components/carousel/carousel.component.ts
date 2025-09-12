import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgbCarouselModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
	public themeBanner: string | null = 'dark';

  @Input() images: {
    url: string,
    title: string,
    description: string,
    route: string
  }[] = [];

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
		let classTheme = document.getElementById('theme_carousel')
		if(this.themeBanner === 'light'){
		  classTheme?.classList.add('light');
		  classTheme?.classList.remove('dark');
		}else{
		  classTheme?.classList.add('dark');
		  classTheme?.classList.remove('light');
		}
	}
}
