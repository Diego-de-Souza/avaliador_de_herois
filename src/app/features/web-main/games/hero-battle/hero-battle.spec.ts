import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroBattle } from './hero-battle';

describe('HeroBattle', () => {
  let component: HeroBattle;
  let fixture: ComponentFixture<HeroBattle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBattle]
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
