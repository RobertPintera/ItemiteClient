import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {PaymentCountsResponseDTO} from '../../../../core/models/payments/PaymentCountsResponseDTO';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {PAYMENT_TYPE, PaymentType} from '../../../../core/constants/constants';
import {ActivatedRoute, Router} from '@angular/router';
import {isPaymentType} from '../../../../core/type-guards/payment-type.guard';
import {PaymentLatest} from './payment-latest/payment-latest';
import {PaymentWithStatus} from './payment-with-status/payment-with-status';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Dialog} from '../../../shared/dialog/dialog';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-payment-control',
  imports: [
    Button,
    PaymentLatest,
    PaymentWithStatus,
    Dialog,
    TranslatePipe,
  ],
  templateUrl: './payment-control.html',
  styleUrl: './payment-control.css',
})
export class PaymentControl implements OnInit {
  private _adminService = inject(AdminService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _destroyRef = inject(DestroyRef);

  readonly selectedOption = signal<PaymentType>(PAYMENT_TYPE.LATEST);
  readonly paymentsCounts = signal<PaymentCountsResponseDTO | null>(null);
  readonly isOpenCountsDialog = signal<boolean>(false);

  ngOnInit() {
    this._adminService.loadPaymentsCounts().subscribe(counts => {
      this.paymentsCounts.set(counts);
    });

    this._route.queryParamMap.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(params => {
      const type = params.get('type');

      if (type && isPaymentType(type)) {
        this.selectedOption.set(type);
      } else {
        this.selectedOption.set(PAYMENT_TYPE.LATEST);
      }
    });
  }

  select(type: PaymentType) {
    this.selectedOption.set(type);

    this._router.navigate([], {
      queryParams: { type },
    });
  }

  openCountsDialog(): void {
    this.isOpenCountsDialog.set(true);
  }

  closeCountsDialog(): void {
    this.isOpenCountsDialog.set(false);
  }


  protected readonly PAYMENT_TYPE = PAYMENT_TYPE;
}
