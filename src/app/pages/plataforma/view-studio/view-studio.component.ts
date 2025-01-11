import { Component, OnInit } from '@angular/core';
import { HeroisService } from '../../../service/herois.service';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-studio',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-studio.component.html',
  styleUrl: './view-studio.component.css'
})
export class ViewStudioComponent implements OnInit{
  public studios: any[] = [];

  constructor(private studiosService: HeroisService, private router : Router) {}

  ngOnInit(): void {
    this.loadStudios();
  }

  loadStudios(): void {
    this.studiosService.getAllStudio().subscribe({
      next: (data) => {
        console.log(data)
        this.studios = data.data;
        
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
    console.log("entrou correto");
    console.log("id da rota: "+id);
    this.router.navigate([`/cadastro/studio/${id}`]);
  }
}
