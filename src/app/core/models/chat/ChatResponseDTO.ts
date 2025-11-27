import {MessageResponse} from './MessageResponse';

export interface ChatResponseDTO {
  items: MessageResponse[],
  totalPages: number,
  currentPage: number,
  itemsFrom: number,
  itemsTo: number,
  totalItemsCount: number,
  hasNextPage: boolean,
}
