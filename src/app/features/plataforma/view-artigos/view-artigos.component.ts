import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { HeaderPlatformComponent } from '../../../shared/components/header-platform/header-platform.component';

@Component({
  selector: 'app-view-artigos',
  standalone: true,
  imports: [HeaderPlatformComponent],
  templateUrl: './view-artigos.component.html',
  styleUrl: './view-artigos.component.css'
})
export class ViewArtigosComponent {

}
