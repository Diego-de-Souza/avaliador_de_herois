import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEcommerce } from './card-ecommerce';

describe('CardEcommerce', () => {
  let component: CardEcommerce;
  let fixture: ComponentFixture<CardEcommerce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEcommerce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEcommerce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
