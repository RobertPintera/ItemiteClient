import {Component, inject} from '@angular/core';
import {Button} from '../../../shared/button/button';
import {TranslatePipe} from '@ngx-translate/core';
import {PaymentService} from '../../../../core/services/payment-service/payment-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-billing-and-payments',
  imports: [
    Button,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './billing-and-payments.html',
  styleUrl: './billing-and-payments.css',
})
export class BillingAndPayments {
  private _paymentService = inject(PaymentService);


  goToStripeAccount() {
    this._paymentService.connectStripeStart().subscribe({
      next: (response) => {
        window.location.href = response.url;
      },
    });
  }
}
