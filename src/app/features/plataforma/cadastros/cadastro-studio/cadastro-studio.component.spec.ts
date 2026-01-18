import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CadastroStudioComponent } from './cadastro-studio.component';

describe('CadastroStudioComponent', () => {
  let component: CadastroStudioComponent;
  let fixture: ComponentFixture<CadastroStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroStudioComponent, RouterTestingModule, HttpClientTestingModule]
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
