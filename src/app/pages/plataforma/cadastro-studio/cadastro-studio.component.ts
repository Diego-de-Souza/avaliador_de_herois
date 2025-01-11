import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';
import { ActivatedRoute } from '@angular/router';
import { HeroisService } from '../../../service/herois.service';

@Component({
  selector: 'app-cadastro-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent, ReactiveFormsModule],
  templateUrl: './cadastro-studio.component.html',
  styleUrl: './cadastro-studio.component.css'
})
export class CadastroStudioComponent implements OnInit{
  // Modelo de dados do studio
  studio = {
    name: '',
    nationality: '',
    history: '',
  };

  public studioForm: FormGroup;
  public isEditMode: Boolean = false;
  public studioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private heroisService: HeroisService
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
      // Obtém os valores do formulário como objeto simples
      const studioData = this.studioForm.value;
      if (this.isEditMode) {
        this.heroisService.putUpdateStudio(this.studioId, studioData).subscribe(
          (response) => {
            console.log('Studio atualizado:', response);
          },
          (error) => {
            console.log('Erro ao atualizar o studio:', error);
          }
        );
      } else {
        console.log('Dados enviados para registro:', studioData); // Pode remover após testes
  
        this.heroisService.postRegisterStudio(studioData).subscribe(
          (response) => {
            console.log('Studio registrado:', response);
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
  
}
