import {ListingItemDTO} from '../listing-general/LitstingItemDTO';
import {UserPaymentDTO} from './UserPaymentDTO';
import {DisputePaymentDTO} from './DisputePaymentDTO';

export interface PaymentItemDTO {
  paymentId: number;
  stripeChargeId: string;
  stripeTransferId: string;
  totalAmount: number;
  platformFeePercentage: number;
  platformFeeAmount: number;
  sellerAmount: number;
  currency: string;
  status: string;
  transferAttempts: number;
  transferTrigger: string;
  actualTransferMethod: string;
  chargeDate: string;
  transferDate: string;
  scheduledTransferDate: string;
  stripeRefundId: string;
  refundAmount: number;
  refundDate: string;
  scheduledRefundDate: string;
  refundAttempts: number;
  notes: string;
  listing: ListingItemDTO;
  buyer: UserPaymentDTO;
  seller: UserPaymentDTO;
  approvedBy: UserPaymentDTO;
  dispute: DisputePaymentDTO;
}
