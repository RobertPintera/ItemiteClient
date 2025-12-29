import { ProductListingDTO } from '../models/product-listings/ProductListingDTO';
import { AuctionListingDTO } from '../models/auction-listing/AuctionListingDTO';

export function isProductListing(article: ProductListingDTO | AuctionListingDTO | null): article is ProductListingDTO {
  return !!article &&
    typeof (article as ProductListingDTO).price === 'number' &&
    typeof (article as ProductListingDTO).owner === 'object' &&
    Array.isArray((article as ProductListingDTO).images) &&
    typeof (article as ProductListingDTO).mainImageUrl === 'string';
}

export function isAuctionListing(article: ProductListingDTO | AuctionListingDTO | null): article is AuctionListingDTO {
  return !!article &&
    typeof (article as AuctionListingDTO).startingBid === 'number' &&
    (typeof (article as AuctionListingDTO).currentBid === 'number' || (article as AuctionListingDTO).currentBid === null) &&
    typeof (article as AuctionListingDTO).dateEnds === 'string' &&
    typeof (article as AuctionListingDTO).owner === 'object' &&
    Array.isArray((article as AuctionListingDTO).images) &&
    typeof (article as AuctionListingDTO).mainImageUrl === 'string';
}
