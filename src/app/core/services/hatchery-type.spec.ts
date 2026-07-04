import { TestBed } from '@angular/core/testing';

import { HatcheryType } from './hatchery-type';

describe('HatcheryType', () => {
  let service: HatcheryType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatcheryType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
