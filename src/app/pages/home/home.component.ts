import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router , RouterLink} from '@angular/router';
import { HeroisService } from '../../service/herois.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  statusEditora:Number = 0;
  statusEquipe:Number = 0;
  statusOrigem:Number = 0;
  statusAno:Number = 0;
  statusMoralidade:Number =0;
  statusSexo:Number = 0;
  anoLancamento: Number = 0;

  constructor(private router:Router, private el: ElementRef, private renderer: Renderer2, private searchHerois: HeroisService){ }

  openEditoras(){
    const modalidadeEditora = this.el.nativeElement.querySelector('.submenuEditora');
    if(this.statusEditora === 0){
      this.renderer.setStyle(modalidadeEditora, 'display','flex');
      this.statusEditora = 1;
    }else{
      this.renderer.setStyle(modalidadeEditora,  'display', 'none');
      this.statusEditora =0;
    }
  }

  openEquipe(){
    const modalidadeEquipe = this.el.nativeElement.querySelector('.submenuEquipe');
    if(this.statusEquipe === 0){
      this.renderer.setStyle(modalidadeEquipe, 'display', 'flex');
      this.statusEquipe = 1;
    }else{
      this.renderer.setStyle(modalidadeEquipe, 'display', 'none');
      this.statusEquipe = 0;
    }
  }

  openOrigem(){
    const modalidadeOrigem = this.el.nativeElement.querySelector('.submenuOrigem');
    if(this.statusOrigem === 0){
      this.renderer.setStyle(modalidadeOrigem, 'display', 'flex');
      this.statusOrigem = 1;
    }else{
      this.renderer.setStyle(modalidadeOrigem, 'display', 'none');
      this.statusOrigem = 0;
    }
  }

  openAno(){
    const modalidadeAno = this.el.nativeElement.querySelector('.submenuAno');
    if(this.statusAno === 0){
      this.renderer.setStyle(modalidadeAno, 'display', 'flex');
      this.statusAno = 1;
    }else{
      this.renderer.setStyle(modalidadeAno, 'display', 'none');
      this.statusAno = 0;
    }
  }

  openMoralidade(){
    const modalidadeMoralidade = this.el.nativeElement.querySelector('.submenuMoralidade');
    if(this.statusMoralidade === 0){
      this.renderer.setStyle(modalidadeMoralidade, 'display', 'flex');
      this.statusMoralidade = 1;
    }else{
      this.renderer.setStyle(modalidadeMoralidade, 'display', 'none');
      this.statusMoralidade = 0;
    }
  }

  openSexo(){
    const modalidadeSexo = this.el.nativeElement.querySelector('.submenuSexo');
    if(this.statusSexo === 0){
      this.renderer.setStyle(modalidadeSexo, 'display', 'flex');
      this.statusSexo = 1;
    }else{
      this.renderer.setStyle(modalidadeSexo, 'display', 'none');
      this.statusSexo = 0;
    }
  }

  buscaPorAno(){
    this.searchHerois.searchHeroes(this.anoLancamento).subscribe(results => {
      this.router.navigate(['/cards'], { state: { searchResults: results } });
    });
  }
}
 

