import {ChatInfoResponse} from './ChatInfoResponse';

export interface ChatListResponseDTO {
  items: ChatInfoResponse[],
  totalPages: number,
  currentPage: number,
  itemsFrom: number,
  itemsTo: number,
  totalItemsCount: number,
  hasNextPage: boolean
}
