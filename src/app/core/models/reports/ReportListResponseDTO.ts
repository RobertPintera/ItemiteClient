import {Report} from './Report';

export interface ReportListResponseDTO {
  items: Report[],
  totalPages: number,
  currentPage: number,
  itemsFrom: number,
  itemsTo: number,
  totalItemsCount: number,
  hasNextPage: boolean,
}
