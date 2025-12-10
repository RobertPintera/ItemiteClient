import {CategoryDTO} from './CategoryDTO';
import {Image} from './Image';
import {LocationDTO} from './LocationDTO';
import {User} from './User';

export interface ProductListingDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  views: number;
  followers: number;
  dateCreated: string;
  isArchived: boolean;
  isFeatured: boolean;
  isNegotiable: boolean;
  isFollowed: boolean | null;
  owner: User;
  location: LocationDTO;
  categories: CategoryDTO[];
  images: Image[];
  mainImageUrl: string;
}
