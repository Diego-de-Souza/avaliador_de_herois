import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaHeroesComponent } from './busca-heroes.component';

describe('BuscaHeroesComponent', () => {
  let component: BuscaHeroesComponent;
  let fixture: ComponentFixture<BuscaHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaHeroesComponent]
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
