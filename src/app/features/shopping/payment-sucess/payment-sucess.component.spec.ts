import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PaymentSucessComponent } from './payment-sucess.component';

describe('PaymentSucessComponent', () => {
  let component: PaymentSucessComponent;
  let fixture: ComponentFixture<PaymentSucessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSucessComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
