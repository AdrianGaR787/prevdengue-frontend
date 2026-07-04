import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveAlertsDashboard } from './predictive-alerts-dashboard';

describe('PredictiveAlertsDashboard', () => {
  let component: PredictiveAlertsDashboard;
  let fixture: ComponentFixture<PredictiveAlertsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictiveAlertsDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictiveAlertsDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
