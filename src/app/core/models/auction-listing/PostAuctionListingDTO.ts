export interface PostAuctionListingDTO {
  name: string;
  description: string;
  locationLongitude: number;
  locationLatitude: number;
  locationCountry: string;
  locationCity: string;
  locationState: string;
  categoryId: number;
  startingBid: number;
  dateEnds: string;
  images: File[];
  imageOrders: number[];
}
