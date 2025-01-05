import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-cadastro-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-team.component.html',
  styleUrl: './cadastro-team.component.css'
})
export class CadastroTeamComponent {
  equipe = { nome: '', criador: '' };  // Dados do formulário

  // Método de submit para cadastro de equipe
  onSubmit() {
    console.log('Equipe cadastrada:', this.equipe);
    // Lógica para cadastrar a equipe (normalmente envia os dados para um serviço)
  }

  // Método para resetar o formulário
  resetForm(form: NgForm) {
    form.reset();
  }
}
