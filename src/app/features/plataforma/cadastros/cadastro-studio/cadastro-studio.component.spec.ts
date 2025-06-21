import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroStudioComponent } from './cadastro-studio.component';

describe('CadastroStudioComponent', () => {
  let component: CadastroStudioComponent;
  let fixture: ComponentFixture<CadastroStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
