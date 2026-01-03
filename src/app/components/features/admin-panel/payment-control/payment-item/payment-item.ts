import {Component, input, signal} from '@angular/core';
import {PaymentItemDTO} from '../../../../../core/models/payments/PaymentItemDTO';
import {TranslatePipe} from '@ngx-translate/core';
import {UnderscorePipe} from '../../../../../core/pipes/underscore-pipe/underscore-pipe';
import {imageError} from '../../../../../core/utility/global-utility';
import {LISTING_TYPES} from '../../../../../core/constants/constants';
import {DatePipe} from '@angular/common';
import {Button} from '../../../../shared/button/button';

@Component({
  selector: 'app-payment-item',
  imports: [
    TranslatePipe,
    UnderscorePipe,
    DatePipe,
    Button
  ],
  templateUrl: './payment-item.html',
  styleUrl: './payment-item.css',
})
export class PaymentItem {
  readonly payment = input.required<PaymentItemDTO>();

  // For styling
  readonly isOpenPaymentDetails = signal<boolean>(false);

  togglePaymentDetails = () => this.isOpenPaymentDetails.set(!this.isOpenPaymentDetails());

  protected readonly imageError = imageError;
  protected readonly LISTING_TYPES = LISTING_TYPES;
}
