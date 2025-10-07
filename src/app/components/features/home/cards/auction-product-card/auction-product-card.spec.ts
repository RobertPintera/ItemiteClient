import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionProductCard } from './auction-product-card';

describe('AuctionProductCard', () => {
  let component: AuctionProductCard;
  let fixture: ComponentFixture<AuctionProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionProductCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
