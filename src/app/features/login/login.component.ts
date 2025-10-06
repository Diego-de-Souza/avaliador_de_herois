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
    // Inicializa GIS uma única vez e define o callback global
    (window as any).handleCredentialResponse = (response: any) => {
      // Recebe o token JWT do Google e envia para o backend
      this.checkPermission(response.credential);
    };

    google.accounts.id.initialize({
      client_id: environment.ID_CLIENTE_GOOGLE,
      callback: (window as any).handleCredentialResponse
    });
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

  signInWithGoogle(): void {
    if (window.hasOwnProperty('google') && google.accounts && google.accounts.id) {
      google.accounts.id.prompt();
    } else {
      this.title = 'Erro';
      this.message = 'O serviço do Google não está disponível. Tente recarregar a página.';
      this.openModal(this.title, this.message);
    }
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
