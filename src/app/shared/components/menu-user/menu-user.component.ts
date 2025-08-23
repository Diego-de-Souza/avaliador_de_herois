import { CommonModule } from '@angular/common';
import { Component, EventEmitter,inject,OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.css'
})
export class MenuUserComponent implements OnInit{
  @Output() isNotLogged = new EventEmitter<boolean>();
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  public userName: string = '';

  ngOnInit() {
    const logged = sessionStorage.getItem('access_token');
      this.userName = this.authService.decodeJwt(logged!).nickname || '';
  }
  
  goConfig(){
    const currentUrl = this.router.url;
    console.log('entrou na preferencia')
    console.log(currentUrl)
    if (!currentUrl.includes('user-config')) {
      localStorage.setItem('returnUrl', currentUrl);
    }
    this.router.navigate(['/plataforma/user-config']);
    console.log(localStorage.getItem('returnUrl'));

  }

  logout() {
    const data = false;
    this.isNotLogged.emit(data);
    // Remover informações da sessão (se necessário)
    localStorage.clear(); 
    sessionStorage.clear();
    deleteCookie('refresh_token');
    // Redirecionar para a página inicial
    this.router.navigate(['/']);
  }

  
}

function deleteCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

