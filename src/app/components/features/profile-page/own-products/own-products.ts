import {Component, inject} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';
import {PaymentService} from '../../../../core/services/payment-service/payment-service';

@Component({
  selector: 'app-own-products',
  imports: [
    Button,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './own-products.html',
  styleUrl: './own-products.css',
})
export class OwnProducts {
  private _paymentService = inject(PaymentService);

  readonly onboardingStatus = this._paymentService.onboardingStatus;
}
