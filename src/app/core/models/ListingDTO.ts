import {ListingItemDTO} from './LitstingItemDTO';

export interface ListingDTO {
  items: ListingItemDTO[];
  totalPages: number;
  currentPage: number;
  itemsFrom: number;
  itemsTo: number;
  totalItemsCount: number;
  hasNextPage: boolean;
}
