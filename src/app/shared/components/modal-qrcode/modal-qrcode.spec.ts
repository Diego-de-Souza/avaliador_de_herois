import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQrcode } from './modal-qrcode';

describe('ModalQrcode', () => {
  let component: ModalQrcode;
  let fixture: ComponentFixture<ModalQrcode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalQrcode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalQrcode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
