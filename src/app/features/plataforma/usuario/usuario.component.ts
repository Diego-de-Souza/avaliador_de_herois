import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuUserComponent } from '../../../shared/components/menu-user/menu-user.component';
import { MessageService } from '../../../core/service/message/message.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MenuUserComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  constructor(
    private router: Router,
    private readonly messageService: MessageService
  ) {}

  public sendMessage(){
    this.messageService.sendMessage({data:{
      userId: localStorage.getItem('user_id'),
      title: 'Teste',
      body: 'Teste de mensagem para FCM'
    }})
    console.log("teste de envio")
  }
}
