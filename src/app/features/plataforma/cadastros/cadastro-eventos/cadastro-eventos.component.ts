import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderPlatformComponent } from "../../../../shared/components/header-platform/header-platform.component";
import { EventosService } from '../../../../core/service/events/eventos.service';

declare var tinymce: any;

@Component({
  selector: 'app-cadastro-eventos',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-eventos.component.html',
  styleUrl: './cadastro-eventos.component.css'
})
export class CadastroEventosComponent implements OnInit {
  // Injeção moderna Angular
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventosService);
  private readonly router = inject(Router);

  @ViewChild('editor', { static: false }) editorElement!: ElementRef;

  public eventosForm!: FormGroup;
  public isEditMode = false;
  public studioId: number | null = null;
  public editorConfig: any;
  public imagePreview: string | null = null;
  public imageError: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
    this.initTinyMCE();
  }

  private initForm(): void {
    this.eventosForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', [Validators.required]],
      date_event: ['', [Validators.required]],
      url_event: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$'
          )
        ]
      ],
      image: ['']
    });
  }

  private checkEditMode(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.studioId = Number(idParam);
        this.isEditMode = true;
        // Se quiser buscar evento para edição, faça aqui
        // this.eventsService.getEventById(this.studioId).subscribe(...)
      }
    });
  }

  private initTinyMCE(): void {
    this.loadTinyMCE(() => {
      this.editorConfig = {
        selector: '#editor',
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

  public onSubmit(): void {
    if (this.eventosForm.valid && !this.imageError) {

      this.eventsService.saveEvent(this.eventosForm.value).subscribe({
        next: (response) => {
          console.log('Evento salvo com sucesso:', response);
          this.clearForm();
          this.router.navigate(['/plataforma/view/view-events']);
        },
        error: (error) => {
          console.error('Erro ao salvar o evento:', error);
        }
      });
    } else {
      console.log('Formulário inválido:', this.eventosForm.errors, this.imageError);
    }
  }


  public onCancel(): void {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.clearForm();
    }
  }

  public clearForm(): void {
    this.eventosForm.reset();
    this.isEditMode = false;
    this.studioId = null;
    this.imagePreview = null;
    this.imageError = null;
  }

  public isFieldInvalid(field: string): boolean {
    const control = this.eventosForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onImageChange(event: Event) {
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
        if (img.width > 400 || img.height > 400) {
          alert('A imagem deve ter no máximo 400x400 pixels.');
          return;
        }
        this.imagePreview = e.target.result;
        this.eventosForm.patchValue({ image: e.target.result });
      };
    };
    reader.readAsDataURL(file);
  }

  private loadTinyMCE(callback: () => void): void {
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