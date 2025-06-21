import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuUserComponent } from '../menu-user/menu-user.component';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, MenuUserComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public themeAll: string = 'dark';
  public isLoggedIn: boolean = false;
  public isMobile = false;
  public isMenuOpen = false;
  submenuOpen = false;
  
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    const logged = localStorage.getItem('access_token') || '';
    if (logged) {
      this.isLoggedIn = true;
    }

    this.themeService.theme$.subscribe(theme => {
      this.themeAll = theme;
      this.applyTheme(theme);
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
    const newTheme = this.themeAll === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(newTheme);
  }

  applyTheme(theme: string) {
    const themeHeader = document.getElementById('theme_header');
    const themeHeaderMobile = document.getElementById('mobile-header-top')
    if (theme === 'dark') {
      themeHeader?.classList.remove('light');
      themeHeader?.classList.add('dark');
      themeHeaderMobile?.classList.remove('light');
      themeHeaderMobile?.classList.add('dark');
    } else {
      themeHeader?.classList.remove('dark');
      themeHeader?.classList.add('light');
      themeHeaderMobile?.classList.remove('dark');
      themeHeaderMobile?.classList.add('light');
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.submenuOpen = false;
  }
}
