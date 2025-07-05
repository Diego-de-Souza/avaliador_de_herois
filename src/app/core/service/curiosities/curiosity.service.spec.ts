import { TestBed } from '@angular/core/testing';

import { CuriosityService } from './curiosity.service';

describe('CuriosityService', () => {
  let service: CuriosityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuriosityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
