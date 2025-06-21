import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent implements OnInit{
  public themenewsLetter: string = 'dark';
  email = '';
  mensagem = '';

  constructor(private themeService: ThemeService){}

  ngOnInit(): void { 
    this.themeService.theme$.subscribe(theme => {
      this.themenewsLetter = theme;
      this.applyTheme(theme);
    })
  }

  inscrever() {
    if (this.email) {
      this.mensagem = `Obrigado por se inscrever, ${this.email}! 🎉`;
      this.email = '';
      setTimeout(() => {
        this.mensagem = '';
      }, 5000);
    }
  }

  applyTheme(theme: string) {
    const el = document.getElementById('theme_newsletter');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
