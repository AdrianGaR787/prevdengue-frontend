import { TestBed } from '@angular/core/testing';

import { RiskInsert } from './risk-insert';

describe('RiskInsert', () => {
  let service: RiskInsert;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskInsert);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
