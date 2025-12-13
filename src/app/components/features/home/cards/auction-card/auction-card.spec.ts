import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCard } from './auction-card';

describe('AuctionCard', () => {
  let component: AuctionCard;
  let fixture: ComponentFixture<AuctionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionCard]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuctionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
