import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  email = '';
  mensagem = '';

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
}
