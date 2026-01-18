import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CuriosityService } from './curiosity.service';

describe('CuriosityService', () => {
  let service: CuriosityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CuriosityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
