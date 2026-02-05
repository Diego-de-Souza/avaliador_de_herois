import { Component, inject, OnInit } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { Router } from '@angular/router';
import { TeamService } from '../../../../core/service/team/team.service';

@Component({
  selector: 'app-view-team',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-team.component.html',
  styleUrl: './view-team.component.css'
})
export class ViewTeamComponent implements OnInit{
  private readonly teamService = inject(TeamService);
  private readonly router = inject(Router);
  public teams: any[] = [];

  ngOnInit(): void {
      this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (data)=>{
        this.teams = data.data;
      },error: (error)=>{
        console.error("Error ao carregar as Equipes", error);
      }
    })
  }

  deleteTeam(id:number): void{
    if(confirm('Tem certeza que deseja excluir esta Equipe?')){
      this.teamService.deleteOneTeam(id).subscribe({
        next: ()=>{
          this.loadTeams();
        }, error: (error)=>{
          console.error("Erro ao excluir a Equipe", error);
        }
      })
    }
  }

  editTeam(id: number): void {
    this.router.navigate([`/plataforma/cadastro/team/${id}`]);
  }
}
