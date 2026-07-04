import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionCampaignInsert } from './intervention-campaign-insert';

describe('InterventionCampaignInsert', () => {
  let component: InterventionCampaignInsert;
  let fixture: ComponentFixture<InterventionCampaignInsert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionCampaignInsert],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionCampaignInsert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
