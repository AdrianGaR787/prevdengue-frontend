import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HatcheryTypeInsert } from './hatchery-type-insert';

describe('HatcheryTypeInsert', () => {
  let component: HatcheryTypeInsert;
  let fixture: ComponentFixture<HatcheryTypeInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HatcheryTypeInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(HatcheryTypeInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
