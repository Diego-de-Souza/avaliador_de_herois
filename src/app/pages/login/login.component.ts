import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../service/user.service';
import { ModalSucessoCadastroComponent } from '../../components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EncryptionUtil } from '../../utils/encryption.utils';
import { AuthService } from '../../service/auth.service';

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

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private modalService : NgbModal,
    private authService: AuthService
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

        const access = localStorage.getItem('role');
        if(access){
          const accessUser = JSON.parse(access || '');
          if(accessUser.access === "root"){
            this.router.navigate(['/cadastro']);
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
}
