import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router
  ){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      const { email, password } = this.loginForm.value;

      // Verificação das credenciais para acesso
      if (email === 'admin@admin.com.br' && password === 'admin123') {
        console.log('Credenciais de admin detectadas. Redirecionando...');
        this.router.navigate(['/cadastro']); // Redireciona para uma página específica, se necessário.
        return; // Impede que prossiga para o envio ao backend.
      }

      // //Criar FormData para envio
      // const formData = new FormData();

      // // Percorrer os valores do formulários e adiciona-los ao formData
      // Object.keys(this.loginForm.value).forEach((key)=>{
      //   formData.append(key, this.loginForm.value[key]);
      // });

      // this.userService.postLogin(formData).subscribe((response)=>{
      //   console.log('Login realizado com sucesso:', response);

      //   // Redirecionar para a tela de usuários
      //   this.router.navigate(['/cadastro']); 
      // },
      // (error)=>{
      //   console.log('Erro no login');
      // });
    }else{
      console.log("Formulário Inválido");
    }
  }
}
