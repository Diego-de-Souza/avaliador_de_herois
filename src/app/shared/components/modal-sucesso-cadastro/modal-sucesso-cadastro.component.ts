import { Component, inject, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-modal-sucesso-cadastro',
  standalone: true,
  imports: [],
  templateUrl: './modal-sucesso-cadastro.component.html',
  styleUrl: './modal-sucesso-cadastro.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ModalSucessoCadastroComponent {
  private readonly themeService: ThemeService = inject(ThemeService);
  @Input() modalTitle: string = '';
  @Input() modalMessage: string = '';
  @Output() closeModalEvent = new EventEmitter<void>();

  constructor() {}

  closeModalClick() {
    this.closeModalEvent.emit();
  }
}
