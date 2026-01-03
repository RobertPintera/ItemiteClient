import {ListingItemDTO} from '../listing-general/LitstingItemDTO';
import {UserPaymentDTO} from './UserPaymentDTO';
import {EvidenceDTO} from './EvidenceDTO';

export interface DisputePaymentDTO  {
  id: number;
  reason: string;
  description: string;
  status: string;
  resolution: string;
  refundAmount: number;
  createdAt: string;
  resolvedAt: string;
  notes: string;
  evidence: EvidenceDTO[],
  listing: ListingItemDTO;
  disputedBy: UserPaymentDTO;
  resolvedBy: UserPaymentDTO;
}
