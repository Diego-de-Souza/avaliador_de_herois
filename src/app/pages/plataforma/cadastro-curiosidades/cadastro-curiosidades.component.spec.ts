import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCuriosidadesComponent } from './cadastro-curiosidades.component';

describe('CadastroCuriosidadesComponent', () => {
  let component: CadastroCuriosidadesComponent;
  let fixture: ComponentFixture<CadastroCuriosidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCuriosidadesComponent]
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
