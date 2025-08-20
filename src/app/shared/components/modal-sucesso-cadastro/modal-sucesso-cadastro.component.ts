import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  
  constructor(public modal: NgbModal, public activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.close();  
  }
}
