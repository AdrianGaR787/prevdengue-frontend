import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictInsert } from './district-insert';

describe('DistrictInsert', () => {
  let component: DistrictInsert;
  let fixture: ComponentFixture<DistrictInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(DistrictInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
