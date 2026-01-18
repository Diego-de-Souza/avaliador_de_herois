import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeroBattle } from './hero-battle';

describe('HeroBattle', () => {
  let component: HeroBattle;
  let fixture: ComponentFixture<HeroBattle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBattle, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroBattle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
