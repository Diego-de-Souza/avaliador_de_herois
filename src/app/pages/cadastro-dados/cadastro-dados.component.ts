import { Component } from '@angular/core';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { HeroisService } from '../../service/herois.service';

@Component({
  selector: 'app-cadastro-dados',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
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

  constructor(private fb: FormBuilder, private searchHerois: HeroisService){
    this.cadastroDados = this.fb.group({
      nomeHeroi: ['',[Validators.required, Validators.minLength(3)]],
      moralidade: ['',[Validators.required, Validators.minLength(3)]],
      studio: ['', [Validators.required, Validators.minLength(3)]],
      power_type: ['',[Validators.required, Validators.minLength(5)]],
      anoDeLancamento: ['', [Validators.required, this.validarDataCompleta()]],
      first_appearance: ['',[Validators.required, Validators.minLength(10)]],
      creator: ['', [Validators.required, Validators.minLength(3)]],
      weak_point: ['', [Validators.required, Validators.minLength(3)]],
      imagem: ['', [Validators.required]],
      imagem_cover: ['',Validators.required],
      equipe: ['',[Validators.required, Validators.minLength(3)]],
      affiliation: ['', [Validators.required, Validators.minLength(3)]],
      origem: ['',[Validators.required, Validators.minLength(10)]],
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

  onSubmit() {
    if (this.cadastroDados.valid) {
      console.log('Formulário válido: ', this.cadastroDados.value);
      
      this.showPopup = true; // Ativa o popup
      setTimeout(() => {
        this.showPopup = false; // Fecha o popup automaticamente após 3 segundos
      }, 3000);

      this.cadastroDados.reset();
      this.imagemCardUrl = null;
      this.imagemCoverUrl = null;
    } else {
      console.log('Formulário Inválido');
    }
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
  sendData(): void {
    if (this.cadastroDados.valid) {
      const formData = new FormData();

      // Adicionando os campos de texto ao FormData
      Object.keys(this.cadastroDados.value).forEach(key => {
        // Ignorar campos que não são de imagem
        if (key !== 'imagem' && key !== 'imagem_cover') {
          formData.append(key, this.cadastroDados.get(key)?.value);
        }
      });

      // Adicionando as imagens ao FormData
      if (this.cadastroDados.get('imagem')?.value) {
        formData.append('imagem', this.cadastroDados.get('imagem')?.value);
      }
      if (this.cadastroDados.get('imagem_cover')?.value) {
        formData.append('imagem_cover', this.cadastroDados.get('imagem_cover')?.value);
      }

      // Enviar os dados para a API via POST
      this.searchHerois.heroRecord(formData).subscribe(
        response=>{
          console.log('Resposta da API: ', response);
          this.showPopup = true; // Ativa o popup de sucesso
          setTimeout(() => {
            this.showPopup = false; // Fecha o popup após 3 segundos
          }, 3000);
          this.cadastroDados.reset();
          this.imagemCardUrl = null;
          this.imagemCoverUrl = null;
        },
        error=>{
          console.error('Erro na requisição: ', error);
        }
      )
    } else {
      console.log('Formulário Inválido');
    }
  }
}
