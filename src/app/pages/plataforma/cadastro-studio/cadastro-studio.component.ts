import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';

@Component({
  selector: 'app-cadastro-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-studio.component.html',
  styleUrl: './cadastro-studio.component.css'
})
export class CadastroStudioComponent {
  // Modelo de dados do studio
  studio = {
    name: '',
    nationality: '',
    history: '',
  };

  // Método para salvar o estúdio
  onSubmit() {
    console.log('Dados do Studio:', this.studio);
    alert('Studio cadastrado com sucesso!');
    this.clearForm();
  }

  // Método para cancelar e limpar o formulário
  onCancel() {
    const confirmCancel = confirm('Tem certeza que deseja cancelar?');
    if (confirmCancel) {
      this.clearForm();
    }
  }

  // Limpa os dados do formulário
  clearForm() {
    this.studio = {
      name: '',
      nationality: '',
      history: '',
    };
  }
}
