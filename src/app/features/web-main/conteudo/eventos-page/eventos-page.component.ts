import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { EventosService } from '../../../../core/service/events/eventos.service';
import { BannerVideos } from '../../../../shared/components/banner-videos/banner-videos';
import { DataEvents } from '../../../../core/interface/data-events.interface';
import { eventsList } from '../../../../data/events';

@Component({
  selector: 'app-eventos-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BannerVideos],
  templateUrl: './eventos-page.component.html',
  styleUrl: './eventos-page.component.css'
})
export class EventosPageComponent implements OnInit{
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly eventsService = inject(EventosService);

  dataEvents: DataEvents[] = eventsList;

  public _themeService = 'dark';
  public eventos: any[] = [];
  private typeUrl = 'image';

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })

    this.eventsService.getEventsList().subscribe((resp) => {
      if (resp.data && resp.data.length > 0) {
        this.eventos = resp.data.sort((a: any, b: any) =>
          new Date(a.date_event).getTime() - new Date(b.date_event).getTime()
        );

        this.dataEvents.push(...this.eventos.slice(0, 4).map(evento => ({
          url: evento.url_event,
          type: this.typeUrl,
          title: evento.title,
          description: evento.description,
          rota: evento.url_event
        }))); 
      }
    })
  }
}
