import {LocationDTO} from './LocationDTO';
import {CategoryDTO} from './CategoryDTO';
import {Image} from './Image';

export interface AuctionListingDTO {
  id: string;
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
  isFollowed: boolean;
  owner: {
    id: string;
    userName: string;
    email: string;
    location: LocationDTO;
    phoneNumber: string;
    photoUrl: string;
    backgroundUrl: string;
  };
  location: LocationDTO;
  categories: CategoryDTO[];
  images: Image[];
  mainImageUrl: string;
}
