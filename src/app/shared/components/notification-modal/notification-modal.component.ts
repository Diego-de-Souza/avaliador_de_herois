import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../core/service/auth/auth.service';
import { NotificationHttpService } from '../../../core/service/http/notification-http.service';
import { Notification, NotificationType } from '../../../core/interface/notification.interface';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.css'
})
export class NotificationModalComponent implements OnInit, OnChanges, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationHttpService);
  private readonly themeService = inject(ThemeService);
  private readonly destroy$ = new Subject<void>();

  @Input() notifications: Notification[] = [];
  @Input() selectedNotificationId: number | null = null;
  @Input() theme: string = 'dark';
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() markAsReadEvent = new EventEmitter<number>();
  @Output() deleteNotificationEvent = new EventEmitter<number>();
  @Output() selectNotificationEvent = new EventEmitter<Notification>();

  public selectedNotification: Notification | null = null;
  public isLoading: boolean = false;

  readonly notificationColors: Record<NotificationType, string> = {
    'info': '#00d2ff',
    'success': '#4caf50',
    'warning': '#ff9800',
    'error': '#e62429',
    'system': '#9c27b0'
  };

  ngOnInit(): void {
    this.updateSelectedNotification();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNotificationId'] || changes['notifications']) {
      this.updateSelectedNotification();
    }
  }

  private updateSelectedNotification(): void {
    if (this.selectedNotificationId !== null && this.notifications.length > 0) {
      const notification = this.notifications.find(n => n.id === this.selectedNotificationId);
      if (notification) {
        this.selectedNotification = {
          ...notification,
          created_at: (notification as any).createdAt || notification.created_at
        };
        // Marca como lida automaticamente
        if (!notification.read) {
          this.markAsRead(notification.id);
        }
      } else {
        // Se a notificação selecionada não for encontrada, seleciona a primeira
        this.selectedNotification = {
          ...this.notifications[0],
          created_at: (this.notifications[0] as any).createdAt || this.notifications[0].created_at
        };
        if (this.selectedNotification && !this.selectedNotification.read) {
          this.markAsRead(this.selectedNotification.id);
        }
      }
    } else if (this.notifications.length > 0) {
      // Seleciona a primeira não lida ou a primeira da lista
      const firstUnread = this.notifications.find(n => !n.read);
      const notificationToSelect = firstUnread || this.notifications[0];
      this.selectedNotification = {
        ...notificationToSelect,
        created_at: (notificationToSelect as any).createdAt || notificationToSelect.created_at
      };
      if (this.selectedNotification && !this.selectedNotification.read) {
        this.markAsRead(this.selectedNotification.id);
      }
    } else {
      this.selectedNotification = null;
    }
  }

  selectNotification(notification: Notification): void {
    this.selectedNotification = {
      ...notification,
      created_at: (notification as any).createdAt || notification.created_at
    };
    this.selectNotificationEvent.emit(notification);
    
    // Marca como lida automaticamente
    if (!notification.read) {
      this.markAsRead(notification.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  markAsRead(id: number): void {
    this.markAsReadEvent.emit(id);
  }

  deleteNotification(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (confirm('Deseja realmente excluir esta notificação?')) {
      this.deleteNotificationEvent.emit(id);
    }
  }

  getNotificationColor(type: NotificationType | string): string {
    return this.notificationColors[type as NotificationType] || this.notificationColors.info;
  }

  getNotificationDate(notification: Notification | any): string {
    const dateString = (notification as any).createdAt || notification.created_at;
    if (!dateString) return '';
    return this.formatDate(dateString);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
