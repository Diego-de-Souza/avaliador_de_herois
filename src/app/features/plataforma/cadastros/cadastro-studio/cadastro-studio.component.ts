import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { ActivatedRoute } from '@angular/router';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cadastro-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent, ReactiveFormsModule],
  templateUrl: './cadastro-studio.component.html',
  styleUrl: './cadastro-studio.component.css'
})
export class CadastroStudioComponent implements OnInit{
  public title: string = '';
  public message: string = '';

  public studioForm: FormGroup;
  public isEditMode: Boolean = false;
  public studioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private heroisService: HeroisService,
    private modalService: NgbModal
  ){
    this.studioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      nationality: ['', [Validators.required, Validators.minLength(3)]],
      history: ['', [Validators.required, Validators.minLength(10)]]
    })
  }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params =>{
        const idParam = params.get('id');
        if(idParam){
          this.studioId = Number(idParam);
          this.isEditMode = true;

          this.heroisService.getOneStudio(this.studioId).subscribe((Response)=>{
            if (Response?.dataUnit) {
              this.studioForm.patchValue({
                name: Response.dataUnit.name || '',
                nationality: Response.dataUnit.nationality || '',
                history: Response.dataUnit.history || ''
              });
            }
            
          })
        }
      })
  }

  isFieldInvalid(field: string): boolean {
    const control = this.studioForm.get(field);
    return control ? !control.valid && control.touched : false; 
  }

  // Método para salvar o estúdio
  onSubmit() {
    if (this.studioForm.valid) {
      const studioData = this.studioForm.value;
      if (this.isEditMode) {
        this.heroisService.putUpdateStudio(this.studioId, studioData).subscribe(
          (response) => {
            if(response.status === 404){
              this.title = 'Atualização de Studio';
              this.message = response.message;
              this.openModal(this.title, this.message);
            }

            if(response.status === 200){
              this.title = 'Atualização de Studio';
              this.message = 'Studio atualizado com sucesso!';
              this.openModal(this.title, this.message);
            }
          },
          (error) => {
            console.log('Erro ao atualizar o studio:', error);
          }
        );
      } else {
        console.log('Dados enviados para registro:', studioData); // Pode remover após testes
  
        this.heroisService.postRegisterStudio(studioData).subscribe(
          (response) => {
            if(response.status === 409){
              this.title = 'Cadastro de Studio';
              this.message = response.message;
              this.openModal(this.title, this.message);
            }

            if(response.status === 201){
              this.title = 'Cadastro de Studio';
              this.message = 'Studio cadastrado com sucesso!';
              this.openModal(this.title, this.message);
            }
          },
          (error) => {
            console.log('Erro ao cadastrar studio:', error);
          }
        );
      }
    } else {
      console.log('Formulário inválido:', this.studioForm.errors);
      return;
    }
  }

  // Método para cancelar e limpar o formulário
  onCancel() {
    const confirmCancel = confirm('Tem certeza que deseja cancelar?');
    if (confirmCancel) {
      this.clearForm();
    }
  }

  // Limpa os dados do formulário
  clearForm() {
    this.studioForm.reset();
    this.isEditMode = false;
    this.studioId = null;
  }

  openModal(title: string, message: string) {
    const modalRef = this.modalService.open(ModalSucessoCadastroComponent); 
    modalRef.componentInstance.modalTitle = title; 
    modalRef.componentInstance.modalMessage = message; 
  }
  
}
