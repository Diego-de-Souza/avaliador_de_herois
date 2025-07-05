import { Component } from '@angular/core';
import { CuriosityService } from '../../../../core/service/curiosities/curiosity.service';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-curiosidades',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule],
  templateUrl: './view-curiosidades.component.html',
  styleUrl: './view-curiosidades.component.css'
})
export class ViewCuriosidadesComponent {
  public isList: boolean = false;
    public curiosities: any[] = [];
  
    constructor(
      private curiositiesService: CuriosityService
    ) { }
  
    ngOnInit(): void {
      this.curiositiesService.getCuriositiesList().subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            this.curiosities = response.curiosities;
            console.log('Curiosidades carregadas com sucesso:', response);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar curiosidades:', error);
        }
      })
    }
  
    editArtigos(article_id: number) {
  
    }
  
    deleteArtigos(article_id: number) {
  
    }
}
