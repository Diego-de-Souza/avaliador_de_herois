import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderPlatformComponent } from "../../../components/header-platform/header-platform.component";
import { CommonModule } from '@angular/common';

declare var tinymce: any;

@Component({
  selector: 'app-cadastro-curiosidades',
  standalone: true,
  imports: [HeaderPlatformComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-curiosidades.component.html',
  styleUrl: './cadastro-curiosidades.component.css'
})
export class CadastroCuriosidadesComponent {
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;
    public curiosidadeForm: FormGroup;
    public isEditMode: boolean = false;
    public studioId: number | null = null;
  
    public editorConfig: any;
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private modalService: NgbModal
    ) {
      this.curiosidadeForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        category: ['', [Validators.required]],
        content: ['', [Validators.required]]
      });
    }
  
    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.studioId = Number(idParam);
          this.isEditMode = true;
        }
      });
  
      this.loadTinyMCE(() => {
        this.editorConfig = {
          selector: '#editor', // O ID do seu editor
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
          ],
          toolbar: 'undo redo | bold italic underline | link image | alignleft aligncenter alignright',
          menubar: true,
          statusbar: true,
          wordcount: {
            showWordCount: true,  
            showCharCount: false  
          }
        };
        tinymce.init(this.editorConfig);
      });
    }
  
    onSubmit() {
      if (this.curiosidadeForm.valid) {
        console.log('Dados enviados para registro:', this.curiosidadeForm.value);
      } else {
        console.log('Formulário inválido:', this.curiosidadeForm.errors);
      }
    }
  
    onCancel() {
      if (confirm('Tem certeza que deseja cancelar?')) {
        this.clearForm();
      }
    }
  
    clearForm() {
      this.curiosidadeForm.reset();
      this.isEditMode = false;
      this.studioId = null;
    }
  
    isFieldInvalid(field: string): boolean {
      const control = this.curiosidadeForm.get(field);
      return control ? control.invalid && (control.dirty || control.touched) : false;
    }
  
    loadTinyMCE(callback: () => void): void {
      const script = document.createElement('script');
      script.src = 'assets/tinymce/js/tinymce/tinymce.min.js';
      script.onload = () => {
        console.log('TinyMCE carregado com sucesso');
        callback();
      };
      script.onerror = () => {
        console.error('Falha ao carregar o TinyMCE');
      };
      document.head.appendChild(script);
    }
}
