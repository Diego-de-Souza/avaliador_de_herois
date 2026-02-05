import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { ArticleService } from '../../../../core/service/articles/articles.service';

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
  public imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {
    this.artigosForm = this.fb.group({
      id: [null],
      category: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      text: [''],
      summary: this.fb.array([]),
      thumbnail: [''],
      keyWords: [''],
      route: [''],
      created_at: [new Date().toISOString()],
      updated_at: [new Date().toISOString()],
      views: [0],
      theme: [''],
      themeColor: ['#00D2FF'],
      image: [''], // Aqui será salvo o base64 da imagem
      image_source: [''] // Fonte/atribuição da imagem principal
    });
  }

  get summaryArray(): FormArray {
    return this.artigosForm.get('summary') as FormArray;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const article = idParam;
        this.isEditMode = true;
        this.articleService.getArticleById(article).subscribe((response: any) => {
          if (response?.dataUnit) {
            this.artigosForm.patchValue({...response.dataUnit});
            if (response.dataUnit.summary && Array.isArray(response.dataUnit.summary)) {
              response.dataUnit.summary.forEach((item: any) => {
                this.addSummaryItem(item.text, item.level);
              });
            }
            if (response.dataUnit.image) {
              this.imagePreview = response.dataUnit.image;
              this.artigosForm.patchValue({ image: response.dataUnit.image });
            }
          }
        });
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

  addSummaryItem(text: string, level: number) {
    this.summaryArray.push(this.fb.group({ text, level }));
  }

  onSubmit() {
    if (this.isEditMode) {
      this.onUpdate();
      return;
    }
    if (this.artigosForm.valid) {
      const artigo = {
        ...this.artigosForm.value,
        keyWords: this.artigosForm.value.keyWords
          ? this.artigosForm.value.keyWords.split(',').map((kw: string) => kw.trim())
          : []
      };
      delete artigo.id;
      delete artigo.created_at;
      delete artigo.updated_at;

      this.articleService.createArticle(artigo).subscribe({
        next: (response) => {
          this.router.navigate(['/plataforma/view/view-artigos']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar o artigo:', error);
        }
      });
    } else {
      console.log('Formulário inválido:', this.artigosForm.errors);
    }
  }

  onUpdate() {
    if (this.artigosForm.valid) {
      const keyWords = Array.isArray(this.artigosForm.value.keyWords)
        ? this.artigosForm.value.keyWords
        : (this.artigosForm.value.keyWords || '').split(',').map((kw: string) => kw.trim());
      const artigo = {
        ...this.artigosForm.value,
        keyWords
      };
      const artigo_id = artigo.id;
      delete artigo.id;
      delete artigo.created_at;
      delete artigo.updated_at;
      
      this.articleService.updateArticle(artigo_id, artigo).subscribe({
        next: () => this.router.navigate(['/plataforma/view/view-artigos']),
        error: (error) => console.error('Erro ao atualizar o artigo:', error)
      });
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
    this.imagePreview = null;
    while (this.summaryArray.length) {
      this.summaryArray.removeAt(0);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.artigosForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  loadTinyMCE(callback: () => void): void {
    const script = document.createElement('script');
    script.src = '/tinymce/tinymce.min.js';
    script.onload = () => {
      callback();
    };
    script.onerror = () => {
      console.error('Falha ao carregar o TinyMCE');
    };
    document.head.appendChild(script);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/jpeg/)) {
      alert('Apenas imagens JPG/JPEG são permitidas.');
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      img.src = e.target.result;
      img.onload = () => {
        if (img.width > 300 || img.height > 300) {
          alert('A imagem deve ter no máximo 300x300 pixels.');
          return;
        }
        this.imagePreview = e.target.result;
        this.artigosForm.patchValue({ image: e.target.result });
      };
    };
    reader.readAsDataURL(file);
  }
}