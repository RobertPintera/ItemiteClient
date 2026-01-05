import {
  DISPUTE_RESOLUTION,
  DisputeResolution,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  PaymentStatus,
  PaymentType
} from '../constants/constants';

export const isPaymentType = (value: string): value is PaymentType => Object.values(PAYMENT_TYPE).includes(value as PaymentType);

export const isPaymentStatus = (value: string): value is PaymentStatus => Object.values(PAYMENT_STATUS).includes(value as PaymentStatus);

export const isDisputeResolution = (value: string): value is DisputeResolution => Object.values(DISPUTE_RESOLUTION).includes(value as DisputeResolution);
