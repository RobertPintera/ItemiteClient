import {SaleItemDTO} from './SaleItemDTO';

export interface GetSalesDTO {
  items: SaleItemDTO[];
  totalPages: number;
  currentPage: number;
  itemsFrom: number;
  itemsTo: number;
  hasNextPage: boolean;
}
