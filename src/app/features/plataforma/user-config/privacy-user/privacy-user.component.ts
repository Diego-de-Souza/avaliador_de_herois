import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-privacy-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './privacy-user.component.html',
  styleUrl: './privacy-user.component.css'
})
export class PrivacyUserComponent {
  privacidade = {
    compartilharDados: true,
    visibilidade: 'publico'
  };

  exclusaoConfirmada = false;

  confirmarExclusao() {
    this.exclusaoConfirmada = true;
  }

  excluirConta() {
    // Implemente a lógica de exclusão de conta
    this.exclusaoConfirmada = false;
  }
}
