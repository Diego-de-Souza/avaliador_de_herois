import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-sucesso-cadastro',
  standalone: true,
  imports: [],
  templateUrl: './modal-sucesso-cadastro.component.html',
  styleUrl: './modal-sucesso-cadastro.component.css'
})
export class ModalSucessoCadastroComponent {
  @Input() modalTitle: string = '';  
  @Input() modalMessage: string = '';
  
  constructor(public modal: NgbModal, public activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.close();  
  }
}
