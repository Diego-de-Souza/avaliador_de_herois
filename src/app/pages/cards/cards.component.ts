import { Component, Input, OnInit } from '@angular/core';
import { dadosHeroes } from '../../data/cards';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {
  cardsHeroes!: any;
  @Input() searchResults: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.cardsHeroes = dadosHeroes;
  }

  navigateToDescription(card: any) {
    this.router.navigate(['/descriptionHeroes'], {
      state: { selectedCard: card }
    });
  }
}
