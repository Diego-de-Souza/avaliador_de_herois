import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuUserComponent } from '../menu-user/menu-user.component';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, MenuUserComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public themeAll: string = 'dark';
  public isLoggedIn: boolean = false;
  
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
    if (theme === 'dark') {
      themeHeader?.classList.remove('light');
      themeHeader?.classList.add('dark');
    } else {
      themeHeader?.classList.remove('dark');
      themeHeader?.classList.add('light');
    }
  }
}
