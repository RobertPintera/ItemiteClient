import {CategoryDTO} from './CategoryDTO';
import {Image} from './Image';
import {Localization} from './Localization';

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
  owner: {
    id: number;
    userName: string;
    email: string;
    location: Localization;
    phoneNumber: string;
    photoUrl: string;
    backgroundUrl: string;
  };
  location: Localization;
  categories: CategoryDTO[];
  images: Image[];
  mainImageUrl: string;
}
