import { Component, OnInit } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-heroes',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-heroes.component.html',
  styleUrl: './view-heroes.component.css'
})
export class ViewHeroesComponent implements OnInit{
  public heroes: any[] = [];

  constructor(private heroesService: HeroisService, private router: Router){}

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void{
    this.heroesService.getAllHeroes().subscribe({
      next: (data)=>{
        console.log(data);
        this.heroes = data.data;
      },error:(error)=>{
        console.error("Erro ao carregar os heróis", error);
      }
    });
  }

  deleteHeroes(id: number): void {
    if(confirm('Tem certeza que deseja excluir este herói?')){
      this.heroesService.deleteOneHero(id).subscribe({
        next: (data)=>{
          this.loadHeroes();
        },error:(error)=>{
          console.error("Erro ao excluir o herói", error);
        }
      })
    }
  }

  editHeroes(id: number): void {
    this.router.navigate([`/cadastro/heroi/${id}`]);
  }
}
