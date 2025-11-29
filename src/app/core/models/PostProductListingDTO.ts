export interface PostProductListingDTO {
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
  images: File[];
  imageOrders: number[];
}
