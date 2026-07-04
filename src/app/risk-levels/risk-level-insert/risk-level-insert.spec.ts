import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLevelInsert } from './risk-level-insert';

describe('RiskLevelInsert', () => {
  let component: RiskLevelInsert;
  let fixture: ComponentFixture<RiskLevelInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskLevelInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskLevelInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
