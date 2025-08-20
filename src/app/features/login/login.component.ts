import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/service/user/user.service';
import { ModalSucessoCadastroComponent } from '../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/service/auth/auth.service';
import { MessageService } from '../../core/service/message/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginForm: FormGroup;
  public title:string = '';
  public message: string = '';
  messagefcm: any = null;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private modalService : NgbModal,
    private authService: AuthService,
    private messagingService: MessageService
  ){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.handleLogin();
    }else{
      this.title = 'Login';
      this.message = 'Dados inseridos não conferem com o formato válido ou ausente.'
      this.openModal(this.title, this.message);
    }
  }

  async handleLogin(): Promise<void>{
    try{
      const statusLogin = await this.authService.login(this.loginForm.value);

      if(statusLogin){
        this.title = 'Login';
        this.message = 'Login efetuado com sucesso!'
        this.openModal(this.title, this.message);

        this.messagingService.currentMessage.subscribe(messagefcm => {
          this.messagefcm = messagefcm;
        });

        this.getToken()

        const data = await this.authService.decodeJwt(sessionStorage.getItem('access_token')!);

        if(data){
          if(data.role === "admin"){
            this.router.navigate(['/plataforma']);
          }else{
            this.router.navigate(['/'])
          }
        }else{
          this.router.navigate(['/'])
        }
        
      }
    }catch(error){
      console.error('Erro no login:', error);

      this.title = 'Erro';
      this.message = 'Houve um erro ao tentar realizar o login. Tente novamente.';
      this.openModal(this.title, this.message);
    }
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
    modalRef.componentInstance.modalTitle = title; 
    modalRef.componentInstance.modalMessage = message; 
  }

  requestPermission(): void {
    this.messagingService.requestPermission();
  }

  async getToken(): Promise<void> {
    const token = await this.messagingService.getToken();
    const storedUserId = localStorage.getItem('user_id');
    const user_id = storedUserId ? parseInt(storedUserId) : null;

    if(token !== null  && user_id !== null){
      const sendToken = this.messagingService.sendTokenToServer(token,user_id);
    }else{
      console.warn('Token ou user_id não disponível');
    }
  }
}
