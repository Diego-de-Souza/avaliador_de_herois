import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { SACHttpService } from '../../../../core/service/http/sac-http.service';
import { SACContact, SACFilters, SACStatus, SACType, SACPriority } from '../../../../core/interface/sac.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../core/service/toast/toast.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-view-sac',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './view-sac.component.html',
  styleUrl: './view-sac.component.css'
})
export class ViewSacComponent implements OnInit {
  private readonly sacService = inject(SACHttpService);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  public contacts = signal<SACContact[]>([]);
  public selectedContact: SACContact | null = null;
  public isLoading = signal<boolean>(false);
  public showResponseModal = signal<boolean>(false);
  public responseForm!: FormGroup;
  public responseFiles: File[] = [];

  public filters: SACFilters = {
    page: 1,
    limit: 20
  };

  public pagination = signal({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  public filterForm!: FormGroup;
  public showFilters = signal<boolean>(false);

  readonly statusOptions: Array<{ value: SACStatus; label: string; color: string }> = [
    { value: 'aberto', label: 'Aberto', color: '#ff9800' },
    { value: 'em_andamento', label: 'Em Andamento', color: '#2196f3' },
    { value: 'resolvido', label: 'Resolvido', color: '#4caf50' },
    { value: 'fechado', label: 'Fechado', color: '#9e9e9e' }
  ];

  readonly typeOptions: Array<{ value: SACType; label: string; icon: string }> = [
    { value: 'suporte', label: 'Suporte', icon: 'fa-headset' },
    { value: 'reclamacao', label: 'Reclamação', icon: 'fa-exclamation-triangle' },
    { value: 'elogio', label: 'Elogio', icon: 'fa-heart' }
  ];

  readonly priorityOptions: Array<{ value: SACPriority; label: string; color: string }> = [
    { value: 'low', label: 'Baixa', color: '#9e9e9e' },
    { value: 'normal', label: 'Normal', color: '#2196f3' },
    { value: 'high', label: 'Alta', color: '#ff9800' },
    { value: 'urgent', label: 'Urgente', color: '#e62429' }
  ];

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      type: [''],
      status: [''],
      priority: [''],
      date_from: [''],
      date_to: ['']
    });

    this.responseForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading.set(true);
    
    const filters: SACFilters = {
      ...this.filters,
      ...this.filterForm.value
    };

    // Remove campos vazios
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof SACFilters] === '' || filters[key as keyof SACFilters] === null) {
        delete filters[key as keyof SACFilters];
      }
    });

    this.sacService.getAll(filters).subscribe({
      next: (response) => {
        this.contacts.set(response.data || []);
        if (response.pagination) {
          this.pagination.set(response.pagination);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Erro ao carregar solicitações', 'Erro');
        this.isLoading.set(false);
      }
    });
  }

  selectContact(contact: SACContact): void {
    this.selectedContact = contact;
    this.loadContactDetails(contact.id);
  }

  loadContactDetails(id: number): void {
    this.sacService.getById(id).subscribe({
      next: (response) => {
        if (response.dataUnit) {
          this.selectedContact = response.dataUnit;
        }
      },
      error: () => {
        this.toastService.error('Erro ao carregar detalhes', 'Erro');
      }
    });
  }

  updateStatus(contactId: number, status: SACStatus): void {
    this.sacService.updateStatus(contactId, status).subscribe({
      next: () => {
        this.toastService.success('Status atualizado com sucesso', 'Sucesso');
        this.loadContacts();
        if (this.selectedContact?.id === contactId) {
          this.loadContactDetails(contactId);
        }
      },
      error: () => {
        this.toastService.error('Erro ao atualizar status', 'Erro');
      }
    });
  }

  openResponseModal(): void {
    if (!this.selectedContact) return;
    this.responseForm.reset();
    this.responseFiles = [];
    this.showResponseModal.set(true);
  }

  closeResponseModal(): void {
    this.showResponseModal.set(false);
    this.responseForm.reset();
    this.responseFiles = [];
  }

  onResponseFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.responseFiles.push(...files);
      if (input) {
        input.value = '';
      }
    }
  }

  removeResponseFile(index: number): void {
    this.responseFiles.splice(index, 1);
  }

  submitResponse(): void {
    if (this.responseForm.invalid || !this.selectedContact) return;

    this.sacService.addResponse(
      this.selectedContact.id,
      this.responseForm.value.message,
      this.responseFiles.length > 0 ? this.responseFiles : undefined
    ).subscribe({
      next: () => {
        this.toastService.success('Resposta enviada com sucesso', 'Sucesso');
        this.closeResponseModal();
        this.loadContactDetails(this.selectedContact!.id);
        this.loadContacts();
      },
      error: () => {
        this.toastService.error('Erro ao enviar resposta', 'Erro');
      }
    });
  }

  deleteContact(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return;

    this.sacService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Solicitação excluída com sucesso', 'Sucesso');
        this.contacts.set(this.contacts().filter(c => c.id !== id));
        if (this.selectedContact?.id === id) {
          this.selectedContact = null;
        }
      },
      error: () => {
        this.toastService.error('Erro ao excluir solicitação', 'Erro');
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadContacts();
    this.showFilters.set(false);
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      type: '',
      status: '',
      priority: '',
      date_from: '',
      date_to: ''
    });
    this.applyFilters();
  }

  changePage(page: number): void {
    this.filters.page = page;
    this.loadContacts();
  }

  formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  }

  getStatusLabel(status: SACStatus): string {
    return this.statusOptions.find(s => s.value === status)?.label || status;
  }

  getTypeLabel(type: SACType): string {
    return this.typeOptions.find(t => t.value === type)?.label || type;
  }

  getPriorityLabel(priority: SACPriority): string {
    return this.priorityOptions.find(p => p.value === priority)?.label || priority;
  }

  getPriorityColor(priority: SACPriority): string {
    return this.priorityOptions.find(p => p.value === priority)?.color || '#9e9e9e';
  }

  getTypeIcon(type: SACType): string {
    const typeOption = this.typeOptions.find(t => t.value === type);
    return typeOption ? `fa-${typeOption.icon}` : 'fa-question';
  }

  downloadAttachment(contactId: number, attachmentId: number, fileName: string): void {
    this.sacService.downloadAttachment(contactId, attachmentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.toastService.error('Erro ao baixar anexo', 'Erro');
      }
    });
  }
}
