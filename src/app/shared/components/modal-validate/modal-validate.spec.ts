import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ModalValidate } from './modal-validate';

describe('ModalValidate', () => {
  let component: ModalValidate;
  let fixture: ComponentFixture<ModalValidate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalValidate, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalValidate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
