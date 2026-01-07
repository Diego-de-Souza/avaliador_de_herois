import { Component, ViewChild, ElementRef, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Data, Router, RouterModule } from '@angular/router';
import { DataEvents } from '../../../core/interface/data-events.interface';

@Component({
  selector: 'app-banner-videos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner-videos.html',
  styleUrl: './banner-videos.css'
})
export class BannerVideos implements  OnInit {
  /** Tempo de exibição de vídeos externos (YouTube) em milissegundos */
  private readonly router = inject(Router)
  private readonly sanitizer = inject(DomSanitizer);

  private _dataEvents: DataEvents[] = [];
  @Input()
  set dataEvents(value: DataEvents[]) {
    if (value && value.length) {
      this._dataEvents = value;
      this.medias = value;
      this.activeIndex = 0;
      this.progress = this.medias.length ? ((this.activeIndex + 1) / this.medias.length) * 100 : 0;
      this.startAutoTransition();
    }
  }
  get dataEvents(): DataEvents[] {
    return this._dataEvents;
  }

  public externalVideoDuration = 20000;
  public medias: DataEvents[] = [];

  public activeIndex = 0;
  public progress = 0;
  private intervalId: any;

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;

  ngOnInit() {
    this.startAutoTransition();

    if (!this.medias.length && this.dataEvents && this.dataEvents.length) {
      this.medias = this.dataEvents;
      this.activeIndex = 0;
      this.progress = this.medias.length ? ((this.activeIndex + 1) / this.medias.length) * 100 : 0;
      this.startAutoTransition();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  setActive(index: number) {
    this.activeIndex = index;
    this.progress = ((index + 1) / this.medias.length) * 100;
    this.startAutoTransition();
  }

  startAutoTransition() {
    if (this.intervalId) clearInterval(this.intervalId);
    const current = this.medias[this.activeIndex];
    if (current.type === 'video') {
      if (this.isYouTube(current.url)) {
        // Para YouTube, não há como saber o fim do vídeo, então não faz transição automática
        // ou pode definir um tempo fixo, configurável
        this.intervalId = setInterval(() => {
          this.next();
        }, this.externalVideoDuration);
      } else {
        setTimeout(() => {
          if (this.videoPlayer && this.videoPlayer.nativeElement) {
            this.videoPlayer.nativeElement.currentTime = 0;
            this.videoPlayer.nativeElement.play();
          }
        }, 100);
      }
    } else {
      this.intervalId = setInterval(() => {
        this.next();
      }, 5000);
    }
  }

  isYouTube(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  getSafeYouTubeUrl(url: string): SafeResourceUrl {
    // Extrai o ID do vídeo e monta embed sem controles
    let videoId = '';
    const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([\w-]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
    // controls=0: sem controles, disablekb=1: sem teclado, modestbranding=1: menos branding, fs=0: sem fullscreen, rel=0: sem vídeos relacionados, showinfo=0: sem info, iv_load_policy=3: sem anotações
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&fs=0&rel=0&showinfo=0&iv_load_policy=3`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  onVideoEnded() {
    this.next();
  }

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.medias.length;
    this.progress = ((this.activeIndex + 1) / this.medias.length) * 100;
    this.startAutoTransition();
  }

  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.medias.length) % this.medias.length;
    this.progress = ((this.activeIndex + 1) / this.medias.length) * 100;
    this.startAutoTransition();
  }

  readMore() {
    console.log('Read more clicked for', this.medias[this.activeIndex]);
    const dataMedia = this.medias[this.activeIndex];
    if(dataMedia.type === 'video' && this.isYouTube(dataMedia.url)) {
      window.open(dataMedia.url, '_blank');
    }else{
      this.router.navigate([dataMedia.rota || '/']);
    }
  }
}
