export interface ListingFilter {
  pageSize?: number;
  pageNumber?: number;
  listingType?: string;
  sortBy?: string;
  sortDirection?: string;
  priceFrom?: number;
  priceTo?: number;
  longitude?: number;
  latitude?: number;
  distance?: number;
  categoryIds?: number[];
}
