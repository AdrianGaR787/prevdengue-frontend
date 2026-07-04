import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLevelList } from './risk-level-list';

describe('RiskLevelList', () => {
  let component: RiskLevelList;
  let fixture: ComponentFixture<RiskLevelList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskLevelList],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskLevelList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
