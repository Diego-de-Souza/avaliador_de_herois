import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BuscaHeroesComponent } from './busca-heroes.component';

describe('BuscaHeroesComponent', () => {
  let component: BuscaHeroesComponent;
  let fixture: ComponentFixture<BuscaHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaHeroesComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaHeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
