import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-forgot-passaword',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-passaword.html',
  styleUrl: './forgot-passaword.css'
})
export class ForgotPassaword {
  private authService: AuthService = inject(AuthService);
  step = 1;
  email = '';
  cpf = '';
  dob = '';
  canal = 0;
  code = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  message = '';
  canalSelecionado = 0;
  emailRec = '';
  telefoneRec = '';

  constructor(private router: Router) {}

  // Recuperação por dados pessoais
  async onSubmitDados() {
    this.loading = true;
    this.message = '';
    // Simule validação dos dados
    setTimeout(() => {
      if (this.email && this.cpf && this.dob) {
        this.step = 4; // Vai direto para redefinir senha
        this.message = '';
      } else {
        this.message = 'Dados inválidos. Verifique e tente novamente.';
      }
      this.loading = false;
    }, 1200);
  }

  // Ao clicar em um canal, mostra o campo correspondente
  showCodeForm(canal: number) {
    this.canalSelecionado = canal;
    this.emailRec = '';
    this.telefoneRec = '';
    this.message = '';
    this.step = 10;
  }

  // Envio de código por canal
  async enviarCodigo() {
    try {
      if (this.canalSelecionado !== 1 && this.canalSelecionado !== 2 && this.canalSelecionado !== 3) {
        throw new Error('Canal inválido');
      }
      this.loading = true;

      const isValid = await this.validateData(
        this.canalSelecionado === 1 ? this.emailRec : this.telefoneRec,
        this.canalSelecionado
      );

      if (!isValid) {
        this.loading = false;
        return;
      }

      const isCodeSent = await this.authService.codeSent(this.canalSelecionado, this.canalSelecionado === 1 ? this.emailRec : this.telefoneRec);
      
      if (!isCodeSent) {
        this.message = 'Erro ao enviar o código. Tente novamente.';
        this.loading = false;
        return;
      }

      this.loading = false;
      this.message = `Código enviado via ${this.canalSelecionado}. Verifique seu ${this.canalSelecionado === 1 ? 'e-mail' : 'celular'}.`;
      this.step = 3;
    } catch (error: any) {
      this.message = error.message;
      this.loading = false;
    }
  }

  // Validação do código
  async onSubmitCode() {
    this.loading = true;
    this.message = '';
    setTimeout(() => {
      if (this.code === '123456') {
        this.step = 4; // Vai para redefinir senha
        this.message = '';
      } else {
        this.message = 'Código inválido. Tente novamente.';
      }
      this.loading = false;
    }, 1200);
  }

  // Redefinição de senha
  async onSubmitNovaSenha() {
    this.loading = true;
    this.message = '';
    setTimeout(() => {
      if (this.newPassword && this.newPassword === this.confirmPassword) {
        this.step = 5;
        this.message = '';
      } else {
        this.message = 'As senhas não coincidem.';
      }
      this.loading = false;
    }, 1200);
  }

  async validateData(data: string, canal: number) {
    try {
      let isValid = false;

      if (canal === 1) {
        // Validação de e-mail
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
        if (!isValid) {
          this.message = 'E-mail inválido.';
          return false;
        }
      } else if (canal === 2 || canal === 3) {
        // Validação de telefone (aceita formatos nacionais com ou sem DDD)
        isValid = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(data.replace(/\D/g, ''));
        if (!isValid) {
          this.message = 'Telefone inválido.';
          return false;
        }
      } else {
        this.message = 'Canal inválido.';
        return false;
      }

      this.message = '';
      return true;
    } catch (error) {
      this.message = 'Erro ao validar os dados. Tente novamente.';
      return false;
    }
  }
}
