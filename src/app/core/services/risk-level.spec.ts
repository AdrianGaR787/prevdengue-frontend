import { TestBed } from '@angular/core/testing';

import { RiskLevel } from './risk-level';

describe('RiskLevel', () => {
  let service: RiskLevel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskLevel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
