import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Employee } from '../../../core/interface/employes.interface';
import { Employees } from '../../../core/storage/employees/employeees.data';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit{
  public themeAbout: string | null = 'dark';
  public integrantes: Employee[] = Employees;
  
  constructor(private themeService: ThemeService){}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme =>{
      this.themeAbout = theme;
      this.applyTheme(theme);
    })
  }

  applyTheme(theme: string) {
    const el = document.getElementById('container-about');
    if (theme === 'dark') {
      el?.classList.remove('light');
      el?.classList.add('dark');
    } else {
      el?.classList.remove('dark');
      el?.classList.add('light');
    }
  }
}
