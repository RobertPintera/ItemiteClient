import {LocationDTO} from './LocationDTO';
import {CategoryDTO} from './CategoryDTO';
import {Image} from './Image';
import {User} from './User';

export interface AuctionListingDTO {
  id: number;
  name: string;
  description: string;
  startingBid: number;
  currentBid: number | null;
  views: number;
  followers: number;
  dateCreated: string;
  dateEnds: string;
  isArchived: boolean;
  isFeatured: boolean;
  isFollowed: boolean | null;
  owner: User;
  location: LocationDTO;
  categories: CategoryDTO[];
  images: Image[];
  mainImageUrl: string;
}
