import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.css'
})
export class MenuUserComponent {
  @Output() isNotLogged = new EventEmitter<boolean>();

  constructor(private router: Router){}
  
  goConfig(){
    localStorage.setItem('returnUrl', this.router.url);  

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

