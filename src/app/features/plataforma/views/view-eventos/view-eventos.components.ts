import { Component, OnInit } from '@angular/core';
import { HeaderPlatformComponent } from '../../../../shared/components/header-platform/header-platform.component';
import { CommonModule } from '@angular/common';
import { EventosService } from '../../../../core/service/events/eventos.service';
import { ModalSucessoCadastroComponent } from '../../../../shared/components/modal-sucesso-cadastro/modal-sucesso-cadastro.component';

@Component({
  selector: 'app-view-eventos',
  standalone: true,
  imports: [HeaderPlatformComponent, CommonModule, ModalSucessoCadastroComponent],
  templateUrl: './view-eventos.component.html',
  styleUrl: './view-eventos.component.css'
})
export class ViewEventosComponent implements  OnInit{
  public isList: boolean = false;
    public eventos: any[] = [];
    modalTitle: string = '';
    showSuccessModal = false;
    modalMessage: string = '';
    public title:string = '';
    public message: string = '';
  
    constructor(
      private eventosService: EventosService
    ) { }
  
    ngOnInit() {
      this.eventosService.getEventsList().subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            this.eventos = response.data;
            this.isList = true;
            console.log('Eventos carregados com sucesso:', response);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar eventos:', error);
        }
      })
    }
  
    editArtigos(article_id: number) {
        this.modalTitle = 'Edição de Evento';
        this.modalMessage = 'Os eventos não podem ser atualizados no momento.Contate o administrador do sistema.';
        this.showSuccessModal = true;
    }
  
    deleteArtigos(event_id: number) {
        this.eventosService.deleteEvent(event_id).subscribe({
          next: (response) => {
            console.log('Evento deletado com sucesso:', response);
            this.eventos = this.eventos.filter(evento => evento.id !== event_id);
          },
          error: (error) => {
            console.error('Erro ao deletar evento:', error);
          }
        });
    }

    closeSuccessModal() {
        this.showSuccessModal = false;
    }
}
