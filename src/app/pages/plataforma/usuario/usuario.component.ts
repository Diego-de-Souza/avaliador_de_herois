import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  constructor(private router: Router) {}

  logout() {
    // Remover informações da sessão (se necessário)
    // Exemplo: localStorage.clear(); sessionStorage.clear();
    
    // Redirecionar para a página inicial
    this.router.navigate(['/']);
  }
}
