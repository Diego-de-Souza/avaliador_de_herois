import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router , RouterLink, RouterLinkActive} from '@angular/router';
import { HeroisService } from '../../../service/herois.service';
import { HeroisModel } from '../../../Model/herois.model';
import { HeroisMenuModel } from '../../../Model/heroisMenu.model';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-busca-heroes',
  standalone: true,
  imports: [RouterLinkActive, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './busca-heroes.component.html',
  styleUrl: './busca-heroes.component.css'
})
export class BuscaHeroesComponent implements OnInit{
  statusEditora:Number = 0;
  statusEquipe:Number = 0;
  statusOrigem:Number = 0;
  statusAno:Number = 0;
  statusMoralidade:Number =0;
  statusSexo:Number = 0;
  anoLancamento: string = '';

  herois: HeroisModel[] = [];
  heroisMenuEditora: any[]=[];
  heroisMenuEquipe: any[]=[];
  heroisMenuMoralidade: any[]=[];
  heroisMenuOrigem: any[]=[];
  heroisMenuSexo: any[]=[];

  constructor(private router:Router, private el: ElementRef, private renderer: Renderer2, private searchHerois: HeroisService){ }
  ngOnInit(): void {
    this.getDadosMenu();
  }

  getDadosMenu(): void {

    this.searchHerois.getDadosMenu().subscribe({
      next: (data) => {
        this.heroisMenuEditora = data[0];
        this.heroisMenuEquipe = data[1];
        this.heroisMenuMoralidade = data[2];
        this.heroisMenuOrigem = data[3];
        this.heroisMenuSexo = data[4];
        console.log(data);
      },
      error: (error) => {
        console.error('Erro ao carregar heróis', error);
      }
    });
  }

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

  openForPublisher(editora: number): void {
    this.router.navigate(['/cards'], { queryParams: { editora } });
  }

  openForTeam(team: string):void{
    this.router.navigate(['/cards'], {queryParams: {team}});
  }

  openForOrigin(origin:string): void{
    this.router.navigate(['/cards'], { queryParams: {origin}});
  }

  buscaPorAno() {
    // Navega para a rota '/cards' passando o ano de lançamento como queryParams
    this.router.navigate(['/cards'], { queryParams: { anoLancamento: this.anoLancamento } });
  }

  openForMorality(morality:string):void{
    this.router.navigate(['/cards'], {queryParams:{morality}});
  }

  openForSexy(sexy: string): void{
    this.router.navigate(['/cards'], {queryParams:{sexy}});
  }
}
