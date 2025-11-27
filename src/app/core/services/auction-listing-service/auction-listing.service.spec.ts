import { TestBed } from '@angular/core/testing';

import { AuctionListingService } from './auction-listing.service';

describe('AuctionListingService', () => {
  let service: AuctionListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
