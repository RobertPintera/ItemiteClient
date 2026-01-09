import {Component, inject, input, output, signal} from '@angular/core';
import {PaymentItemDTO} from '../../../../../core/models/payments/PaymentItemDTO';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {UnderscorePipe} from '../../../../../core/pipes/underscore-pipe/underscore-pipe';
import {imageError} from '../../../../../core/utility/global-utility';
import {LISTING_TYPES, PAYMENT_STATUS} from '../../../../../core/constants/constants';
import {DatePipe} from '@angular/common';
import {Button} from '../../../../shared/button/button';
import {Dialog} from '../../../../shared/dialog/dialog';
import {EvidenceDTO} from '../../../../../core/models/payments/EvidenceDTO';
import {RouterLink} from '@angular/router';
import {ResolveDisputeDialog} from './resolve-dispute-dialog/resolve-dispute-dialog';
import {BasicCategory} from '../../../../../core/models/category/BasicCategory';

@Component({
  selector: 'app-payment-item',
  imports: [
    TranslatePipe,
    UnderscorePipe,
    DatePipe,
    Button,
    Dialog,
    RouterLink,
    ResolveDisputeDialog,
  ],
  templateUrl: './payment-item.html',
  styleUrl: './payment-item.css',
})
export class PaymentItem {
  private _translator = inject(TranslateService);

  readonly payment = input.required<PaymentItemDTO>();

  readonly successAction = output<void>();

  readonly selectedEvidence = signal<EvidenceDTO | null>(null);
  readonly isOpenPreviewEvidenceDialog = signal<boolean>(false);

  // For styling
  readonly isOpenPaymentDetails = signal<boolean>(false);
  readonly isOpenResolveDisputeDialog = signal<boolean>(false);

  togglePaymentDetails = () => this.isOpenPaymentDetails.set(!this.isOpenPaymentDetails());

  getCategoryName(category: BasicCategory): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

  openPreviewEvidenceDialog(evidence: EvidenceDTO) {
    this.selectedEvidence.set(evidence);
    this.isOpenPreviewEvidenceDialog.set(true);
  }

  closePreviewEvidenceDialog() {
    this.selectedEvidence.set(null);
    this.isOpenPreviewEvidenceDialog.set(false);
  }

  openResolveDisputeDialog() {
    this.isOpenResolveDisputeDialog.set(true);
  }

  resolveDispute() {
    this.successAction.emit();
  }

  protected readonly imageError = imageError;
  protected readonly LISTING_TYPES = LISTING_TYPES;
  protected readonly PAYMENT_STATUS = PAYMENT_STATUS;
}
