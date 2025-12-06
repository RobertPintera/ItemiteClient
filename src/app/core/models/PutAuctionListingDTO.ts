export interface PutAuctionListingDTO {
  name: string;
  description: string;
  locationLongitude: number;
  locationLatitude: number;
  locationCountry: string;
  locationCity: string;
  locationState: string;
  categoryId: number;
  startingBid: number;
  existingPhotoIds: number[];
  existingPhotoOrders: number[];
  newImages: File[];
  newImageOrders: number[];
}
