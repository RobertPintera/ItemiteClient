import { ProductListingDTO } from '../models/product-listings/ProductListingDTO';
import { AuctionListingDTO } from '../models/auction-listing/AuctionListingDTO';
import {LISTING_TYPES, ListingType, SORT_DIRECTION, SortBy, SortDirection, SORTS_BY} from '../constants/constants';

export function isListingType(value: unknown): value is ListingType {
  return Object.values(LISTING_TYPES).includes(value as ListingType);
}

export function isSortDirection(value: unknown): value is SortDirection {
  return Object.values(SORT_DIRECTION).includes(value as SortDirection);
}

export function isSortBy(value: unknown): value is SortBy {
  return Object.values(SORTS_BY).includes(value as SortBy);
}

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
