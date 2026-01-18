import { Injectable, inject, signal } from '@angular/core';
import { Notification } from '../../interface/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationModalService {
  public isOpen = signal<boolean>(false);
  public notifications = signal<Notification[]>([]);
  public selectedNotificationId = signal<number | null>(null);
  public theme = signal<string>('dark');

  open(notifications: Notification[], selectedNotificationId: number | null, theme: string): void {
    this.notifications.set(notifications);
    this.selectedNotificationId.set(selectedNotificationId);
    this.theme.set(theme);
    this.isOpen.set(true);
    // Previne scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    // Restaura scroll do body
    document.body.style.overflow = '';
  }

  selectNotification(notificationId: number): void {
    this.selectedNotificationId.set(notificationId);
  }

  updateNotifications(notifications: Notification[]): void {
    this.notifications.set(notifications);
  }
}
