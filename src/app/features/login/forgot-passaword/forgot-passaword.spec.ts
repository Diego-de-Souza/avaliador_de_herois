import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassaword } from './forgot-passaword';

describe('ForgotPassaword', () => {
  let component: ForgotPassaword;
  let fixture: ComponentFixture<ForgotPassaword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassaword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassaword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
