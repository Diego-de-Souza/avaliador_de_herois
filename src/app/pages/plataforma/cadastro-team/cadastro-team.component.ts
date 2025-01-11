import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';
import { ActivatedRoute } from '@angular/router';
import { HeroisService } from '../../../service/herois.service';

@Component({
  selector: 'app-cadastro-team',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderPlatformComponent, ReactiveFormsModule],
  templateUrl: './cadastro-team.component.html',
  styleUrl: './cadastro-team.component.css'
})
export class CadastroTeamComponent implements OnInit{
  equipe = { name: '', creator: '' };  // Dados do formulário

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
      const formData = new FormData();

      Object.keys(this.dadosTeam.value).forEach((key)=>{
        formData.append(key, this.dadosTeam.value[key]);
      });

      if(this.isEditMode){
        this.heroisService.putUpdateTeam(this.teamId,formData).subscribe((response)=>{
          console.log('TEam cadastrado:', response);
        },
        (error)=>{
          console.log('Erro na atualização dos dados', error);
        })
      }else{
        this.heroisService.postRegisterTeam(formData).subscribe((response)=>{
          console.log('Team cadastrado :',response);
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
}
