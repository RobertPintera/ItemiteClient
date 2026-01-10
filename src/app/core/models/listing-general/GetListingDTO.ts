
import {ListingType, SortBy, SortDirection} from '../../constants/constants';

export interface GetListingDTO {
  pageSize: null | number;
  pageNumber: number;
  listingType: null | ListingType;
  sortBy: null | SortBy;
  sortDirection: null | SortDirection;
  priceFrom: null | number;
  priceTo: null | number;
  longitude: null |number;
  latitude: null |number;
  distance: null |number;
  categoryIds?: number[];
}
