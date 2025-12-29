import {SaleItemDTO} from './SaleItemDTO';

export interface GetSalesResponseDTO {
  items: SaleItemDTO[];
  totalPages: number;
  currentPage: number;
  itemsFrom: number;
  itemsTo: number;
  hasNextPage: boolean;
}
