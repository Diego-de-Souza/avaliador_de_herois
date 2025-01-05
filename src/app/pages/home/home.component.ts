import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router , RouterLink} from '@angular/router';
import { HeroisService } from '../../service/herois.service';
import { HeroisModel } from '../../Model/herois.model';
import { HeroisMenuModel } from '../../Model/heroisMenu.model';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../../components/banner/banner.component';
import { ArtigosComponent } from '../../components/artigos/artigos.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CuriosidadesComponent } from '../../components/curiosidades/curiosidades.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, ArtigosComponent, FooterComponent, CuriosidadesComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  
}
 

