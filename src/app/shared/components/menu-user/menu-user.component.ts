import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';
import { ToastService } from '../../../core/service/toast/toast.service';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [RouterModule, CommonModule, ChangePasswordModalComponent],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.css'
})
export class MenuUserComponent implements OnInit {
  @Output() isNotLogged = new EventEmitter<boolean>();
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  public authService = inject(AuthService);
  public userName = '';
  showChangePasswordModal = false;

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  onPasswordChanged() {
    this.toastService.success('Senha alterada com sucesso!');
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.userName = user?.nickname || '';
    });
  }

  goConfig() {
    const currentUrl = this.router.url;
    if (!currentUrl.includes('user-config')) {
      localStorage.setItem('returnUrl', currentUrl);
    }
    this.router.navigate(['/plataforma/user-config']);
  }

  logout() {
    const data = false;
    this.isNotLogged.emit(data);
    localStorage.clear();
    sessionStorage.clear();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
