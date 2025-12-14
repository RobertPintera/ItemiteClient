import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidHistory } from './bid-history';

describe('BidHistory', () => {
  let component: BidHistory;
  let fixture: ComponentFixture<BidHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
