import { Component, OnInit } from '@angular/core';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';
import { HeroisService } from '../../../service/herois.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-team',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-team.component.html',
  styleUrl: './view-team.component.css'
})
export class ViewTeamComponent implements OnInit{
  public teams: any[] = [];

  constructor(private teamsService: HeroisService, private router: Router){}

  ngOnInit(): void {
      this.loadTeams();
  }

  loadTeams(): void {
    this.teamsService.getAllTeam().subscribe({
      next: (data)=>{
        this.teams = data.data;
      },error: (error)=>{
        console.error("Error ao carregar as Equipes", error);
      }
    })
  }

  deleteTeam(id:number): void{
    if(confirm('Tem certeza que deseja excluir esta Equipe?')){
      this.teamsService.deleteOneTeam(id).subscribe({
        next: ()=>{
          this.loadTeams();
        }, error: (error)=>{
          console.error("Erro ao excluir a Equipe", error);
        }
      })
    }
  }

  editTeam(id: number): void {
    this.router.navigate([`/cadastro/team/${id}`]);
  }
}
