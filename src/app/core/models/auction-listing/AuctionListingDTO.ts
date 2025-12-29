import {LocationDTO} from '../location/LocationDTO';
import {CategoryDTO} from '../category/CategoryDTO';
import {Image} from '../graphics/Image';
import {User} from '../user/User';

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
