import {PaymentItemDTO} from './PaymentItemDTO';

export interface PaginatedPaymentResponseDTO {
  items: PaymentItemDTO;
  totalPages: number;
  currentPage: number;
  itemFrom: number;
  itemsTo: number;
  totalItemsCount: number;
  hasNextPage: boolean;
}
