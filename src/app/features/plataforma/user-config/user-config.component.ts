import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.css'
})
export class UserConfigComponent {
  public userSettingsForm: FormGroup;
  avatarPreview: string | undefined;

  constructor(private fb: FormBuilder){
    this.userSettingsForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      nickname: ['', [Validators.minLength(3)]],
      email: ['', [Validators.email]],
      secondemail: ['', [Validators.email]],
      birthdate: ['', Validators.required],
      emailNotifications: [true],
      uf: ['', [Validators.required, Validators.maxLength(3)]],
      address: ['', Validators.required],
      complement: [''],
      cep: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      newPassword: [''],
      confirmNewPassword: ['']
    }, {
      validators: this.passwordsMatchValidator()
    });
  }

  passwordsMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('newPassword')?.value;
      const confirmPassword = form.get('confirmNewPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
    };
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSaveSettings(){

  }

  isFieldInvalid(field: string): boolean {
    const control = this.userSettingsForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

}
