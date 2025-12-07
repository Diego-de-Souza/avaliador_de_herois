import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-menu-filter',
  standalone: true,
  imports: [],
  templateUrl: './menu-filter.component.html',
  styleUrl: './menu-filter.component.css'
})
export class MenuFilterComponent implements OnInit{
    themeService: any = inject(ThemeService);

    public themeMenuFilter: string | null = 'dark';

    ngOnInit() {
        this.themeService.theme$.subscribe((theme:any) =>{
        this.themeMenuFilter = theme;
        this.applyTheme(theme);
        })
    }

    applyTheme(theme: string) {
        const el = document.getElementById('menu-filter-container');
        if (theme === 'dark') {
        el?.classList.remove('light');
        el?.classList.add('dark');
        } else {
        el?.classList.remove('dark');
        el?.classList.add('light');
        }
    }
}