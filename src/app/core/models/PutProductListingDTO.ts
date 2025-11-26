export  interface PutProductListingDTO {
  name: string;
  description: string;
  locationLongitude: number;
  locationLattitude: number;
  locationCountry: string;
  locationCity: string;
  locationState: string;
  price: number;
  isNegotiable: boolean;
  categoryId: number;
  existingPhotoIds: number[];
  existingPhotoOrders: number[];
  newImages: string[];
  newImageOrders: number[];
}
