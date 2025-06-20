import { Component, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuUserComponent } from '../menu-user/menu-user.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, MenuUserComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  public themeAll: string = 'dark';
  public isLoggedIn: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    const logged = localStorage.getItem('access_token') || '';
    
    if(logged){
      this.isLoggedIn = true;
    }

    this.upTheme()
  }

  receiveData(data: boolean) {
    this.isLoggedIn = data; 
  }

  upTheme(){
    let themeHeader = document.getElementById('theme_destaques');
    let getTheme = localStorage.getItem('theme');
    if(getTheme){
      this.themeAll = getTheme;
    }
    if(this.themeAll == "dark"){
      themeHeader?.classList.remove('light');
      themeHeader?.classList.add('dark');
    }else{
      themeHeader?.classList.remove('dark');
      themeHeader?.classList.add('light');
    }
  }

  changeTheme(){
    let themeHeader = document.getElementById('theme_header');
    if(this.themeAll == "dark"){
      this.themeAll = "light";
      localStorage.setItem('theme', this.themeAll);
      window.dispatchEvent(new Event('storage'));
      themeHeader?.classList.remove('dark');
      themeHeader?.classList.add('light');
    }else{
      this.themeAll = "dark";
      localStorage.setItem('theme', this.themeAll);
      window.dispatchEvent(new Event('storage'));
      themeHeader?.classList.remove('light');
      themeHeader?.classList.add('dark');
    }
  }
}
