import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictList } from './district-list';

describe('DistrictList', () => {
  let component: DistrictList;
  let fixture: ComponentFixture<DistrictList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictList],
    }).compileComponents();

    fixture = TestBed.createComponent(DistrictList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
