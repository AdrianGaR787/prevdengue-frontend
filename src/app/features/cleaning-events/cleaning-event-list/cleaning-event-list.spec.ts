import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningEventList } from './cleaning-event-list';

describe('CleaningEventList', () => {
  let component: CleaningEventList;
  let fixture: ComponentFixture<CleaningEventList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleaningEventList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CleaningEventList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
