import {CategoryDTO} from '../category/CategoryDTO';
import {Image} from '../graphics/Image';
import {LocationDTO} from '../location/LocationDTO';
import {User} from '../user/User';

export interface ProductListingDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  yourPrice: number;
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
