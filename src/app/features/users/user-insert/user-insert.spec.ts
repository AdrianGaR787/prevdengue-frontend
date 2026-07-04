import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInsert } from './user-insert';

describe('UserInsert', () => {
  let component: UserInsert;
  let fixture: ComponentFixture<UserInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
