import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-change-password-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  isOpen = input<boolean>(false);
  closed = output<void>();
  success = output<void>();

  isLoading = signal(false);
  errorMessage = signal('');

  readonly form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    { validators: this.passwordsMatchValidator }
  );

  private passwordsMatchValidator(group: AbstractControl): { passwordsMismatch: boolean } | null {
    const g = group as FormGroup;
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }

  close(): void {
    this.form.reset();
    this.errorMessage.set('');
    this.closed.emit();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.form.errors?.['passwordsMismatch']) {
      this.form.markAllAsTouched();
      return;
    }

    const { password } = this.form.getRawValue();
    if (!password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.changePassword(password);
      this.success.emit();
      this.close();
    } catch {
      this.errorMessage.set('Erro ao alterar a senha. Tente novamente.');
    } finally {
      this.isLoading.set(false);
      this.cdr.markForCheck();
    }
  }
}
