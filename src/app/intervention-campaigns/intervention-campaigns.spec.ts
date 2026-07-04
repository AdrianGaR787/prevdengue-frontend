import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionCampaigns } from './intervention-campaigns';

describe('InterventionCampaigns', () => {
  let component: InterventionCampaigns;
  let fixture: ComponentFixture<InterventionCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionCampaigns],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionCampaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
