import {ListingItemDTO} from '../LitstingItemDTO';
import {UserPaymentDTO} from './UserPaymentDTO';
import {DisputeDTO} from './DisputeDTO';

export interface PurchaseItemDTO {
  paymentId: number;
  totalAmount: number;
  currency: string;
  listing: ListingItemDTO;
  buyer: UserPaymentDTO;
  seller: UserPaymentDTO;
  status: string;
  refundAmount: number;
  refundDate: string;
  dispute: DisputeDTO;
}
