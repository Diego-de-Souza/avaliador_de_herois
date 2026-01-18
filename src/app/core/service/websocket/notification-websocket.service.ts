import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Notification } from '../../interface/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationWebSocketService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();
  
  private ws: WebSocket | null = null;
  private readonly notifications$ = new BehaviorSubject<Notification[]>([]);
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 segundos

  connect(userId: number): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = this.getWebSocketUrl(userId);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket conectado para notificações');
      this.reconnectAttempts = 0;
      this.sendAuth(userId);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket desconectado');
      this.attemptReconnect(userId);
    };
  }

  private getWebSocketUrl(userId: number): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // Ajuste a URL conforme sua configuração de WebSocket
    return `${protocol}//${host}/api/notifications/ws?usuario_id=${userId}`;
  }

  private sendAuth(userId: number): void {
    const sessionToken = localStorage.getItem('session_token');
    if (this.ws && sessionToken) {
      this.ws.send(JSON.stringify({
        type: 'auth',
        usuario_id: userId,
        session_token: sessionToken
      }));
    }
  }

  private handleMessage(data: any): void {
    if (data.type === 'notification') {
      const notification: Notification = data.payload;
      const current = this.notifications$.value;
      this.notifications$.next([notification, ...current]);
    } else if (data.type === 'notification_read') {
      // Atualizar notificação marcada como lida
      const current = this.notifications$.value;
      const updated = current.map(n => 
        n.id === data.payload.id ? { ...n, read: true } : n
      );
      this.notifications$.next(updated);
    } else if (data.type === 'notification_deleted') {
      // Remover notificação deletada
      const current = this.notifications$.value;
      const filtered = current.filter(n => n.id !== data.payload.id);
      this.notifications$.next(filtered);
    }
  }

  private attemptReconnect(userId: number): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Número máximo de tentativas de reconexão atingido');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect(userId);
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.destroy$.next();
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroy$.complete();
  }
}
