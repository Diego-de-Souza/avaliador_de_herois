import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { EventosService } from '../../../../core/service/events/eventos.service';

@Component({
  selector: 'app-eventos-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './eventos-page.component.html',
  styleUrl: './eventos-page.component.css'
})
export class EventosPageComponent implements OnInit{
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly eventsService = inject(EventosService);

  public _themeService = 'dark';
  public eventos: any[] = [];

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })

    this.eventsService.getEventsList().subscribe((resp) => {
      if (resp.data && resp.data.length > 0) {
        this.eventos = resp.data.sort((a: any, b: any) =>
          new Date(a.date_event).getTime() - new Date(b.date_event).getTime()
        );
      }
    });
  }

}
