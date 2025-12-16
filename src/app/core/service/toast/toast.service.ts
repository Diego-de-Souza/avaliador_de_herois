import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastData {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  closable?: boolean;
  persistent?: boolean;
  actions?: ToastAction[];
}

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastData[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', options?: Partial<ToastData>) {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = options?.duration || (type === 'error' ? 6000 : 4000);
    
    const toast: ToastData = {
      id,
      message,
      type,
      duration,
      closable: true,
      persistent: false,
      ...options
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remover se não for persistente
    if (!toast.persistent && duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  success(message: string, title?: string, options?: Partial<ToastData>) {
    return this.show(message, 'success', { title, ...options });
  }

  error(message: string, title?: string, options?: Partial<ToastData>) {
    return this.show(message, 'error', { title, persistent: true, ...options });
  }

  warning(message: string, title?: string, options?: Partial<ToastData>) {
    return this.show(message, 'warning', { title, ...options });
  }

  info(message: string, title?: string, options?: Partial<ToastData>) {
    return this.show(message, 'info', { title, ...options });
  }

  /**
   * Toast específico para sucesso de pagamento
   */
  paymentSuccess(amount: number, paymentId: string): void {
    this.success(
      `Pagamento de ${this.formatCurrency(amount)} processado com sucesso!`,
      'Pagamento Aprovado',
      {
        persistent: true,
        actions: [
          {
            label: 'Ver Comprovante',
            action: () => this.navigateToReceipt(paymentId),
            style: 'primary'
          }
        ]
      }
    );
  }

  /**
   * Toast para erro de pagamento
   */
  paymentError(errorMessage: string): void {
    this.error(
      errorMessage || 'Não foi possível processar seu pagamento. Tente novamente.',
      'Erro no Pagamento',
      {
        actions: [
          {
            label: 'Tentar Novamente',
            action: () => window.location.reload(),
            style: 'primary'
          }
        ]
      }
    );
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toastsSubject.next([]);
  }

  /**
   * Métodos auxiliares
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  private navigateToReceipt(paymentId: string): void {
    // Implementar navegação para comprovante
    console.log('Navigate to receipt:', paymentId);
  }
}