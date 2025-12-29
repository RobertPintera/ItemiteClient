import {ListingItemDTO} from '../LitstingItemDTO';
import {UserPaymentDTO} from './UserPaymentDTO';

export interface SaleItemDTO {
  paymentId: number;
  totalAmount: number;
  platformFeeAmount: number;
  currency: string;
  listing: ListingItemDTO;
  buyer: UserPaymentDTO;
  seller: UserPaymentDTO;
  status: string;
  chargeDate: string;
  transferDate: string;
  scheduledTransferDate: string;
}
