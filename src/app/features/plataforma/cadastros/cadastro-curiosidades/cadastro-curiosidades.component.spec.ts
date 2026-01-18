import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CadastroCuriosidadesComponent } from './cadastro-curiosidades.component';

describe('CadastroCuriosidadesComponent', () => {
  let component: CadastroCuriosidadesComponent;
  let fixture: ComponentFixture<CadastroCuriosidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCuriosidadesComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCuriosidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
