import { Component, OnInit } from '@angular/core';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HeroisService } from '../../../../core/service/herois/herois.service';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';

@Component({
  selector: 'app-cadastro-dados',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-dados.component.html',
  styleUrl: './cadastro-dados.component.css'
})
export class CadastroDadosComponent{

  public cadastroDados: FormGroup;

  public faUser=faUser;

  public imagemCardUrl: string | null = null;
  public imagemCoverUrl: string | null = null;

  public showPopup: boolean = false;

  public genre: string[] = [
    'Masculino',
    'Feminino',
    'Homosexual',
    'Alienigena'
  ];

  public studio_id = [
    {
      id: 1,
      studio_name: "Marvel"
    },
    {
      id: 2,
      studio_name: "DC Comic"
    }
  ]

  public team = [
    { 
      id:1,
      name_team: "Liga da Justiça"
    },
    {
      id: 2,
      name_team: "Avengers"
    }
  ]

  constructor(private fb: FormBuilder, private searchHerois: HeroisService){
    this.cadastroDados = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      morality: ['',[Validators.required, Validators.minLength(3)]],
      studio_id: [null, [Validators.required]],
      power_type: ['',[Validators.required, Validators.minLength(5)]],
      release_date: ['', [Validators.required, this.validarDataCompleta()]],
      first_appearance: ['',[Validators.required, Validators.minLength(10)]],
      creator: ['', [Validators.required, Validators.minLength(3)]],
      weak_point: ['', [Validators.required, Validators.minLength(3)]],
      imagem: ['', [Validators.required]],
      imagem_cover: ['',Validators.required],
      team: [null,[Validators.required]],
      affiliation: ['', [Validators.required, Validators.minLength(3)]],
      story: ['',[Validators.required, Validators.minLength(10)]],
      genre: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  // Validador personalizado para validar uma data no formato completo (ano, mês e dia)
  private validarDataCompleta() {
    return (control: any) => {
      const data = control.value;
      if (!data) {
        return { required: true };
      }

      const dataObj = new Date(data); // Converte a string em data
      const hoje = new Date();

      // Verificar se a data é válida
      if (dataObj.toString() === 'Invalid Date') {
        return { dataInvalida: true };
      }

      // Verifica se a data é maior que a data de hoje (não permite datas no futuro)
      if (dataObj > hoje) {
        return { dataFutura: true };
      }

      return null; // Data válida
    };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.cadastroDados.get(field);
    return control? !control.valid && control.touched: false;
  }

  onFileSelected(event: Event, tipo: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (tipo === 'imagem') {
          this.imagemCardUrl = e.target.result;
          this.cadastroDados.patchValue({ imagem: file });
        } else if (tipo === 'imagem_cover') {
          this.imagemCoverUrl = e.target.result;
          this.cadastroDados.patchValue({ imagem_cover: file });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para enviar os dados para o backend
  onSubmit(): void {
    if (this.cadastroDados.valid) {
      const formData = new FormData();

      Object.keys(this.cadastroDados.value).forEach((key) => {
        if (key !== 'imagem' && key !== 'imagem_cover') {
          formData.append(key, this.cadastroDados.get(key)?.value);
        }
      });

      if (this.cadastroDados.get('imagem')?.value) {
        formData.append('imagens', this.cadastroDados.get('imagem')?.value);
      }

      if (this.cadastroDados.get('imagem_cover')?.value) {
        formData.append('imagens', this.cadastroDados.get('imagem_cover')?.value);
      }

      this.searchHerois.heroRecord(formData).subscribe(
        (response) => {
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 3000);
          this.cadastroDados.reset();
          this.imagemCardUrl = null;
          this.imagemCoverUrl = null;
        },
        (error) => {
          console.error('Erro na requisição: ', error);
        }
      );
    } else {
      console.log('Formulário Inválido');
    }
  }
}
