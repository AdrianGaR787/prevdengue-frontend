import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomInsert } from './symptom-insert';

describe('SymptomInsert', () => {
  let component: SymptomInsert;
  let fixture: ComponentFixture<SymptomInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(SymptomInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
