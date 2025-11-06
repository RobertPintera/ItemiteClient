import {CategoryDTO} from './CategoryDTO';
import {Image} from './Image';
import {LocationDTO} from './LocationDTO';

export interface ProductListingDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  views: number;
  dateCreated: string;
  isArchived: boolean;
  isFeatured: boolean;
  isNegotiable: boolean;
  owner: {
    id: string;
    userName: string;
    email: string;
    location: LocationDTO;
    phoneNumber: string;
    photoUrl: string;
  };
  location: LocationDTO;
  categories: CategoryDTO[];
  images: Image[];
  mainImageUrl: string;
}
