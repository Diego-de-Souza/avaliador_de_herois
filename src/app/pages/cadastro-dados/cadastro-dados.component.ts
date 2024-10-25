import { Component } from '@angular/core';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-cadastro-dados',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-dados.component.html',
  styleUrl: './cadastro-dados.component.css'
})
export class CadastroDadosComponent{

  cadastroDados: FormGroup;

  faUser=faUser;

  imagemCardUrl: string | null = null;
  imagemCoverUrl: string | null = null;

  showPopup: boolean = false;

  constructor(private fb: FormBuilder){
    this.cadastroDados = this.fb.group({
      nomeHeroi: ['',[Validators.required, Validators.minLength(3)]],
      moralidade: ['',[Validators.required, Validators.minLength(3)]],
      studio: ['', [Validators.required, Validators.minLength(3)]],
      anoDeLancamento: ['',[Validators.required,Validators.pattern('[0-9]{4}') ]],
      imagem: ['', [Validators.required]],
      imagem_cover: ['',Validators.required],
      equipe: ['',[Validators.required, Validators.minLength(3)]],
      origem: ['',[Validators.required, Validators.minLength(10)]]
    })
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
}
