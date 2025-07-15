import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { articlesProps } from '../../../../core/interface/articles.interface';
import { ArticleService } from '../../../../core/service/articles/articles.service';

// Declaração para evitar erro do TinyMCE
declare var tinymce: any;

@Component({
  selector: 'app-cadastro-artigos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderPlatformComponent],
  templateUrl: './cadastro-artigos.component.html',
  styleUrls: ['./cadastro-artigos.component.css']
})
export class CadastroArtigosComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;
  public artigosForm: FormGroup;
  public isEditMode: boolean = false;
  public studioId: number | null = null;
  public editorConfig: any;

  article: Partial<articlesProps> = {
    category: '',
    title: '',
    description: '',
    text: '',
    thumbnail: '',
    keyWords: []
  };

  keywordsInput = '';

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.artigosForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(60)]],
      thumbnail: ['', []], // Campo opcional
      keywords: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
    this.articleService.loadFromLocalStorage();
  }

  generateId(): number {
    return Number(crypto.randomUUID());
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.studioId = Number(idParam);
        this.isEditMode = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadTinyMCE(() => {
      this.editorConfig = {
        selector: '#editor',
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
          'image', 'link', 'lists', 'media', 'searchreplace', 'table',
          'visualblocks', 'wordcount'
        ],
        toolbar: 'undo redo | bold italic underline | link image | alignleft aligncenter alignright',
        menubar: true,
        statusbar: true,
      };
      tinymce.init(this.editorConfig);
    });
  }

  onSubmit() {
    if (this.artigosForm.valid) {
      const newArticle: articlesProps = {
        ...(this.article as articlesProps),
        id: this.generateId(),
        keyWords: this.keywordsInput.split(',').map(k => k.trim()),
        created_at: new Date().toISOString()
      };

      this.articleService.addArticle(newArticle);
      alert('Artigo salvo com sucesso!');

      this.clearForm();
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
    this.keywordsInput = '';
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
