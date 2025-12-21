import {PurchaseItemDTO} from './PurchaseItemDTO';

export interface GetPurchasesResponseDTO {
  items: PurchaseItemDTO[];
  totalPages: number;
  currentPage: number;
  itemsTo: number;
  totalItemsCount: number;
  hasNextPage: boolean;
}
