import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuUserComponent } from '../menu-user/menu-user.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';
import { CartIconComponent } from '../cart-icon/cart-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, MenuUserComponent, CommonModule, CartIconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private router: Router= inject(Router);
  private themeService: ThemeService = inject(ThemeService);
  private authService: AuthService = inject(AuthService);

  public _themeAll: string = 'dark';
  public isLoggedIn: boolean = false;
  public isMobile = false;
  public isMenuOpen = false;
  public submenuOpen = false;


  ngOnInit(): void {
    const logged = sessionStorage.getItem('access_token');

    if (logged) {
      this.isLoggedIn = true;
    }


    this.themeService.theme$.subscribe(theme => {
      this._themeAll = theme;
    });

    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 992; 
  }
  receiveData(data: boolean) {
    this.isLoggedIn = data;
  }

  changeTheme() {
    const newTheme = this._themeAll === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  routerSubMenu(rota:string): void{
    switch(rota){
      case 'destaques':
        this.router.navigate(['/webmain/conteudo/destaques']);
        break;
      case 'newsletter':
        this.router.navigate(['/webmain/conteudo/newsletter']);
        break;
      case 'artigos':
        this.router.navigate(['/webmain/conteudo/artigos']);
        break;
      case 'eventos':
        this.router.navigate(['/webmain/conteudo/eventos']);
        break;
    }
  }
}
