export interface PutAuctionListingDTO {
  name: string;
  description: string;
  locationLongitude: number;
  locationLatitude: number;
  locationCountry: string;
  locationCity: string;
  locationState: string;
  categoryId: number;
  startingBid: number | null;
  existingPhotoIds: number[];
  existingPhotoOrders: number[];
  dateEnds: string;
  newImages: File[];
  newImageOrders: number[];
}
