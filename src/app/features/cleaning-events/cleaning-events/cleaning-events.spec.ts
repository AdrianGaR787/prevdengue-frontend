import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningEvents } from './cleaning-events';

describe('CleaningEvents', () => {
  let component: CleaningEvents;
  let fixture: ComponentFixture<CleaningEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(CleaningEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
