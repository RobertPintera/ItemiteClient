export interface PostProductListingDTO {
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
  images: File[];
  imageOrders: number[];
}
