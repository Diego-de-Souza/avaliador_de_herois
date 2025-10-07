import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/service/user/user.service';
import { ModalSucessoCadastroComponent } from '../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { AuthService } from '../../core/service/auth/auth.service';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public title: string = '';
  public message: string = '';
  public user: any = null;
  messagefcm: any = null;
  private isGoogleInitialized = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    // Limpar estado anterior
    this.clearGoogleState();

    // Aguardar o Google carregar completamente
    if (typeof google === 'undefined') {
      setTimeout(() => this.initializeGoogleSignIn(), 100);
      return;
    }

    // Inicializar com configurações específicas
    try {
      google.accounts.id.initialize({
        client_id: environment.ID_CLIENTE_GOOGLE,
        callback: (response: any) => this.checkPermission(response.credential),
        auto_select: false, // Não selecionar automaticamente
        cancel_on_tap_outside: false, // Não cancelar ao clicar fora
        use_fedcm_for_prompt: false // Desabilitar FedCM
      });
      
      this.isGoogleInitialized = true;
      console.log('✅ Google Sign-In inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar Google Sign-In:', error);
    }
  }

  private clearGoogleState(): void {
    try {
      // Remover cookies e storage do Google
      document.cookie = 'g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('google_auto_select');
      
      // Remover iframes do Google existentes
      const googleIframes = document.querySelectorAll('iframe[src*="google"], iframe[src*="gstatic"]');
      googleIframes.forEach(iframe => iframe.remove());
      
      console.log('🧹 Estado do Google limpo');
    } catch (error) {
      console.error('Erro ao limpar estado:', error);
    }
  }

  signInWithGoogle(): void {
    if (!this.isGoogleInitialized) {
      this.title = 'Erro';
      this.message = 'Google ainda não foi carregado. Aguarde um momento e tente novamente.';
      this.openModal(this.title, this.message);
      return;
    }

    try {
      // Limpar estado antes de tentar novamente
      this.clearGoogleState();
      
      // Aguardar um pouco e tentar
      setTimeout(() => {
        // Forçar o prompt do Google
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log('❌ Prompt não foi exibido:', notification.getNotDisplayedReason());
            
            // Se não conseguir via prompt, tentar via renderButton
            this.fallbackGoogleLogin();
          } else if (notification.isSkippedMoment()) {
            console.log('⏭️ Usuário pulou o momento');
          } else if (notification.isDismissedMoment()) {
            console.log('❌ Usuário dispensou');
          }
        });
      }, 200);
      
    } catch (error) {
      console.error('❌ Erro no signInWithGoogle:', error);
      this.title = 'Erro';
      this.message = 'Erro ao iniciar login com Google. Recarregue a página e tente novamente.';
      this.openModal(this.title, this.message);
    }
  }

  private fallbackGoogleLogin(): void {
    // Criar botão temporário para forçar login
    const tempButtonContainer = document.createElement('div');
    tempButtonContainer.style.position = 'absolute';
    tempButtonContainer.style.top = '-1000px';
    tempButtonContainer.style.left = '-1000px';
    document.body.appendChild(tempButtonContainer);

    try {
      google.accounts.id.renderButton(tempButtonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard'
      });

      // Simular clique no botão
      setTimeout(() => {
        const googleButton = tempButtonContainer.querySelector('div[role="button"]') as HTMLElement;
        if (googleButton) {
          googleButton.click();
        }
        // Remover elemento temporário
        document.body.removeChild(tempButtonContainer);
      }, 100);
      
    } catch (error) {
      console.error('❌ Erro no fallback:', error);
      document.body.removeChild(tempButtonContainer);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.handleLogin();
    } else {
      this.title = 'Login';
      this.message = 'Dados inseridos não conferem com o formato válido ou ausente.';
      this.openModal(this.title, this.message);
    }
  }

  async handleLogin(): Promise<void> {
    try {
      const login = await this.authService.login(this.loginForm.value);
      if (login.status) {
        this.title = 'Login';
        this.message = 'Login efetuado com sucesso!';
        this.openModal(this.title, this.message);

        const data = await this.authService.decodeJwt(sessionStorage.getItem('access_token')!);

        if (login.has_totp) {
          sessionStorage.setItem('role', data.role);
          this.router.navigate(['/validate-two-fa'], { state: { role: data.role } });
        }else{
          if (data) {
            if (data.role === 'admin') {
              this.router.navigate(['/plataforma']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.router.navigate(['/']);
          }
        }
        
      }
    } catch (error) {
      this.title = 'Erro';
      this.message = 'Houve um erro ao tentar realizar o login. Tente novamente.';
      this.openModal(this.title, this.message);
    }
  }

  showSuccessModal = false;
  modalTitle = '';
  modalMessage = '';

  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  async checkPermission(idToken: string) {
    try {
      const statusLogin = await this.authService.validateGoogleLogin(idToken);
      if (statusLogin) {
        this.title = 'Login';
        this.message = 'Login efetuado com sucesso!';
        this.openModal(this.title, this.message);

        const data = await this.authService.decodeJwt(sessionStorage.getItem('access_token')!);

        if (data) {
          if (data.role === 'admin') {
            this.router.navigate(['/plataforma']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.router.navigate(['/']);
        }
      }
    } catch (error) {
      this.title = 'Erro';
      this.message = 'Houve um erro ao validar o login do Google. Tente novamente.';
      this.openModal(this.title, this.message);
    }
  }
}
