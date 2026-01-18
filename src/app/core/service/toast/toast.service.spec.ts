import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

describe('ToastService', () => {
  let service: ToastService;
  let matDialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    const matDialogMock = {
      open: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MatDialog, useValue: matDialogMock }
      ]
    });
    service = TestBed.inject(ToastService);
    matDialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success toast', () => {
    const id = service.success('Success message', 'Success');
    expect(id).toBeDefined();
    service.toasts$.subscribe(toasts => {
      const toast = toasts.find(t => t.id === id);
      expect(toast?.type).toBe('success');
      expect(toast?.message).toBe('Success message');
      expect(toast?.title).toBe('Success');
    });
  });

  it('should show error toast', () => {
    const id = service.error('Error message', 'Error');
    expect(id).toBeDefined();
    service.toasts$.subscribe(toasts => {
      const toast = toasts.find(t => t.id === id);
      expect(toast?.type).toBe('error');
      expect(toast?.message).toBe('Error message');
      expect(toast?.title).toBe('Error');
    });
  });

  it('should show info toast', () => {
    const id = service.info('Info message', 'Info');
    expect(id).toBeDefined();
    service.toasts$.subscribe(toasts => {
      const toast = toasts.find(t => t.id === id);
      expect(toast?.type).toBe('info');
      expect(toast?.message).toBe('Info message');
      expect(toast?.title).toBe('Info');
    });
  });

  it('should show warning toast', () => {
    const id = service.warning('Warning message', 'Warning');
    expect(id).toBeDefined();
    service.toasts$.subscribe(toasts => {
      const toast = toasts.find(t => t.id === id);
      expect(toast?.type).toBe('warning');
      expect(toast?.message).toBe('Warning message');
      expect(toast?.title).toBe('Warning');
    });
  });

  it('should add toast to toasts$ observable', (done) => {
    service.toasts$.subscribe(toasts => {
      if (toasts.length > 0 && toasts[0].type === 'success') {
        expect(toasts[0].type).toBe('success');
        done();
      }
    });
    service.success('Test message');
  });

  it('should remove toast by id', () => {
    const id = service.success('Test message');
    service.remove(id);
    service.toasts$.subscribe(toasts => {
      expect(toasts.find(t => t.id === id)).toBeUndefined();
    });
  });

  it('should clear all toasts', () => {
    service.success('Message 1');
    service.error('Message 2');
    service.clear();
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(0);
    });
  });

  it('should show payment success toast', () => {
    service.paymentSuccess(100, 'payment-123');
    service.toasts$.subscribe(toasts => {
      const toast = toasts.find(t => t.type === 'success' && t.message.includes('R$'));
      expect(toast).toBeDefined();
      expect(toast?.type).toBe('success');
      expect(toast?.message).toContain('R$');
    });
  });

  it('should show payment error toast', () => {
    service.paymentError('Payment failed');
    service.toasts$.subscribe(toasts => {
      const toast = toasts.find(t => t.type === 'error' && t.message === 'Payment failed');
      expect(toast).toBeDefined();
      expect(toast?.type).toBe('error');
      expect(toast?.message).toBe('Payment failed');
    });
  });
});
