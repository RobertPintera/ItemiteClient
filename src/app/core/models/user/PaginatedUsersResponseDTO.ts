import {User} from './User';

export interface PaginatedUsersResponseDTO {
  items: User[],
  totalPages: number,
  currentPage: number,
  itemsFrom: number,
  itemsTo: number,
  totalItemsCount: number,
  hasNextPage: boolean
}
