import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeroisService } from '../../../service/herois.service';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-description-heroes',
  standalone: true,
  imports:[ HeaderComponent],
  templateUrl: './description-heroes.component.html',
  styleUrls: ['./description-heroes.component.css'],
  
})
export class DescriptionHeroesComponent implements OnInit {
  public selectedCard: any;
  public heroId:any;

  public testeHero: any;

  constructor(private route: ActivatedRoute, private heroService: HeroisService) {}

  ngOnInit() {
    this.selectedCard = history.state.selectedCard;
    this.route.paramMap.subscribe(params =>{
      const idParam = params.get('id');
      
      if(idParam){
        this.heroId = Number(idParam);
        this.heroService.getDataHero(this.heroId).subscribe((response) =>{
          const userFromDB = {
            name: response.data.name,
            morality: response.data.morality,
            studio: response.data.studio,
            power_type: response.data.power_type,
            release_date: response.data.release_date,
            first_appearance: response.data.first_appearance,
            creator: response.data.creator,
            weak_point: response.data.weak_point,
            imagem: response.data.imagem,
            imagem_cover: response.data.imagem_cover,
            team: response.data.team,
            affiliation: response.data.affiliation,
            story: response.data.story,
            genre: response.data.genre
          };

          // Preenche o formulário com os dados do usuário
          this.testeHero.patchValue(userFromDB);
        },
        (error) =>{
          console.log('Erro ao buscar dados do Herói');
        });
      }
    })
  }
}
