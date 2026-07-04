import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListComponent } from './report-list';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
