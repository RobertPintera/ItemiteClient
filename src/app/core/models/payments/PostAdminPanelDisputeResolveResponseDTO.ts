import {DisputeResolution, PaymentStatus} from '../../constants/constants';
import {ListingItemDTO} from '../listing-general/LitstingItemDTO';
import {UserPaymentDTO} from './UserPaymentDTO';

export interface PostAdminPanelDisputeResolveResponseDTO {
  id: number;
  reason: string,
  description: string,
  status: PaymentStatus,
  resolution: DisputeResolution,
  refundAmount: number,
  createdAt: string,
  resolvedAt: string,
  notes: string,
  evidence: {
    photoId: number,
    url: string
  }[],
  listing: ListingItemDTO,
  "disputedBy": UserPaymentDTO,
  "resolvedBy": UserPaymentDTO
}
