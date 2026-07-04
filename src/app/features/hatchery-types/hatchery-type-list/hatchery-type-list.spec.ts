import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatcheryTypeList } from './hatchery-type-list';

describe('HatcheryTypeList', () => {
  let component: HatcheryTypeList;
  let fixture: ComponentFixture<HatcheryTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatcheryTypeList],
    }).compileComponents();

    fixture = TestBed.createComponent(HatcheryTypeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
