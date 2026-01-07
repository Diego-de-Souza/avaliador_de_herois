import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/service/user/user.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/service/toast/toast.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink, 
    RouterLinkActive, 
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  public loginForm: FormGroup;
  public user: any = null;
  messagefcm: any = null;
  private isGoogleInitialized = false;

  constructor(
    private fb: FormBuilder,
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
    } catch (error) {
      console.error('Erro ao limpar estado:', error);
    }
  }

  signInWithGoogle(): void {
    if (!this.isGoogleInitialized) {
      this.toastService.error('Google ainda não foi carregado. Aguarde um momento e tente novamente.');
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
      this.toastService.error('Houve um erro ao tentar o login com o Google. Tente novamente.');
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
      this.toastService.warning('Dados inseridos não conferem com o formato válido ou estão ausentes.');
    }
  }

  async handleLogin(): Promise<void> {
    try {
      const login = await this.authService.login(this.loginForm.value);
      if (login.status) {
        this.toastService.success('Login efetuado com sucesso!');

        const data = await this.authService.getUser()

        if (login.has_totp) {
          sessionStorage.setItem('role', data.role);
          this.router.navigate(['/validate-two-fa'], { state: { role: data.role } });
        }else{
          if (data) {
            if (data.role === 'admin' || data.role === 'root') {
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
      this.toastService.error('Houve um erro ao efetuar o login. Verifique suas credenciais e tente novamente.', 'error');
    }
  }

  async checkPermission(idToken: string) {
    try {
      const statusLogin = await this.authService.validateGoogleLogin(idToken);
      if (statusLogin) {
        this.toastService.success('Login efetuado com sucesso!');

        const data = await this.authService.getUser();

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
      this.toastService.error('Houve um erro ao validar o login do Google. Tente novamente.');
    }
  }
}
