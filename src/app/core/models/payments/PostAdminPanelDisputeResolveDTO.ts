import {DisputeResolution} from '../../constants/constants';

export interface PostAdminPanelDisputeResolveDTO {
  resolution: DisputeResolution;
  partialRefundAmount: number;
  reviewerNotes: string;
}
