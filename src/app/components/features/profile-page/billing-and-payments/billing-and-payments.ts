import {Component, inject, signal} from '@angular/core';
import {Button} from '../../../shared/button/button';
import {TranslatePipe} from '@ngx-translate/core';
import {PaymentService} from '../../../../core/services/payment-service/payment-service';
import {RouterLink} from '@angular/router';
import {LoadingDialog} from '../../../shared/loading-dialog/loading-dialog';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-billing-and-payments',
  imports: [
    Button,
    TranslatePipe,
    RouterLink,
    LoadingDialog
  ],
  templateUrl: './billing-and-payments.html',
  styleUrl: './billing-and-payments.css',
})
export class BillingAndPayments {
  private paymentService = inject(PaymentService);

  readonly onboardingStatus = this.paymentService.onboardingStatus;

  readonly loading = signal<boolean>(false);

  goToStripeAccount() {
    this.loading.set(true);
    this.paymentService.connectStripeStart()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: response => {
          window.location.href = response.url;
        }
      });
  }
}
