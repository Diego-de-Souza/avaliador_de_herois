import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { guardPlataformaGuard } from './guard-plataforma.guard';

describe('guardPlataformaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardPlataformaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
