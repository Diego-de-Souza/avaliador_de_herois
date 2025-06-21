import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/service/user/user.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { CepService } from '../../../../core/service/cep/cep.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent implements OnInit{
  public settingsForm: FormGroup;
  private userData: any = '';
  title: string = '';
  message:string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private cepService: CepService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService : NgbModal,
  ) {
    this.settingsForm = this.fb.group({
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
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    const roleData = localStorage.getItem('role');

    // Verifica se existe e converte para objeto
    if (roleData) {
      this.userData = JSON.parse(roleData);
    } else {
      this.userData = null; // Ou algum valor padrão caso não exista
    }

      this.userService.getFindOneUser(this.userData.id).subscribe((Response)=>{
        const userFromDB = {
          fullname: Response.dataUnit.fullname,
          nickname: Response.dataUnit.nickname,
          birthdate: Response.dataUnit.birthdate,
          firstemail: Response.dataUnit.firstemail,
          secondemail: Response.dataUnit.secondemail,
          uf: Response.dataUnit.uf,
          address: Response.dataUnit.address,
          complement: Response.dataUnit.complement,
          cep: Response.dataUnit.cep,
          state: Response.dataUnit.state,
          city: Response.dataUnit.city,
          password: "teste123",
          confirmPassword: "teste123"
        };
  
        this.settingsForm.patchValue(userFromDB);
        
        this.cdr.detectChanges();

        Object.keys(this.settingsForm.controls).forEach(controlName => {
          const control = this.settingsForm.get(controlName);
          if (control) {
            control.markAsTouched();
            control.markAsDirty();
          }
        });

      },(error)=>{

      })
  }

  private passwordsMatchValidator(formGroup: FormGroup): null | object {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      const userData = this.settingsForm.value;

      if(userData.password == "teste123"){
        userData.password = null;
      }
      
      userData.confirmPassword = undefined; 

      this.userService.putUpdateUser(this.userData.id , userData).subscribe(
        (response) => {
          this.title = 'Atualização de Usuario';
          this.message = 'Atualização dos dados feita com sucesso!';
          this.openModal(this.title, this.message);

          const url = localStorage.getItem('returnUrl') || '/';
          
          this.router.navigate([url]);

          this.clearForm();

        },
        (error) => {
          this.title = 'Atualização de Usuario';
          this.message = 'Houve uma falha na atualização dos dados.';
          this.openModal(this.title, this.message);
        }
      );          
    } else {
      this.title = 'Atualização de Usuario';
      this.message = 'Houve uma falha na atualização dos dados.';
      this.openModal(this.title, this.message);
    }
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
    modalRef.componentInstance.modalTitle = title; 
    modalRef.componentInstance.modalMessage = message; 
  }

  isFieldInvalid(field: string): boolean {
    const control = this.settingsForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  clearForm() {
    this.settingsForm.reset(); 
  }

  buscarEndereco() {
    const cep = this.settingsForm.get('cep')?.value;
    
    // Verificar se o CEP tem o formato correto e enviar para o serviço
    if (cep && /^\d{8}$/.test(cep)) {
      this.cepService.buscarCep(cep).subscribe(
        (dados) => {
          if (dados && !dados.erro) {
            this.settingsForm.patchValue({
              address: dados.logradouro,
              complement: dados.complemento,
              city: dados.localidade,
              state: dados.estado,
              uf: dados.uf
            });
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
}
