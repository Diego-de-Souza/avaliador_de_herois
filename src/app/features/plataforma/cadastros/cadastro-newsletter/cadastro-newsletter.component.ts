import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { NewsletterItemRequest } from '../../../../core/interface/client-news.interface';
import { NewsletterCategory } from '../../../../core/interface/newsletter.interface';
import { NewsService } from '../../../../core/service/news/news.service';

@Component({
  selector: 'app-cadastro-newsletter',
  standalone: true,
  imports: [HeaderPlatformComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-newsletter.component.html',
  styleUrl: './cadastro-newsletter.component.css'
})
export class CadastroNewsletterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly newsletterService = inject(NewsService);

  newsletterForm!: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  imagePreview: string | null = null;
  categories = NewsletterCategory;

  get categoryControl(): FormControl {
    return this.newsletterForm.get('category') as FormControl;
  }

  ngOnInit(): void {
    this.newsletterForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      image: [''],
      link: [''],
      category: [],
      date: ['', [Validators.required]],
      read_time: ['', [Validators.required]],
      author: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.itemId = idParam;
        this.isEditMode = true;
        this.loadItem(this.itemId);
      }
    });
  }

  private loadItem(id: string): void {
    this.newsletterService.getById(id).subscribe({
      next: item => {
        this.newsletterForm.patchValue({
          title: item.dataUnit?.title ?? '',
          description: item.dataUnit?.description ?? '',
          image: item.dataUnit?.image ?? '',
          link: item.dataUnit?.link ?? '',
          category: item.dataUnit?.category ?? '',
          date: item.dataUnit?.date ?? '',
          read_time: item.dataUnit?.read_time ?? '',
          author: item.dataUnit?.author ?? ''
        });
        if (item.dataUnit?.image) {
          this.imagePreview = item.dataUnit?.image ?? '';
        }
      },
      error: err => console.error('Erro ao carregar item:', err)
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Apenas imagens JPG, PNG ou WebP são permitidas.');
      return;
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`A imagem deve ter no máximo ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      if (result) {
        this.imagePreview = result;
        this.newsletterForm.patchValue({ image: result });
      }
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.imagePreview = null;
    this.newsletterForm.patchValue({ image: '' });
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    if (this.newsletterForm.valid) {
      const value = this.newsletterForm.value as NewsletterItemRequest;
      if (this.isEditMode && this.itemId) {
        this.newsletterService.update(this.itemId, value).subscribe({
          next: () => this.router.navigate(['/plataforma/view/view-newsletter']),
          error: err => console.error('Erro ao atualizar:', err)
        });
      } else {
        this.newsletterService.create(value).subscribe({
          next: () => this.router.navigate(['/plataforma/view/view-newsletter']),
          error: err => console.error('Erro ao criar:', err)
        });
      }
    }
  }

  onCancel(): void {
    if (confirm('Tem certeza que deseja cancelar?')) {
      this.clearForm();
    }
  }

  clearForm(): void {
    this.newsletterForm.reset();
    this.isEditMode = false;
    this.itemId = null;
    this.imagePreview = null;
    this.router.navigate(['/plataforma/view/view-newsletter']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.newsletterForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
