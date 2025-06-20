import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent implements OnInit{
  public themeAll: string = 'dark';
  email = '';
  mensagem = '';

  ngOnInit(): void { this.upTheme();}

  inscrever() {
    // Aqui você pode integrar com API ou backend futuramente
    if (this.email) {
      this.mensagem = `Obrigado por se inscrever, ${this.email}! 🎉`;
      this.email = '';
      setTimeout(() => {
        this.mensagem = '';
      }, 5000);
    }
  }

  upTheme(){
    let themeHeader = document.getElementById('theme_header');
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
}
