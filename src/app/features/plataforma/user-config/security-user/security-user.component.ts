import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-security-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './security-user.component.html',
  styleUrl: './security-user.component.css'
})
export class SecurityUserComponent {
  private authService: AuthService = inject(AuthService);
  private modalService: NgbModal = inject(NgbModal);
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

  toggle2FA() {
    // Aqui você pode chamar o serviço para ativar/desativar 2FA
  }

  logoutSession(sessionId: number) {
    // Aqui você pode chamar o serviço para encerrar a sessão
    this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
  }

  async onChangePassword() {
    if (this.userSettingsForm.valid && !this.userSettingsForm.errors?.['passwordsMismatch']) {
      try {
        await this.authService.changePassword(this.userSettingsForm.value.newPassword);
        this.openModal('Sucesso', 'Senha alterada com sucesso!');
      } catch (err) {
        this.openModal('Erro', 'Erro ao alterar a senha. Tente novamente.');
      }
    }
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent);
    modalRef.componentInstance.modalTitle = title;
    modalRef.componentInstance.modalMessage = message;
  }
}