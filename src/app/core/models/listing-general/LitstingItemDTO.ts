import {BasicCategory} from '../category/BasicCategory';

export interface ListingItemDTO {
  id: number;
  name: string;
  location: {
    longitude: number;
    latitude: number;
    country: string;
    city: string;
    state: string;
  }
  dateCreated: string;
  categories: BasicCategory[];
  mainImageUrl: string;
  isFeatured: boolean;
  isArchived: boolean;
  listingType: string;
  price: number | null;
  isNegotiable: boolean;
  startingBid: number | null;
  currentBid: number | null;
}
