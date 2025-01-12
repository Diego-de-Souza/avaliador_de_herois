import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHeroesComponent } from './view-heroes.component';

describe('ViewHeroesComponent', () => {
  let component: ViewHeroesComponent;
  let fixture: ComponentFixture<ViewHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHeroesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
