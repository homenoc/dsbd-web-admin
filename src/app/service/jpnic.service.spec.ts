import { TestBed } from '@angular/core/testing';

import { JpnicService } from './jpnic.service';

describe('JpnicService', () => {
  let service: JpnicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JpnicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
