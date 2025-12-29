export  interface PutProductListingDTO {
  name: string;
  description: string;
  locationLongitude: number;
  locationLatitude: number;
  locationCountry: string;
  locationCity: string;
  locationState: string;
  price: number;
  isNegotiable: boolean;
  categoryId: number;
  existingPhotoIds: number[];
  existingPhotoOrders: number[];
  newImages: File[];
  newImageOrders: number[];
}
