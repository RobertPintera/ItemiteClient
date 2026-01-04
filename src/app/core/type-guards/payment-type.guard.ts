import {DISPUTE_RESOLUTION, DisputeResolution, PAYMENT_TYPE, PaymentType} from '../constants/constants';

export const isPaymentType = (value: string): value is PaymentType => Object.values(PAYMENT_TYPE).includes(value as PaymentType);

export const isDisputeResolution = (value: string): value is DisputeResolution => Object.values(DISPUTE_RESOLUTION).includes(value as DisputeResolution);
