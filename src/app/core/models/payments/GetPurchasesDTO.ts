import {PurchaseItemDTO} from './PurchaseItemDTO';

export interface GetPurchasesDTO {
  items: PurchaseItemDTO[];
  totalPages: number;
  currentPage: number;
  itemsTo: number;
  totalItemsCount: number;
  hasNextPage: boolean;
}
