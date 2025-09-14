import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from "@angular/common";
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-modal-validate',
  imports: [CommonModule],
  templateUrl: './modal-validate.html',
  styleUrl: './modal-validate.css'
})
export class ModalValidate implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);
  private authService: AuthService = inject(AuthService);
  @Input() loading = false;
  @Input() message = '';
  @Output() close = new EventEmitter<void>();
  @Output() codeValidated = new EventEmitter<string>();

  public _themeService = 'dark';

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme =>{
      this._themeService = theme;
    })
  }

  codeChars: string[] = Array(9).fill('');

  onCharInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (value.length > 1) value = value[0];
    this.codeChars[index] = value;
    input.value = value;
    if (value && index < 8) {
      setTimeout(() => {
        const inputs = input.parentElement!.querySelectorAll('input');
        const nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      });
    }
  }

  onCharKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (this.codeChars[index] === '' && index > 0) {
        const inputs = input.parentElement!.querySelectorAll('input');
        const prevInput = inputs[index - 1] as HTMLInputElement;
        if (prevInput) prevInput.focus();
      }
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  validate() {
    this.codeValidated.emit(this.codeChars.join(''));
  }

  closeModal() {
    this.close.emit();
  }

}
