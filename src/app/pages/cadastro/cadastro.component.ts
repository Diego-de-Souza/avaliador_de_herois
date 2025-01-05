import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  menuAberto: boolean = false;

  constructor(private router: Router) {}

  // Método para navegar para uma rota e abrir o menu superior
  navegar(rota: string) {
    this.menuAberto = true;
    this.router.navigate([`/cadastro/${rota}`]);
  }

  // Método para fechar o menu superior
  fecharMenu() {
    this.menuAberto = false;
    this.router.navigate(['/cadastro']);
  }
}
