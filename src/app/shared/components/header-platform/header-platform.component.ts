import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuUserComponent } from '../menu-user/menu-user.component';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-header-platform',
  standalone: true,
  imports: [
  // Removido ng-bootstrap
    RouterLink, 
    RouterLinkActive, 
    MenuUserComponent, 
    CommonModule, 
    NgClass
  ],
  templateUrl: './header-platform.component.html',
  styleUrl: './header-platform.component.css'
})
export class HeaderPlatformComponent {

  @Input() isPlataformaAdmin: boolean = false;

  constructor(private authService: AuthService) { }

}
