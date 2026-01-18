import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewHeroesComponent } from './view-heroes.component';

describe('ViewHeroesComponent', () => {
  let component: ViewHeroesComponent;
  let fixture: ComponentFixture<ViewHeroesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHeroesComponent, HttpClientTestingModule, RouterTestingModule]
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
