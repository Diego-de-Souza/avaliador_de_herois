import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSucessoCadastroComponent } from './modal-sucesso-cadastro.component';

describe('ModalSucessoCadastroComponent', () => {
  let component: ModalSucessoCadastroComponent;
  let fixture: ComponentFixture<ModalSucessoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSucessoCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSucessoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
