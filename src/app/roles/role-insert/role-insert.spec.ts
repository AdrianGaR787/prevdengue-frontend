import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleInsert } from './role-insert';

describe('RoleInsert', () => {
  let component: RoleInsert;
  let fixture: ComponentFixture<RoleInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
