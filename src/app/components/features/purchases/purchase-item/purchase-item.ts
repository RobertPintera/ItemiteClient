import {Component, inject, input, output, signal} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {PurchaseItemDTO} from '../../../../core/models/payments/PurchaseItemDTO';
import {RouterLink} from '@angular/router';
import {ConfirmDialog} from '../../../shared/confirm-dialog/confirm-dialog';
import {PaymentService} from '../../../../core/services/payment-service/payment-service';
import {LoadingDialog} from '../../../shared/loading-dialog/loading-dialog';
import {finalize} from 'rxjs';
import {DisputeDialog} from './dispute-dialog/dispute-dialog';

@Component({
  selector: 'app-purchase-item',
  imports: [
    Button,
    DatePipe,
    TranslatePipe,
    RouterLink,
    ConfirmDialog,
    LoadingDialog,
    DisputeDialog
  ],
  templateUrl: './purchase-item.html',
  styleUrl: './purchase-item.css',
})
export class PurchaseItem {
  private paymentService = inject(PaymentService);

  readonly purchase = input.required<PurchaseItemDTO>();
  readonly confirmDeliverySuccess = output<void>();

  readonly loading = signal<boolean>(false);
  readonly isOpenConfirmDeliveryDialog = signal<boolean>(false);
  readonly isOpenDisputeDialog = signal<boolean>(false);

  openConfirmDeliveryDialog() {
    this.isOpenConfirmDeliveryDialog.set(true);
  }

  closeConfirmDeliveryDialog() {
    this.isOpenConfirmDeliveryDialog.set(false);
  }

  openDisputeDialog() {
    this.isOpenDisputeDialog.set(true);
  }

  confirmDelivery() {
    const listingId = this.purchase().listing.id;
    if(listingId === null || listingId === undefined) return;

    this.loading.set(true);

    this.paymentService.confirmDelivery(listingId).pipe(finalize(() => this.loading.set(false)))
      .subscribe(() => this.confirmDeliverySuccess.emit());
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
