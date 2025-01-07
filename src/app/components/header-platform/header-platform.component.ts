import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header-platform',
  standalone: true,
  imports: [NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModule, RouterLink, RouterLinkActive],
  templateUrl: './header-platform.component.html',
  styleUrl: './header-platform.component.css'
})
export class HeaderPlatformComponent {

}
