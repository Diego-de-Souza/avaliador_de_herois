import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.css'
})
export class MenuUserComponent implements OnInit {
  @Output() isNotLogged = new EventEmitter<boolean>();
  private router: Router = inject(Router);
  public authService: AuthService = inject(AuthService);
  public userName: string = '';

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
