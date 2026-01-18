import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../core/service/auth/auth.service';

import { Comprovante } from './comprovante';

describe('Comprovante', () => {
  let component: Comprovante;
  let fixture: ComponentFixture<Comprovante>;

  beforeEach(async () => {
    const authServiceMock = {
      getUser: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' })
    };

    await TestBed.configureTestingModule({
      imports: [Comprovante, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { paymentId: 'test-123', items: [] } },
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comprovante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
