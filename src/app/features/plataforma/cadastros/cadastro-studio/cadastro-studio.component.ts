import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { ActivatedRoute } from '@angular/router';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-cadastro-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent, ReactiveFormsModule, ModalSucessoCadastroComponent],
  templateUrl: './cadastro-studio.component.html',
  styleUrl: './cadastro-studio.component.css'
})
export class CadastroStudioComponent implements OnInit {
  public studioForm: FormGroup;
  public isEditMode: boolean = false;
  public studioId: number | null = null;
  public showModal = false;
  public modalTitle: string = '';
  public modalMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private heroisService: HeroisService
  ) {
    this.studioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      nationality: ['', [Validators.required, Validators.minLength(3)]],
      history: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.studioId = Number(idParam);
        this.isEditMode = true;
        this.heroisService.getOneStudio(this.studioId).subscribe((response: any) => {
          if (response?.dataUnit) {
            this.studioForm.patchValue({
              name: response.dataUnit.name || '',
              nationality: response.dataUnit.nationality || '',
              history: response.dataUnit.history || ''
            });
          }
        });
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.studioForm.get(field);
    return control ? !control.valid && control.touched : false;
  }

  onSubmit() {
    if (this.studioForm.valid) {
      const studioData = this.studioForm.value;
      if (this.isEditMode) {
        this.heroisService.putUpdateStudio(this.studioId, studioData).subscribe(
          (response: any) => {
            if (response.status === 404) {
              this.modalTitle = 'Atualização de Studio';
              this.modalMessage = response.message;
              this.showModal = true;
            }
            if (response.status === 200) {
              this.modalTitle = 'Atualização de Studio';
              this.modalMessage = 'Studio atualizado com sucesso!';
              this.showModal = true;
            }
          },
          (error: any) => {
            console.log('Erro ao atualizar o studio:', error);
          }
        );
      } else {
        this.heroisService.postRegisterStudio(studioData).subscribe(
          (response: any) => {
            if (response.status === 409) {
              this.modalTitle = 'Cadastro de Studio';
              this.modalMessage = response.message;
              this.showModal = true;
            }
            if (response.status === 201) {
              this.modalTitle = 'Cadastro de Studio';
              this.modalMessage = 'Studio cadastrado com sucesso!';
              this.showModal = true;
            }
          },
          (error: any) => {
            console.log('Erro ao cadastrar studio:', error);
          }
        );
      }
    } else {
      return;
    }
  }

  onCancel() {
    const confirmCancel = confirm('Tem certeza que deseja cancelar?');
    if (confirmCancel) {
      this.clearForm();
    }
  }

  clearForm() {
    this.studioForm.reset();
    this.isEditMode = false;
    this.studioId = null;
  }

  closeModal() {
    this.showModal = false;
  }
}
