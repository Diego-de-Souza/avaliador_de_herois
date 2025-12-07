import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ThemeService } from '../../core/service/theme/theme.service';
import { MenuFilterComponent } from '../../shared/components/menu-filter/menu-filter.component';

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [ CommonModule, HeaderComponent, MenuFilterComponent],
  templateUrl: './ecommerce.component.html',
  styleUrl: './ecommerce.component.css'
})
export class EcommerceComponent implements OnInit{
    themeService:any = inject(ThemeService);

    public themeEcommerce: string | null = 'dark';
    public produtos: any[] = [
        {id: 1, name: 'Produto 1', description: 'Descrição do Produto 1', price: 99.90, imageUrl: 'assets/img/products/produto1.jpg'
        },
        {id: 2, name: 'Produto 2', description: 'Descrição do Produto 2', price: 149.90, imageUrl: 'assets/img/products/produto2.jpg'
        },
        {id: 3, name: 'Produto 3', description: 'Descrição do Produto 3', price: 79.90, imageUrl: 'assets/img/products/produto3.jpg'    
        },
        {id: 4, name: 'Produto 4', description: 'Descrição do Produto 4', price: 199.90, imageUrl: 'assets/img/products/produto4.jpg'    
        },
        {id: 5, name: 'Produto 5', description: 'Descrição do Produto 5', price: 59.90, imageUrl: 'assets/img/products/produto5.jpg'    
        },
        {id: 6, name: 'Produto 6', description: 'Descrição do Produto 6', price: 129.90, imageUrl: 'assets/img/products/produto6.jpg'
        },
        {id: 7, name: 'Produto 7', description: 'Descrição do Produto 7', price: 89.90, imageUrl: 'assets/img/products/produto7.jpg'    
        },
        {id: 8, name: 'Produto 8', description: 'Descrição do Produto 8', price: 159.90, imageUrl: 'assets/img/products/produto8.jpg'    
        }
    ]

    ngOnInit() {
        this.themeService.theme$.subscribe((theme:any) =>{
        this.themeEcommerce = theme;
        this.applyTheme(theme);
        })
    }


    applyTheme(theme: string) {
        const el = document.getElementById('ecommerce-container');
        if (theme === 'dark') {
        el?.classList.remove('light');
        el?.classList.add('dark');
        } else {
        el?.classList.remove('dark');
        el?.classList.add('light');
        }
    }
}