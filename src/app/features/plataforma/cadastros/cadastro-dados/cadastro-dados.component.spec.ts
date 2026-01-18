import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CadastroDadosComponent } from './cadastro-dados.component';

describe('CadastroDadosComponent', () => {
  let component: CadastroDadosComponent;
  let fixture: ComponentFixture<CadastroDadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDadosComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
