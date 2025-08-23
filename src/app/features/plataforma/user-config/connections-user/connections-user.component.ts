import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-connections-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './connections-user.component.html',
  styleUrl: './connections-user.component.css'
})
export class ConnectionsUserComponent {
  conexoes = {
    google: false,
    facebook: false,
    discord: false
  };

  contasExternas = [
    { id: 1, nome: 'Conta Google' },
    { id: 2, nome: 'Conta Discord' }
  ];

  conectar(rede: string) {
    this.conexoes[rede as keyof typeof this.conexoes] = true;
    // Implemente a lógica real de integração
  }

  desconectar(id: number) {
    this.contasExternas = this.contasExternas.filter(c => c.id !== id);
    // Implemente a lógica real de desvincular
  }
}
