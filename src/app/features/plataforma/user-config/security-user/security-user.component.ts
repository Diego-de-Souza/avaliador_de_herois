import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../../../core/service/auth/auth.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { ModalQrcode } from '../../../../shared/components/modal-qrcode/modal-qrcode';
import { ToastService } from '../../../../core/service/toast/toast.service';
import { ActiveSession } from '../../../../core/interface/session.interface';

@Component({
  selector: 'app-security-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalSucessoCadastroComponent, ModalQrcode],
  templateUrl: './security-user.component.html',
  styleUrl: './security-user.component.css'
})
export class SecurityUserComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  showModal = false;
  modalTitle: string = '';
  modalMessage: string = '';
  showQrModal = false;

  qrCodeUrl: string = '';
  private router = inject(Router);
  userSettingsForm: FormGroup;
  is2FAEnabled = false;
  activeSessions: ActiveSession[]= [] ;

  isLoggingOutAll = false;

  ngOnInit() {
    this.getdataSecurityUser();

    this.loadActiveSessions();
  }

  constructor(private fb: FormBuilder) {
    this.userSettingsForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator()
    });
  }

  async getdataSecurityUser() {
    try{
      const type = 'security';
      const userDataSecurity = await this.authService.getUserSettings(type);
      this.is2FAEnabled = userDataSecurity[0]?.totp_enabled || false;
    }catch(error){

    }
  }
  
  passwordsMatchValidator() {
    return (form: FormGroup) => {
      const password = form.get('newPassword')?.value;
      const confirmPassword = form.get('confirmNewPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
    };
  }

  async toggle2FA() {
    try {
      if (this.is2FAEnabled) {
        const qrCodeUrl = await this.authService.enable2FA();
        if (qrCodeUrl) {
          this.modalTitle = 'Autenticação de Dois Fatores Habilitada';
          this.modalMessage = 'Use o aplicativo autenticador para escanear o QR Code abaixo e concluir a configuração.';
          this.qrCodeUrl = qrCodeUrl;
          this.showQrModal = true;
        }
      } else {
        let is2FADisable = await this.authService.disable2FA();
        if (is2FADisable) {
          this.modalTitle = 'Autenticação de Dois Fatores Desabilitada';
          this.modalMessage = 'A autenticação de dois fatores foi desabilitada com sucesso.';
          this.showModal = true;
          this.is2FAEnabled = false;
        }
      }
    } catch (error) {
      // Tratar erro se necessário
    }
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

  closeQrModal() {
    this.showQrModal = false;
     this.is2FAEnabled = true;
  }

  async loadActiveSessions() {
    try {
      const sessions = await this.authService.getActiveSessions();

      if (sessions && sessions.status === 200 && sessions.sessions) {
        this.activeSessions = sessions.sessions.map((session: ActiveSession) => ({
          ...session,
          id: session.id.toString(), 
          isCurrent: session.isCurrent || false,
          isLoggingOut: false
        }));
        
      } else {
        console.warn('⚠️ Resposta da API inválida:', sessions);
        this.activeSessions = [];
      }
    } catch (error) {
      console.error('Erro ao carregar sessões ativas:', error);
    }
  }

  async logoutAllSessions() {
    if (this.activeSessions.length <= 1) {
      return; 
    }

    const confirmLogout = confirm(
      `Tem certeza que deseja encerrar todas as outras ${this.activeSessions.length - 1} sessões? ` +
      'Você permanecerá logado apenas nesta sessão atual.'
    );
    
    if (!confirmLogout) {
      return;
    }

    this.isLoggingOutAll = true;

    try {
      const response = await this.authService.logoutAllSessions();
      
      if (response.status === 200) {
        this.toastService.success('Todas as outras sessões foram encerradas com sucesso.');
        this.router.navigate(['/login']);
      } else {
        this.toastService.error('Houve um erro ao encerrar as sessões. Tente novamente.');
        throw new Error(response.message || 'Erro ao encerrar sessões');
      }
    } catch (error) {
      console.error('Erro ao encerrar todas as sessões:', error);
      this.toastService.error('Houve um erro ao encerrar as sessões. Tente novamente.');
    } finally {
      this.isLoggingOutAll = false;
    }
  }

  async logoutSession(sessionId: string) {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (session) {
      session.isLoggingOut = true;
    }

    try {
      const response = await this.authService.logoutSession(sessionId);
      
      if (response && response.status === 200) {
        this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
        
        this.modalTitle = 'Sucesso';
        this.modalMessage = 'Sessão encerrada com sucesso.';
        this.showModal = true;
      } else {
        // throw new Error(response.error || 'Erro ao encerrar sessão');
      }
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      this.modalTitle = 'Erro';
      this.modalMessage = 'Houve um erro ao encerrar a sessão. Tente novamente.';
      this.showModal = true;
      
      if (session) {
        session.isLoggingOut = false;
      }
    }
  }
}