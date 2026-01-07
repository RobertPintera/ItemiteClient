import {PaymentStatus, PaymentType} from '../../constants/constants';

export interface PaymentFilter {
  type: PaymentType
  pageSize: number;
  pageNumber: number;
  paymentStatus: PaymentStatus | null;
}
