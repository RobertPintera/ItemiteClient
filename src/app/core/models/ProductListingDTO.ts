export interface ProductListingDTO {
  id: string;
  name: string;
  description: string;
  locationLongitude: number;
  locationLatitude: number;
  locationCountry: string;
  locationCity: string;
  locationState: string;
  price: number;
  categoryId: string;
  isNegotiable: boolean;
  ImageOrders: number[];
  images: string[]
}
