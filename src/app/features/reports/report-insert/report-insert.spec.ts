import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInsertComponent } from './report-insert';

describe('ReportInsertComponent', () => {
  let component: ReportInsertComponent;
  let fixture: ComponentFixture<ReportInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportInsertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportInsertComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
