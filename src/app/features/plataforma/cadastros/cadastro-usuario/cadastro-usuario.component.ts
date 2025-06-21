import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../../core/service/user/user.service';
import { faCalendarDays, faCircleCheck, faCity, faEnvelope, faMap, faMapLocationDot, faSignsPost, faUserTag, faVihara, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { EncryptionUtil } from '../../../../shared/utils/encryption.utils';
import { CepService } from '../../../../core/service/cep/cep.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, HeaderPlatformComponent, RouterLink, RouterLinkActive,],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent{
    cadastroForm: FormGroup;
    title: string = '';
    message:string = '';
    isRegister: Boolean = false;

    public isEditMode: boolean = false; 
    public userId: number | null = null; 
    public isMenuNav: boolean = false;

    faUser = faUser;
    faUserTag = faUserTag;
    faCalendarDays = faCalendarDays;
    faEnvelope = faEnvelope;
    faMapLocationDot = faMapLocationDot;
    faCircleCheck = faCircleCheck;
    faMap = faMap;
    faSignsPost = faSignsPost;
    faCity = faCity;
    faVihara = faVihara;
    faLock = faLock;
  
    constructor(
      private userService: UserService, 
      private fb : FormBuilder,
      private cepService: CepService,
      private modalService: NgbModal
    ){
      // Inicializar o FormGroup no construtor
      this.cadastroForm = this.fb.group(
        {
          fullname: ['', [Validators.required, Validators.minLength(3)]],
          nickname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          birthdate: ['', Validators.required],
          firstemail: ['', [Validators.required, Validators.email]],
          secondemail: ['', [Validators.email]],
          uf: ['', [Validators.required, Validators.maxLength(3)]],
          address: ['', Validators.required],
          complement: [''],
          cep: ['', Validators.required],
          state: ['', Validators.required],
          city: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        },
        { validator: this.passwordsMatchValidator } // Adiciona o validador aqui
      );
    }

    private passwordsMatchValidator(formGroup: FormGroup): null | object {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
    
      return password === confirmPassword ? null : { passwordsMismatch: true };
    }
    
  
    isFieldInvalid(field: string): boolean {
      const control = this.cadastroForm.get(field);
      return control ? control.invalid && (control.touched || control.dirty) : false;
    }
    
    getPasswordError(): boolean {
      return (
        this.cadastroForm.hasError('passwordsMismatch') && 
        !!this.cadastroForm.get('confirmPassword')?.touched
      );
    }
    
  
    onSubmit() {
      if (this.cadastroForm.valid) {
        const userData = this.cadastroForm.value;

        userData.password = EncryptionUtil.encrypt(userData.password);
        userData.confirmPassword = undefined; 

        // Enviar o FormData na requisição de registro
        this.userService.postRegisterUser(userData).subscribe(
          (response) => {
            console.log('Usuário cadastrado com sucesso:', response);
            this.title = 'Cadastro de Usuario';
            this.message = 'Cadastro realizado com sucesso!';
            this.openModal(this.title, this.message);

           this.clearForm();
          },(error) => {
            this.title = 'Cadastro de Usuario';
            this.message = 'Hove uma falha no cadastro dos dados do Usuario.';
            this.openModal(this.title, this.message);
          }
        );
  
      } else {
        this.title = 'Formulário Inválido';
        this.message = 'Algum dos dados do formulário é inválido ou está ausente.';
        this.openModal(this.title, this.message);
        console.log('Formulário Inválido');
      }
    }
  
    buscarEndereco() {
      const cep = this.cadastroForm.get('cep')?.value;
      
      console.log("CEP digitado:", cep);
      // Verificar se o CEP tem o formato correto e enviar para o serviço
      if (cep && /^\d{8}$/.test(cep)) {
        this.cepService.buscarCep(cep).subscribe(
          (dados) => {
            if (dados && !dados.erro) {
              this.cadastroForm.patchValue({
                address: dados.logradouro,
                complement: dados.complemento,
                city: dados.localidade,
                state: dados.estado,
                uf: dados.uf
              });
              console.log(this.cadastroForm)
            } else {
              alert('CEP não encontrado.');
            }
          },
          (error) => {
            console.error('Erro ao buscar o endereço:', error);
            alert('Erro ao buscar o endereço. Tente novamente.');
          }
        );
      } else {
        alert('Por favor, insira um CEP válido');
      }
    }
  
    openModal(title: string, message: string) {
      const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
      modalRef.componentInstance.modalTitle = title; 
      modalRef.componentInstance.modalMessage = message; 
    }

    clearForm() {
      this.cadastroForm.reset(); 
    }
}
