import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { articlesProps } from '../../../../core/interface/articles.interface';
import { ArticleService } from '../../../../core/service/articles/articles.service';
import { MarkdownModule } from 'ngx-markdown';

// Declaração para evitar erro do TinyMCE
declare var tinymce: any;

type ListItem = {
  text: string;
  level: number; // 1 = item principal, 2 = subitem
};

@Component({
  selector: 'app-cadastro-artigos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderPlatformComponent,
    MarkdownModule,
  ],
  templateUrl: './cadastro-artigos.component.html',
  styleUrls: ['./cadastro-artigos.component.css']
})
export class CadastroArtigosComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;
  public articles: articlesProps[] = [];
  public artigosForm!: FormGroup;
  public isEditMode: boolean = false;
  public studioId: number | null = null;
  public editorConfig: any;
  markdown: string = '';
  markdownSummary: string = '';
  activeTab: 'edit' | 'preview' | 'summary' | 'previewSummary' = 'edit';

  // Edit Mode
  article: Partial<articlesProps> = {
    category: '',
    title: '',
    description: '',
    text: '',
    summary: [],
    thumbnail: '',
    keyWords: []
  };

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  generateId(): number {
    return Date.now();
  }

  ngOnInit(): void {
    this.artigosForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(80)]],
      thumbnail: ['', []], // Campo opcional
      keywords: ['', [Validators.required]],
      text: ['', [Validators.required, Validators.minLength(5)]],
      summary: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]]
    });
    this.articleService.loadFromLocalStorage();
    this.articles = this.articleService.getArticles();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.studioId = Number(idParam);
        this.isEditMode = true;
      }
    });

    this.markdown = this.artigosForm.get('text')?.value || 'Nenhum texto inserido!';
    this.markdownSummary = this.artigosForm.get('summary')?.value || 'Nenhum resumo inserido!';

  }

  ngAfterViewInit(): void {
    this.loadTinyMCE(() => {
      this.editorConfig = {
        selector: '#text',
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

  getCategories(): string[] {
    const categories = new Set(this.articles.map(article => article.category));
    return Array.from(categories);
  }

  parseStructuredList(markdownText: string): ListItem[] {
    return markdownText
      .split('\n')
      .map(line => line.trim())
      .filter(line =>
        /^(\d+\.\s+|[-]{1,2}\s+)/.test(line)
      )
      .map(line => {
        const level = line.startsWith('--') ? 2 : 1;
        const cleaned = line.replace(/^(\d+\.\s+|[-]{1,2}\s+)/, '');
        return { text: cleaned, level };
      });
  }

  // onSummaryInputChange(text: string): void {
  //   this.parseStructuredList(text);
  // }

  onSubmit(): void {
    if (this.artigosForm.valid) {
      const formValue = this.artigosForm.value;

      const newArticle: articlesProps = {
        ...(this.isEditMode ? this.article : {}),
        id: this.generateId(),
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        text: formValue.text,
        summary: this.parseStructuredList(formValue.summary),
        // summary: formValue.summary,
        thumbnail: formValue.thumbnail,
        keyWords: formValue.keywords.split(',').map((k: string) => k.trim()),
        created_at: new Date().toISOString()
      };

      this.articleService.addArticle(newArticle);
      alert('Artigo salvo com sucesso!');
      this.clearForm();
    } else {
      console.log('Formulário inválido:', this.artigosForm.errors);
      alert('Por favor, preencha todos os campos obrigatórios.');
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
