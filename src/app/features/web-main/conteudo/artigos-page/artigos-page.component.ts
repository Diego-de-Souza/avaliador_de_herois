import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { NewsletterComponent } from '../../../../shared/components/newsletter/newsletter.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ArtigosComponent } from '../../../../shared/components/artigos/artigos.component';


@Component({
  selector: 'app-artigos-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ArtigosComponent,
    NewsletterComponent,
    FooterComponent],
  templateUrl: './artigos-page.component.html',
  styleUrl: './artigos-page.component.css'
})
export class ArtigosPageComponent {

}
