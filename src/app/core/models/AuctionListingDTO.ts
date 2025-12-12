import {CategoryDTO} from './CategoryDTO';
import {Image} from './Image';
import {Localization} from './Localization';

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
  owner: {
    id: string;
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
