// ...existing code...
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { ModalValidate } from '../../../shared/components/modal-validate/modal-validate';

@Component({
  selector: 'app-validate-two-fa',
  imports: [CommonModule, FormsModule, ModalValidate],
  templateUrl: './validate-two-fa.html',
  styleUrl: './validate-two-fa.css'
})
export class ValidateTwoFa implements OnInit{
  private authService: any = inject(AuthService);
  private router = inject(Router);
  private readonly themeService = inject(ThemeService);
  code: string = '';
  digits: string[] = Array(6).fill('');
  title: string = '';
  message: string = '';
  loading = false;
  role: string | null = null;
  _themeAll: string = "dark";
  typeCode:number = 0;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    let role = navigation?.extras.state?.['role'];
    if (!role) {
      role = sessionStorage.getItem('role');
    }
    if (!role) {
      this.router.navigate(['/login']);
      return;
    }
    this.role = role;
  }

  async validate(codeFromModal?: string) {
    const code = codeFromModal ?? this.code;
    try {
      if (code.length !== 6 && code.length !== 9) {
        this.message = 'Por favor, insira um código válido.';
        return;
      }
      this.loading = true;
      if (!this.authService || !this.authService.validate2FA) {
        this.message = 'Erro interno: serviço de autenticação não disponível.';
        this.loading = false;
        return;
      }
      const res = await this.authService.validate2FA(code);
      if (res && (res.status === 401 || res.status === 400)) {
        this.message = res.message || 'Código inválido ou expirado.';
        this.loading = false;
        return;
      }
      this.message = 'Código validado com sucesso!';
      this.loading = false;
      if (this.role === 'admin') {
        this.router.navigate(['/plataforma']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.message = error?.message || 'Ocorreu um erro ao validar o código.';
      this.loading = false;
    }
  }
  
  onDigitInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 1) value = value[0];
    this.digits[index] = value;
    this.updateCode();
    // Atualiza o valor do input manualmente para evitar duplicidade
    input.value = value;
    // Navega para o próximo campo se digitou algo
    if (value && index < 5) {
      setTimeout(() => {
        const inputs = document.querySelectorAll('.mfa-digit');
        const nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      });
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (this.digits[index] === '' && index > 0) {
        const prevInput = input.parentElement!.querySelectorAll('input')[index - 1];
        if (prevInput) prevInput.focus();
      }
    }
  }

  updateCode() {
    this.code = this.digits.join('');   
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  async sendCode(canal: string) {
    if (canal === 'email') this.typeCode = 1;
    else if (canal === 'sms') this.typeCode = 2;
    else if (canal === 'whatsapp') this.typeCode = 3;
    try {
      const res = await this.authService.generateCodeMFA(
        canal === 'email' ? 1 : canal === 'sms' ? 2 : canal === 'whatsapp' ? 3 : 0
      );
      this.title = res;
      this.message = `Código enviado via ${canal}. Por favor, verifique seu ${canal === 'email' ? 'e-mail' : 'celular'}.`;
    } catch (err: any) {
      this.title = 'Erro';
      this.message = err?.message || `Erro ao enviar código via ${canal}.`;
    }
  }

  async validateCodeMFA(codeFromModal?: string) {
    const code = codeFromModal ?? this.code;
    try {
      if (code.length !== 9) {
        this.message = 'Por favor, insira um código válido.';
        return;
      }
      this.loading = true;
      if (!this.authService || !this.authService.validateCodeMFA) {
        this.message = 'Erro interno: serviço de autenticação não disponível.';
        this.loading = false;
        return;
      }
      const res = await this.authService.validateCodeMFA(code, this.typeCode);
      if (res && (res.status === 401 || res.status === 400)) {
        this.message = res.message || 'Código inválido ou expirado.';
        this.loading = false;
        return;
      }
      this.message = 'Código validado com sucesso!';
      this.loading = false;
      if (this.role === 'admin') {
        this.router.navigate(['/plataforma']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.message = error?.message || 'Ocorreu um erro ao validar o código.';
      this.loading = false;
    }
  }
}
