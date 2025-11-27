import { TestBed } from '@angular/core/testing';

import { ProductListingService } from './product-listing.service';

describe('ProductListingService', () => {
  let service: ProductListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
