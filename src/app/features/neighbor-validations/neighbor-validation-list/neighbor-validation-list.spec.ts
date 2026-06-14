import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborValidationList } from './neighbor-validation-list';

describe('NeighborValidationList', () => {
  let component: NeighborValidationList;
  let fixture: ComponentFixture<NeighborValidationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeighborValidationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeighborValidationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
