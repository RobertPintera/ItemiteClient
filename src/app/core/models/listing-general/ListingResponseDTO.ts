import {ListingItemDTO} from './LitstingItemDTO';

export interface ListingResponseDTO {
  items: ListingItemDTO[];
  totalPages: number;
  currentPage: number;
  itemsFrom: number;
  itemsTo: number;
  totalItemsCount: number;
  hasNextPage: boolean;
}
