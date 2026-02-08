import { Component, inject, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { AuthService } from '../../../core/service/auth/auth.service';
import { NotificationHttpService } from '../../../core/service/http/notification-http.service';
import { NotificationModalService } from '../../../core/service/modal/notification-modal.service';
import { Subject, takeUntil, interval, switchMap } from 'rxjs';

const POLL_INTERVAL_MS = 60000; // 1 minuto

@Component({
  selector: 'app-notification-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-icon.component.html',
  styleUrl: './notification-icon.component.css'
})
export class NotificationIconComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationHttpService);
  private readonly modalService = inject(NotificationModalService);
  private readonly destroy$ = new Subject<void>();

  public theme: string = 'dark';
  public unreadCount: number = 0;
  public isLoggedIn: boolean = false;
  public showList: boolean = false;
  public notifications: any[] = [];
  private currentUserId: number | null = null;

  ngOnInit(): void {
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.theme = theme;
    });

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn && user?.id) {
        this.currentUserId = user.id;
        this.loadNotifications(user.id);
        // Polling via REST - busca notificações a cada minuto
        interval(POLL_INTERVAL_MS)
          .pipe(
            takeUntil(this.destroy$),
            switchMap(() => this.notificationService.getAll(user.id))
          )
          .subscribe({
            next: (response) => {
              this.notifications = (response.data || []).map(notification => ({
                ...notification,
                created_at: (notification as any).createdAt || (notification as any).created_at || notification.created_at,
                updated_at: (notification as any).updatedAt || (notification as any).updated_at
              }));
              this.unreadCount = this.notifications.filter(n => !n.read).length;
              if (this.modalService.isOpen()) {
                this.modalService.updateNotifications(this.notifications);
              }
            }
          });
      } else {
        this.currentUserId = null;
        this.unreadCount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications(userId: number): void {
    this.notificationService.getAll(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        // Mapeia os dados da API para o formato esperado (converte createdAt -> created_at)
        this.notifications = (response.data || []).map(notification => ({
          ...notification,
          created_at: (notification as any).createdAt || (notification as any).created_at || notification.created_at,
          updated_at: (notification as any).updatedAt || (notification as any).updated_at
        }));
        this.unreadCount = this.notifications.filter(n => !n.read).length;
      },
      error: () => {
        this.notifications = [];
        this.unreadCount = 0;
      }
    });
  }

  toggleList(): void {
    if (!this.isLoggedIn || this.notifications.length === 0) {
      return;
    }
    this.showList = !this.showList;
    if (this.showList && this.notifications.length === 0 && this.currentUserId) {
      this.loadNotifications(this.currentUserId);
    }
  }

  closeList(): void {
    this.showList = false;
  }

  openDetailModal(notification: any): void {
    // Fecha a lista dropdown imediatamente
    this.showList = false;
    // Abre o modal através do serviço
    this.modalService.open(this.notifications, notification.id, this.theme);
    // Marca como lida automaticamente
    if (!notification.read) {
      this.markAsRead(notification.id);
    }
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.read = true;
          this.unreadCount = this.notifications.filter(n => !n.read).length;
          // Atualiza as notificações no serviço de modal se estiver aberto
          if (this.modalService.isOpen()) {
            this.modalService.updateNotifications(this.notifications);
          }
        }
      },
      error: () => {
        console.error('Erro ao marcar notificação como lida');
      }
    });
  }

  deleteNotification(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Deseja realmente excluir esta notificação?')) {
      this.notificationService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== id);
          this.unreadCount = this.notifications.filter(n => !n.read).length;
          // Atualiza as notificações no serviço de modal se estiver aberto
          if (this.modalService.isOpen()) {
            this.modalService.updateNotifications(this.notifications);
            // Se a notificação excluída era a selecionada, fecha o modal
            if (this.modalService.selectedNotificationId() === id) {
              this.modalService.close();
              // Recarrega notificações
              if (this.currentUserId) {
                this.loadNotifications(this.currentUserId);
              }
            }
          }
        },
        error: () => {
          console.error('Erro ao excluir notificação');
        }
      });
    }
  }

  getNotificationDate(notification: any): string {
    const dateString = notification.createdAt || notification.created_at;
    if (!dateString) return '';
    return this.formatDate(dateString);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  getNotificationColor(type: string): string {
    const colors: Record<string, string> = {
      'info': '#00d2ff',
      'success': '#4caf50',
      'warning': '#ff9800',
      'error': '#e62429',
      'system': '#9c27b0'
    };
    return colors[type] || colors['info'];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const container = target.closest('.notification-container');
    if (!container && this.showList) {
      this.closeList();
    }
  }
}
