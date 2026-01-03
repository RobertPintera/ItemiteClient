import {PAYMENT_TYPE, PaymentType} from '../constants/constants';

export const isPaymentType = (value: string): value is PaymentType => Object.values(PAYMENT_TYPE).includes(value as PaymentType);

