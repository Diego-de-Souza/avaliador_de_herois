import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CadastroTeamComponent } from './cadastro-team.component';

describe('CadastroTeamComponent', () => {
  let component: CadastroTeamComponent;
  let fixture: ComponentFixture<CadastroTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroTeamComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
