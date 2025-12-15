import {Notification} from './Notification';

export interface NotificationResponseDTO {
  items: Notification,
  totalPages: number,
  currentPage: number,
  itemsFrom: number,
  itemsTo: number,
  totalItemsCount: number,
  hasNextPage: boolean
}
