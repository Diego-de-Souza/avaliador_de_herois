import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-toast-notification',
  imports: [CommonModule],
  templateUrl: './toast-notification.html',
  styleUrl: './toast-notification.css',
})
export class ToastNotification implements OnInit {
  @Input() message: string = 'Teste de notificação';
  @Input() type: ToastType = 'success';
  @Input() duration: number = 3000; // 3 segundos
  @Input() closable: boolean = true;
  @Input() autoClose: boolean = true;
  @Output() onClose = new EventEmitter<void>();

  isVisible: boolean = false;
  private timeoutId?: number;

  ngOnInit() {
    this.show();
  }

  show() {
    this.isVisible = true;
    
    if (this.autoClose) {
      this.timeoutId = window.setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  close() {
    this.isVisible = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.onClose.emit();
  }
}
