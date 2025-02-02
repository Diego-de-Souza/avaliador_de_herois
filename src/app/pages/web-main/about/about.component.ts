import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit{
  public themeAbout: string | null = 'dark';
  public integrantes = [
    {
      foto: 'assets/img/about/diego.jpeg',
      nome: 'Diego de Souza',
      funcao: 'Idealizador e Desenvolvedor FullStack',
      descricao: 'O cérebro por trás do projeto! Diego não só desenhou a estrutura e cuida do front como também é o visionário que transforma ideias em realidade. Quando não está codando, está reimaginando o próximo grande passo.'
    },
    {
      foto: 'assets/img/about/lucas.jpeg',
      nome: 'Lucas O. Silva',
      funcao: 'Desenvolvedor Back-End e Designer',
      descricao: 'Guarda os segredos da API e do banco de dados com maestria, enquanto dá aquele toque final com edição de imagens impecáveis. Lucas é onde lógica e criatividade se encontram.'
    },
    {
      foto: 'assets/img/about/keven.jpeg',
      nome: 'Keven',
      funcao: 'Pesquisador',
      descricao: 'O explorador incansável do time! Keven combina paixão por heróis com habilidade para encontrar as melhores referências e inovações, garantindo que o projeto esteja sempre à frente.'
    }
  ];
  
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
