import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  public isLoggedIn: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    const logged = localStorage.getItem('access_token') || '';
    
    if(logged){
      this.isLoggedIn = true;
    }
  }

  receiveData(data: boolean) {
    this.isLoggedIn = data; 
  }

  ngOnChange(){
    
  }
}
