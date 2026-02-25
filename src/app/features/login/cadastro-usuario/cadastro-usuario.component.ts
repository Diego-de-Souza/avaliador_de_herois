import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderPlatformComponent } from '../../../shared/components/header-platform/header-platform.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../core/service/user/user.service';
import { faCalendarDays, faCircleCheck, faCity, faEnvelope, faMap, faMapLocationDot, faSignsPost, faUserTag, faVihara, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { CepService } from '../../../core/service/cep/cep.service';
import { CpfMaskDirective } from '../../../core/directive/cpf-mask.directive';
import { CepMaskDirective } from '../../../core/directive/cep-mask.directive';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    CommonModule, 
    ReactiveFormsModule, 
    HeaderPlatformComponent, 
    RouterLink, 
    RouterLinkActive, 
    CpfMaskDirective,
    CepMaskDirective
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
    cadastroForm: FormGroup;
    title: string = '';
    message: string = '';
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

    showSuccessModal = false;
    modalTitle = '';
    modalMessage = '';
  
    constructor(
      private userService: UserService, 
      private fb: FormBuilder,
      private cepService: CepService,
      private router: Router
    ) {
      this.cadastroForm = this.fb.group(
        {
          fullname: ['', [Validators.required, Validators.minLength(3)]],
          nickname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          birthdate: ['', Validators.required],
          firstemail: ['', [Validators.required, Validators.email]],
          cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
          secondemail: ['', [Validators.email]],
          uf: ['', [Validators.required, Validators.maxLength(2)]],
          address: ['', Validators.required],
          complement: [''],
          cep: ['', [Validators.required, this.cepValidator]],
          state: ['', Validators.required],
          city: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        },
        { validator: this.passwordsMatchValidator }
      );
    }

    private cepValidator(control: AbstractControl): { [key: string]: boolean } | null {
      if (!control.value) {
        return { required: true };
      }
      
      const cepLimpo = control.value.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        return { cepInvalido: true };
      }
      
      return null;
    }

    private passwordsMatchValidator(formGroup: FormGroup): null | object {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
    
      if (password && confirmPassword) {
        return password === confirmPassword ? null : { passwordsMismatch: true };
      }
      
      return null;
    }
    
    isFieldInvalid(field: string): boolean {
      const control = this.cadastroForm.get(field);
      
      if (!control) {
        return false;
      }

      return control.invalid && (control.touched || control.dirty);
    }
    
    getPasswordError(): boolean {
      return (
        this.cadastroForm.hasError('passwordsMismatch') && 
        !!this.cadastroForm.get('confirmPassword')?.touched
      );
    }
    
    onSubmit() {
      if (this.cadastroForm.valid) {
        const userData = { ...this.cadastroForm.value };

        delete userData.confirmPassword;

        if (!userData.secondemail || userData.secondemail.trim() === '') {
          delete userData.secondemail;
        }

        if (userData.cep) {
          userData.cep = userData.cep.replace(/\D/g, '');
        }

        if (userData.cpf) {
          userData.cpf = userData.cpf.replace(/\D/g, '');
        }

        this.userService.postRegisterUser(userData).subscribe(
          (response) => {
            this.title = 'Cadastro de Usuário';
            this.message = 'Cadastro realizado com sucesso!';
            this.openModal(this.title, this.message);
            this.clearForm();
            
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          (error) => {
            console.error('Erro no cadastro:', error);
            this.title = 'Cadastro de Usuário';
            this.message = 'Houve uma falha no cadastro. Por favor, tente novamente.';
            this.openModal(this.title, this.message);
          }
        );
  
      } else {
        this.markFormGroupTouched(this.cadastroForm);
        
        this.title = 'Formulário Inválido';
        this.message = 'Por favor, corrija os erros no formulário antes de continuar.';
        this.openModal(this.title, this.message);
      }
    }
    
    buscarEndereco() {
      const cepControl = this.cadastroForm.get('cep');
      const cep = cepControl?.value || '';
      
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo && cepLimpo.length === 8) {
        this.cepService.buscarCep(cepLimpo).subscribe(
          (dados) => {
            if (dados && !dados.erro) {
              this.cadastroForm.patchValue({
                address: dados.logradouro || '',
                complement: dados.complemento || '',
                city: dados.localidade || '',
                state: dados.estado || '',
                uf: dados.uf || ''
              });
            } else {
              alert('CEP não encontrado. Verifique o número digitado.');
            }
          },
          (error) => {
            console.error('Erro ao buscar o endereço:', error);
            alert('Erro ao buscar o endereço. Tente novamente mais tarde.');
          }
        );
      } else if (cep) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
      }
    }
  
    openModal(title: string, message: string) {
      this.modalTitle = title;
      this.modalMessage = message;
      this.showSuccessModal = true;
    }

    closeSuccessModal() {
      this.showSuccessModal = false;
    }

    clearForm() {
      this.cadastroForm.reset();
      
      Object.keys(this.cadastroForm.controls).forEach(key => {
        const control = this.cadastroForm.get(key);
        control?.markAsUntouched();
        control?.markAsPristine();
      });
    }

    private markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }
}