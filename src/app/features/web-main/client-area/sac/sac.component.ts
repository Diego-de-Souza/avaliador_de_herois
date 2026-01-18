import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/service/toast/toast.service';
import { SACHttpService } from '../../../../core/service/http/sac-http.service';
import { SACContactRequest } from '../../../../core/interface/sac.interface';

type ContactType = 'suporte' | 'reclamacao' | 'elogio';

@Component({
  selector: 'app-sac',
  standalone: true,
  imports: [FontAwesomeModule, HeaderComponent, FooterComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './sac.component.html',
  styleUrl: './sac.component.css'
})
export class SACComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly sacService = inject(SACHttpService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public theme: string = 'dark';
  public contactForm!: FormGroup;
  public isSubmitting: boolean = false;
  public userId: number | null = null;
  public selectedFiles: File[] = [];
  public readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  public readonly allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  readonly contactTypes: Array<{ value: ContactType; label: string; icon: string }> = [
    { value: 'suporte', label: 'Suporte Técnico', icon: 'fa-solid fa-headset' },
    { value: 'reclamacao', label: 'Reclamação', icon: 'fa-solid fa-exclamation-triangle' },
    { value: 'elogio', label: 'Elogio', icon: 'fa-solid fa-heart' }
  ];

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });

    this.authService.user$.subscribe(user => {
      if (user?.id) {
        this.userId = user.id;
      }
    });

    this.contactForm = this.fb.group({
      type: ['suporte', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      priority: ['normal', [Validators.required]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      for (const file of files) {
        // Validação de tipo
        if (!this.allowedFileTypes.includes(file.type)) {
          this.toastService.error(`Arquivo ${file.name} tem tipo não permitido. Tipos permitidos: imagens, PDF, Word, TXT.`, 'Erro');
          continue;
        }

        // Validação de tamanho
        if (file.size > this.maxFileSize) {
          this.toastService.error(`Arquivo ${file.name} excede o tamanho máximo de 10MB.`, 'Erro');
          continue;
        }

        // Verifica se já existe
        if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
          this.selectedFiles.push(file);
        }
      }

      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (input) {
        input.value = '';
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'fa-solid fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fa-solid fa-file-word';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fa-solid fa-file-image';
      case 'txt':
        return 'fa-solid fa-file-lines';
      default:
        return 'fa-solid fa-file';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      this.toastService.error('Usuário não identificado. Faça login novamente.', 'Erro');
      return;
    }

    this.isSubmitting = true;

    const contactRequest: SACContactRequest = {
      usuario_id: this.userId,
      type: this.contactForm.value.type,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      priority: this.contactForm.value.priority,
      attachments: this.selectedFiles.length > 0 ? this.selectedFiles : undefined
    };

    this.sacService.create(contactRequest).subscribe({
      next: (response) => {
        const ticketNumber = response.dataUnit?.ticket_number;
        this.toastService.success(
          `Sua solicitação foi criada com sucesso!${ticketNumber ? ` Ticket: #${ticketNumber}` : ''}`,
          'Mensagem Enviada'
        );
        this.contactForm.reset({
          type: 'suporte',
          priority: 'normal'
        });
        this.selectedFiles = [];
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Erro ao enviar solicitação:', error);
        this.toastService.error('Erro ao enviar solicitação. Tente novamente.', 'Erro');
        this.isSubmitting = false;
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter no máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      'type': 'Tipo de contato',
      'subject': 'Assunto',
      'message': 'Mensagem',
      'priority': 'Prioridade'
    };
    return labels[fieldName] || fieldName;
  }
}
