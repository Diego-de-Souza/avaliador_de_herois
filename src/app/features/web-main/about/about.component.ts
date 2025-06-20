import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Employee } from '../../../core/interface/employes.interface';
import { Employees } from '../../../core/storage/employees/employeees.data';

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
  
  ngOnInit() {
    this.updateTheme();
    window.addEventListener('storage', () => this.updateTheme());
  }

  updateTheme(){
    this.themeAbout = localStorage.getItem('theme');
    let classTheme = document.getElementById('container-about')
    if(this.themeAbout === 'light'){
      classTheme?.classList.add('light');
      classTheme?.classList.remove('dark');
    }else{
      classTheme?.classList.add('dark');
      classTheme?.classList.remove('light');
    }
  }
}
