import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../../../core/service/auth/auth.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-security-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalSucessoCadastroComponent],
  templateUrl: './security-user.component.html',
  styleUrl: './security-user.component.css'
})
export class SecurityUserComponent {
  private authService: AuthService = inject(AuthService);
  showModal = false;
  modalTitle: string = '';
  modalMessage: string = '';
  private router = inject(Router);
  userSettingsForm: FormGroup;
  is2FAEnabled = false;
  activeSessions = [
    { id: 1, device: 'Chrome Windows', location: 'São Paulo, BR', lastActive: 'Hoje, 10:23' },
    { id: 2, device: 'Mobile Android', location: 'Rio de Janeiro, BR', lastActive: 'Ontem, 22:11' }
  ];

  constructor(private fb: FormBuilder) {
    this.userSettingsForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator()
    });
  }

  passwordsMatchValidator() {
    return (form: FormGroup) => {
      const password = form.get('newPassword')?.value;
      const confirmPassword = form.get('confirmNewPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
    };
  }

  async toggle2FA() {
    try{
      if(this.is2FAEnabled){
        let qrCode = await this.authService.enable2FA();

        if(qrCode){
          this.modalTitle = 'Autenticação de Dois Fatores Habilitada';
          this.modalMessage = 'A autenticação de dois fatores foi habilitada com sucesso. Use o aplicativo autenticador para escanear o código QR e gerar códigos de verificação.';
          this.showModal = true;
          setTimeout(() => {
            this.showModal = false;
            this.router.navigate(['/']);
          }, 2000);
        }
      }else{
        let is2FADisable = await this.authService.disable2FA();

        if(is2FADisable){
          this.modalTitle = 'Autenticação de Dois Fatores Desabilitada';
          this.modalMessage = 'A autenticação de dois fatores foi desabilitada com sucesso.';
          this.showModal = true;
          this.is2FAEnabled = false;
        }
      }
      
    }catch(error){

    }
  }

  logoutSession(sessionId: number) {
    // Aqui você pode chamar o serviço para encerrar a sessão
    this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
  }

  async onChangePassword() {
    if (this.userSettingsForm.valid && !this.userSettingsForm.errors?.['passwordsMismatch']) {
      try {
        await this.authService.changePassword(this.userSettingsForm.value.newPassword);
  this.modalTitle = 'Sucesso';
  this.modalMessage = 'Senha alterada com sucesso!';
  this.showModal = true;
      } catch (err) {
  this.modalTitle = 'Erro';
  this.modalMessage = 'Erro ao alterar a senha. Tente novamente.';
  this.showModal = true;
      }
    }
  }

  closeModal() {
    this.showModal = false;
  }
}