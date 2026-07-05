import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomList } from './symptom-list';

describe('SymptomList', () => {
  let component: SymptomList;
  let fixture: ComponentFixture<SymptomList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomList],
    }).compileComponents();

    fixture = TestBed.createComponent(SymptomList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
