import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  public themeFooter:string = 'dark'

  constructor(private themeService: ThemeService){}

  ngOnInit(){
    this.themeService.theme$.subscribe(theme => {
      this.themeFooter = theme;
      this.applyTheme(theme);
    })
  }

  applyTheme(theme: string) {
    const themeHeader = document.getElementById('footer');
    if (theme === 'dark') {
      themeHeader?.classList.remove('light');
      themeHeader?.classList.add('dark');
    } else {
      themeHeader?.classList.remove('dark');
      themeHeader?.classList.add('light');
    }
  }
}
