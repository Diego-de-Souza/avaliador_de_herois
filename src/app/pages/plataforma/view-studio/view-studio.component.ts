import { Component, OnInit } from '@angular/core';
import { HeroisService } from '../../../service/herois.service';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';

@Component({
  selector: 'app-view-studio',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-studio.component.html',
  styleUrl: './view-studio.component.css'
})
export class ViewStudioComponent implements OnInit{
  studios: any[] = [];

  constructor(private studiosService: HeroisService) {}

  ngOnInit(): void {
    this.loadStudios();
  }

  loadStudios(): void {
    this.studiosService.getAllStudio().subscribe({
      next: (data) => {
        console.log(data)
        this.studios = data.dadosStudios;
        
      },
      error: (error) => {
        console.error("Erro ao carregar os estúdios", error);
      }
    });
  }

  deleteStudio(id: number): void {
    if (confirm('Tem certeza que deseja excluir este estúdio?')) {
      this.studiosService.deleteOneStudio(id).subscribe({
        next: () => {
          this.loadStudios();
        },
        error: (error) => {
          console.error("Erro ao excluir o estúdio", error);
        }
      });
    }
  }

  editStudio(id: number): void {
    console.log('Editar estúdio com id', id);
    // Redirecionar para o formulário de edição (se você já tiver esse componente/rota configurado)
  }
}
