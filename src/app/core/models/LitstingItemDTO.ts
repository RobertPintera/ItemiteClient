export interface ListingItemDTO {
  id: string;
  name: string;
  location: {
    longitude: number;
    latitude: number;
    country: string;
    city: string;
    state: string;
  }
  dateCreated: string;
  categories: { id: string; name: string }[];
  mainImageUrl: string;
  isFeatured: boolean;
  isArchived: boolean;
  listingType: string;
  price: number;
  isNegotiable: boolean;
  startingBid: number;
  currentBid: number;
}
