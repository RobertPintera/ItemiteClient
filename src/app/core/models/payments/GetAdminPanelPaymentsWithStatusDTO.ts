import {PaymentStatus} from '../../constants/constants';

export interface GetAdminPanelPaymentsWithStatusDTO {
  pageSize: number;
  pageNumber: number;
  paymentStatus: PaymentStatus;
}
