import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { ActivatedRoute } from '@angular/router';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-cadastro-team',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent, ReactiveFormsModule, ModalSucessoCadastroComponent],
  templateUrl: './cadastro-team.component.html',
  styleUrl: './cadastro-team.component.css'
})
export class CadastroTeamComponent implements OnInit{
  showModal = false;
  modalTitle: string = '';
  modalMessage: string = '';
  equipe = { name: '', creator: '' };
  public title: string = '';
  public message: string = '';

  public dadosTeam: FormGroup;
  public isEditMode: boolean = false;
  public teamId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private heroisService: HeroisService
  ){
    this.dadosTeam = this.fb.group({
      name: ['', Validators.required],
      creator: ['', Validators.required]
    })
  }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params =>{
        const idParams = params.get('id');

        if(idParams){
          this.teamId = Number(idParams);
          this.isEditMode = true;
          this.heroisService.getOneTeam(this.teamId).subscribe((response)=>{
            const teamFromDB = {
              name: response.data.name,
              creator: response.data.creator
            }

            this.dadosTeam.patchValue(teamFromDB);
          })
        }
      })
  }

  isFieldInvalid(field: string): boolean {
    const control = this.dadosTeam.get(field);
    return control ? !control.valid && control.touched : false; // Verifica se o controle existe
  }
  // Método de submit para cadastro de equipe
  onSubmit() {
    if(this.dadosTeam.valid){
      const teamData = this.dadosTeam.value;

      if(this.isEditMode){
        this.heroisService.putUpdateTeam(this.teamId,teamData).subscribe((response)=>{
          console.log('TEam cadastrado:', response);
        },
        (error)=>{
          console.log('Erro na atualização dos dados', error);
        })
      }else{
        this.heroisService.postRegisterTeam(teamData).subscribe((response)=>{
          if(response.status === 409){
            this.modalTitle = 'Cadastro de Equipe';
            this.modalMessage = response.message;
            this.showModal = true;
          }

          if(response.status === 201){
            this.modalTitle = 'Cadastro de Equipe';
            this.modalMessage = 'Studio cadastrado com sucesso!';
            this.showModal = true;
          }
        },(error)=>{
          console.log("erro ao cadastrar:",error);
        })
      }
    }else{
      console.log('Formulário inválido');
    }
  }

  // Método para resetar o formulário
  resetForm(form: NgForm) {
    form.reset();
  }

  clearForm() {
    this.dadosTeam.reset();
    this.isEditMode = false;
    this.teamId = null;
  }
  
  closeModal() {
    this.showModal = false;
  }
}
