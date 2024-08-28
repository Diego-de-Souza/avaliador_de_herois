import { Component, Input, OnInit } from '@angular/core';
import { dadosHeroes } from '../../data/cards';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HeroisService } from '../../service/herois.service';
import { HeroisModel } from '../../Model/herois.model';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {
  cardsHeroes: HeroisModel[] = [];
  @Input() searchResults: any[] = [];

  constructor(private route: ActivatedRoute, private searchHeroes: HeroisService) {}

  ngOnInit() {
    // Acessar os parâmetros de consulta (queryParams) da rota
    this.route.queryParams.subscribe(params => {
      const editora = params['editora'];
      const equipe = params['team'];
      const origem = params['origin'];
      const moralidade = params['morality'];
      const sexo = params['sexy'];
      const anoLancamento = params['anoLancamento'];

      if (editora) {
        this.filterByEditora(editora);
      } else if (equipe) {
        this.filterByEquipe(equipe);
      } else if (origem) {
        this.filterByOrigem(origem);
      } else if (moralidade) {
        this.filterByMoralidade(moralidade);
      } else if (sexo) {
        this.filterBySexo(sexo);
      } else if(anoLancamento){
        this.filterByAnoLancamento(sexo);
      }
    });
  }

  filterByEditora(editora: number) {
    this.searchHeroes.searchHeroesPublisher(editora).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByEquipe(equipe: string) {
    this.searchHeroes.searchHeroesTeam(equipe).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByOrigem(origem: string) {
    this.searchHeroes.searchHeroesOrigin(origem).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByMoralidade(moralidade: string) {
    this.searchHeroes.searchHeroesMorality(moralidade).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterBySexo(sexo: string) {
    this.searchHeroes.searchHeroesSexy(sexo).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

  filterByAnoLancamento(anoLancamento: number) {
    this.searchHeroes.searchHeroesReleaseDate(anoLancamento).subscribe({
      next: (data) => {
        this.cardsHeroes = data;
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }
}

