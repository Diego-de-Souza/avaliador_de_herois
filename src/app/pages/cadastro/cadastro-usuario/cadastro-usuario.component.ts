import { Component, OnInit } from '@angular/core';
import { dadosLogradouros } from '../../../data/logradouro';
import { LogradouroModel } from '../../../Model/logradouro.model';
import { dadosEstado } from '../../../data/estado';
import { EstadoModel } from '../../../Model/estado.model';
import { faUser, faUserTag, faCalendarDays, faEnvelope, faMapLocationDot, faCircleCheck, faMap, faSignsPost, faCity, faVihara } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent implements OnInit{
  logradouro: LogradouroModel[] = [];
    estados: EstadoModel[] = [];
    cadastroForm: FormGroup; // Declarar a variável sem inicializá-la
  
    faUser:any;
    faUserTag = faUserTag;
    faCalendarDays = faCalendarDays;
    faEnvelope = faEnvelope;
    faMapLocationDot = faMapLocationDot;
    faCircleCheck = faCircleCheck;
    faMap = faMap;
    faSignsPost = faSignsPost;
    faCity = faCity;
    faVihara = faVihara;
  
    constructor(private fb: FormBuilder) {
      // Inicializar o FormGroup no construtor
      this.cadastroForm = this.fb.group({
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
        city: ['', Validators.required]
      });
    }
  
    ngOnInit() {
      this.logradouro = dadosLogradouros;
      this.estados = dadosEstado;
      this.faUser  = faUser;
    }
  
    isFieldInvalid(field: string): boolean {
      const control = this.cadastroForm.get(field);
      return control ? !control.valid && control.touched : false; // Verifica se o controle existe
    }
  
    onSubmit() {
      if (this.cadastroForm.valid) {
        console.log('Formulário Válido:', this.cadastroForm.value);
      } else {
        console.log('Formulário Inválido');
      }
    }
}
