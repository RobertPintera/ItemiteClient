import { ProductListingDTO } from '../models/product-listings/ProductListingDTO';
import { AuctionListingDTO } from '../models/auction-listing/AuctionListingDTO';

export function isProductListing(article: ProductListingDTO | AuctionListingDTO | null): article is ProductListingDTO {
  return !!article &&
    'price' in article &&
    typeof (article as ProductListingDTO).owner === 'object' &&
    Array.isArray((article as ProductListingDTO).images);
}

export function isAuctionListing(article: ProductListingDTO | AuctionListingDTO | null): article is AuctionListingDTO {
  return !!article &&
    'startingBid' in article &&
    (typeof (article as AuctionListingDTO).currentBid === 'number' || (article as AuctionListingDTO).currentBid === null) &&
    typeof (article as AuctionListingDTO).owner === 'object' &&
    Array.isArray((article as AuctionListingDTO).images);
}
