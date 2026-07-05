import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningEventsInsert } from './cleaning-events-insert';

describe('CleaningEventsInsert', () => {
  let component: CleaningEventsInsert;
  let fixture: ComponentFixture<CleaningEventsInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningEventsInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(CleaningEventsInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
