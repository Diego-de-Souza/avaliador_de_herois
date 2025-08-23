import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../core/service/theme/theme.service';

@Component({
  selector: 'app-preferences-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences-user.component.html',
  styleUrl: './preferences-user.component.css'
})
export class PreferencesUserComponent implements OnInit{
  private themeService: ThemeService = inject(ThemeService)

  preferencias = {
    tema: 'claro',
    idioma: 'pt',
    notificacoes: {
      sons: true,
      push: false,
      email: true
    },
    heroisFavoritos: []
  };

  listaHerois = ['Superman', 'Batman', 'Mulher-Maravilha', 'Flash', 'Aquaman'];

  ngOnInit() {
    this.preferencias.tema = this.themeService.getTheme();
  }

  salvarPreferencias() {
    this.themeService.setTheme(this.preferencias.tema);
  }
}
