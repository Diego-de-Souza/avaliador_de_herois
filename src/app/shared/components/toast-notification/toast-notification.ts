import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-toast-notification',
  imports: [CommonModule],
  template:`
    @if(isVisible){
      <div 
        class="toast-container"
        [class]="'toast-' + type"
        [@slideIn]>
        <div class="toast-content">
          <div class="toast-icon">
            @if (type === 'success') {
              <span>✅</span>
            }
            @if (type === 'error') {
              <span>❌</span>
            }
            @if (type === 'warning') {
              <span>⚠️</span>
            }
            @if (type === 'info') {
              <span>ℹ️</span>
            }
          </div>
          <div class="toast-message">
            {{ message }}
          </div>
          @if (closable) {
            <button class="toast-close" (click)="close()">×</button>
          }
        </div>
        <div class="toast-progress" [class.animate]="autoClose"></div>
      </div>
    }
    
  `
})
export class ToastNotification implements OnInit {
  @Input() message: string = '';
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
