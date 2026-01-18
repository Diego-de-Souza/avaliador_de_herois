import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { ToastNotification } from './shared/components/toast-notification/toast-notification';
import { CommonModule } from '@angular/common';
import { MessageService } from './core/service/message/message.service';
import { AuthService } from './core/service/auth/auth.service';
import { ToastService } from './core/service/toast/toast.service';
import { NotificationModalService } from './core/service/modal/notification-modal.service';
import { NotificationModalComponent } from './shared/components/notification-modal/notification-modal.component';
import { NotificationHttpService } from './core/service/http/notification-http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, ToastNotification, CommonModule, NotificationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'avaliador_de_herois';
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationHttpService = inject(NotificationHttpService);
  public toastService: ToastService = inject(ToastService);
  public notificationModalService: NotificationModalService = inject(NotificationModalService);

  async ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    await this.authService.checkSession();
  }

  onNotificationMarkAsRead(id: number): void {
    this.notificationHttpService.markAsRead(id).subscribe({
      next: () => {
        // Atualiza as notificações no serviço de modal
        const notifications = this.notificationModalService.notifications().map(n => {
          if (n.id === id) {
            return { ...n, read: true };
          }
          return n;
        });
        this.notificationModalService.updateNotifications(notifications);
      },
      error: () => {
        console.error('Erro ao marcar notificação como lida');
      }
    });
  }

  onNotificationDelete(id: number): void {
    this.notificationHttpService.delete(id).subscribe({
      next: () => {
        // Remove a notificação das notificações no serviço de modal
        const notifications = this.notificationModalService.notifications().filter(n => n.id !== id);
        this.notificationModalService.updateNotifications(notifications);
        // Se a notificação excluída era a selecionada, fecha o modal
        if (this.notificationModalService.selectedNotificationId() === id) {
          this.notificationModalService.close();
        }
      },
      error: () => {
        console.error('Erro ao excluir notificação');
      }
    });
  }
 
}
