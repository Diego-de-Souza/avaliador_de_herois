import { Component, OnInit } from '@angular/core';
import { dadosLogradouros } from '../../data/logradouro';
import { LogradouroModel } from '../../Model/logradouro.model';
import {dadosEstado} from '../../data/estado';
import {EstadoModel} from '../../Model/estado.model';
import {faUser, faUserTag, faCalendarDays, faEnvelope, faMapLocationDot, faCircleCheck, faMap, faSignsPost, faCity, faVihara} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports:[FontAwesomeModule ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  logradouro: LogradouroModel[] = [];
  estados: EstadoModel[] = [];

  faUser = faUser;
  faUserTag = faUserTag;
  faCalendarDays= faCalendarDays;
  faEnvelope=faEnvelope;
  faMapLocationDot=faMapLocationDot;
  faCircleCheck=faCircleCheck;
  faMap=faMap;
  faSignsPost=faSignsPost;
  faCity=faCity;
  faVihara=faVihara;

  constructor() {}

  ngOnInit() {
    this.logradouro = dadosLogradouros;
    this.estados = dadosEstado;

    console.log(this.logradouro);
  }
}
