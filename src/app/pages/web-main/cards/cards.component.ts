import { Component, Input, OnInit } from '@angular/core';
import { dadosHeroes } from '../../../data/cards';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HeroisService } from '../../../service/herois.service';
import { HeroisModel } from '../../../Model/herois.model';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, HeaderComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {
  cardsHeroes: HeroisModel[] = [];
  @Input() searchResults: any[] = [];

  cardsJson!:any;

  constructor(private route: ActivatedRoute, private searchHeroes: HeroisService) {}

  ngOnInit() {
    this.cardsJson = dadosHeroes;
    // Acessar os parâmetros de consulta (queryParams) da rota
    this.route.queryParams.subscribe(params => {
      const studio = params['studio'];
      const team = params['team'];
      const morality = params['morality'];
      const genre = params['genre'];
      const anoLancamento = params['anoLancamento'];

      if (studio) {
        this.filterByStudio(studio);
      } else if (team) {
        this.filterByTeam(team);
      } else if (morality) {
        this.filterByMorality(morality);
      } else if (genre) {
        this.filterByGenre(genre);
      } else if(anoLancamento){
        this.filterByAnoLancamento(anoLancamento);
      }
    });
  }

  filterByStudio(studio: string) {
    this.searchHeroes.searchHeroesStudio(studio).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByTeam(team: string) {
    this.searchHeroes.searchHeroesTeam(team).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByMorality(morality: string) {
    this.searchHeroes.searchHeroesMorality(morality).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByGenre(genre: string) {
    this.searchHeroes.searchHeroesGenre(genre).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByAnoLancamento(anoLancamento: number) {
    this.searchHeroes.searchHeroesReleaseDate(anoLancamento).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }
}

