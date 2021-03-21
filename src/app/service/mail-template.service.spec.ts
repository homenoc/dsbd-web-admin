import { TestBed } from '@angular/core/testing';

import { MailTemplateService } from './mail-template.service';

describe('MailTemplateService', () => {
  let service: MailTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
