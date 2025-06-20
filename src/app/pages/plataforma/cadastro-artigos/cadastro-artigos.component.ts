import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSucessoCadastroComponent } from '../../../components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';
import { HeaderPlatformComponent } from '../../../components/header-platform/header-platform.component';

// Declaração para evitar erro do TinyMCE
declare var tinymce: any;

@Component({
  selector: 'app-cadastro-artigos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-artigos.component.html',
  styleUrls: ['./cadastro-artigos.component.css']
})
export class CadastroArtigosComponent implements OnInit{
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;
  public artigosForm: FormGroup;
  public isEditMode: boolean = false;
  public studioId: number | null = null;

  public editorConfig: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.artigosForm = this.fb.group({
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
    if (this.artigosForm.valid) {
      console.log('Dados enviados para registro:', this.artigosForm.value);
    } else {
      console.log('Formulário inválido:', this.artigosForm.errors);
    }
  }

  onCancel() {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.clearForm();
    }
  }

  clearForm() {
    this.artigosForm.reset();
    this.isEditMode = false;
    this.studioId = null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.artigosForm.get(field);
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
