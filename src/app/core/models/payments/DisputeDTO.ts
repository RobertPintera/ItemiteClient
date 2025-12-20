import {UserPaymentDTO} from './UserPaymentDTO';
import {EvidenceDTO} from './EvidenceDTO';

export interface DisputeDTO {
  id: number;
  disputedBy: UserPaymentDTO;
  reason: string;
  description: string;
  status: string;
  resolution: string;
  refundAmount: number;
  createdAt: string;
  resolvedAt: string;
  isResolvedByAdmin: boolean;
  evidence: EvidenceDTO[];
  notes: string;
}
