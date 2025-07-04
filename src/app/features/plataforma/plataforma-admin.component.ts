import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HeaderPlatformComponent } from "../../shared/components/header-platform/header-platform.component";
import { RouterLink, RouterLinkActive } from "@angular/router";


@Component({
  selector: 'app-plataforma-admin',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, HeaderPlatformComponent, RouterLink, RouterLinkActive,],
  templateUrl: './plataforma-admin.component.html',
  styleUrls: ['./plataforma-admin.component.css']
})
export class PlataformaAdminComponent{
    
}