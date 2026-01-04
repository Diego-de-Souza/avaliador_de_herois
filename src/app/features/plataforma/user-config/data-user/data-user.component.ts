import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { UserService } from '../../../../core/service/user/user.service';

@Component({
  selector: 'app-data-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './data-user.component.html',
  styleUrl: './data-user.component.css'
})
export class DataUserComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService); 
  private userService = inject(UserService);
  public userSettingsForm!: FormGroup;
  avatarPreview: string | undefined;
  

  ngOnInit(): void {
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

    this.getDataUser();
  }

  getDataUser() {
    const token = sessionStorage.getItem('access_token');
    const userData = this.authService.getUser()
    
    this.userService.getFindOneUser(userData.id).subscribe({
    next: (user: any) => {
      const data = user.dataUnit;
      this.userSettingsForm.patchValue({
        fullname: data.fullname,
        nickname: data.nickname,
        birthdate: data.birthdate,
        email: data.firstemail,
        secondemail: data.secondemail,
        uf: data.uf,
        address: data.address,
        complement: data.complement,
        cep: data.cep,
        state: data.state,
        city: data.city,
      });
      this.avatarPreview = data.avatar;
    },
    error: (err: any) => {
      console.error('Error fetching user data:', err);
    }
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

  onSaveSettings() {
    // Implemente a lógica de salvar configurações aqui
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userSettingsForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
}
