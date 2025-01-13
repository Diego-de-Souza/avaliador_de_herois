import { Component, Inject, OnInit } from '@angular/core';
import { dadosLogradouros } from '../../../data/logradouro';
import { LogradouroModel } from '../../../Model/logradouro.model';
import { dadosEstado } from '../../../data/estado';
import { EstadoModel } from '../../../Model/estado.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { faCalendarDays, faCircleCheck, faCity, faEnvelope, faMap, faMapLocationDot, faSignsPost, faUserTag, faVihara, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { EncryptionUtil } from '../../../utils/encryption.utils';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent implements OnInit{
  logradouro: LogradouroModel[] = [];
    estados: EstadoModel[] = [];
    cadastroForm: FormGroup; // Declarar a variável sem inicializá-la

    public isEditMode: boolean = false; // Verifica se é edição
    public userId: number | null = null; // ID do usuário para edição
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
      private fb: FormBuilder, 
      private route: ActivatedRoute,
      private userService: UserService) 
      {
      // Inicializar o FormGroup no construtor
      this.cadastroForm = this.fb.group(
        {
          fullname: ['', [Validators.required, Validators.minLength(3)]],
          nickname: ['', [Validators.required, Validators.minLength(3)]],
          birthdate: ['', Validators.required],
          firstemail: ['', [Validators.required, Validators.email]],
          secondemail: ['', [Validators.email]],
          logradouro: ['', Validators.required],
          address: ['', Validators.required],
          complement: [''],
          cep: ['', [Validators.required, Validators.pattern('[0-9]{5}-[0-9]{3}')]],
          state: ['', Validators.required],
          city: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        },
        { validator: this.passwordsMatchValidator } // Adiciona o validador aqui
      );
    }
  
    ngOnInit() {
      this.logradouro = dadosLogradouros;
      this.estados = dadosEstado;

      this.route.paramMap.subscribe(params =>{
        const idParam = params.get('id');
        
        if(idParam){
          this.userId = Number(idParam);
          this.isEditMode = true;
          this.userService.getFindOneUser(this.userId).subscribe((response) =>{
            const userFromDB = {
              fullname: response.data.fullname,
              nickname: response.data.nickname,
              birthdate: response.data.birthdate,
              first_email: response.data.first_email,
              second_email: response.data.second_email,
              logradouro: response.data.logradouro,
              address: response.data.address,
              complement: response.data.complement,
              cep: response.data.cep,
              state: response.data.state,
              city: response.data.city
            };

            // Preenche o formulário com os dados do usuário
            this.cadastroForm.patchValue(userFromDB);
          },
          (error) =>{
            console.log('Erro ao buscar dados do Usuário');
          });
        }
      })

      // Verificar query params (inicio)
      this.route.queryParams.subscribe((queryParams) => {
        this.isMenuNav = queryParams['inicio'] === 'true';

        console.log(this.isMenuNav);
      });

    }

    private passwordsMatchValidator(formGroup: FormGroup): null | object {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
    
      if (password !== confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
      }
    
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
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

        if (this.isEditMode) {
          console.log('Atualizar usuário:', this.userId, this.cadastroForm.value);

          // Enviar o FormData na requisição de registro
          this.userService.putUpdateUser(this.userId , userData).subscribe(
            (response) => {
              console.log('Usuário cadastrado com sucesso:', response);
            },
            (error) => {
              console.error('Erro ao cadastrar usuário:', error);
            }
          );
        } else {
          console.log('Cadastrar novo usuário:', this.cadastroForm.value);

          // Enviar o FormData na requisição de registro
          this.userService.postRegisterUser(userData).subscribe(
            (response) => {
              console.log('Usuário cadastrado com sucesso:', response);
            },
            (error) => {
              console.error('Erro ao cadastrar usuário:', error);
            }
          );
        }
      } else {
        console.log('Formulário Inválido');
      }
    }
}
