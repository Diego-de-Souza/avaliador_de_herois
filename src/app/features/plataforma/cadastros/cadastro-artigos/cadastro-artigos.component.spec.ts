import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CadastroArtigosComponent } from './cadastro-artigos.component';

describe('CadastroArtigosComponent', () => {
  let component: CadastroArtigosComponent;
  let fixture: ComponentFixture<CadastroArtigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroArtigosComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroArtigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
