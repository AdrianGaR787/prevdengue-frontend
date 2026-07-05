import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomTopusers } from './symptom-topusers';

describe('SymptomTopusers', () => {
  let component: SymptomTopusers;
  let fixture: ComponentFixture<SymptomTopusers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomTopusers],
    }).compileComponents();

    fixture = TestBed.createComponent(SymptomTopusers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
