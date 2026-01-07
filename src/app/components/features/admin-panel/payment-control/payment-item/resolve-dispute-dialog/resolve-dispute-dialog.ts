import {Component, inject, input, model, output, signal} from '@angular/core';
import {AdminService} from '../../../../../../core/services/admin-service/admin.service';
import {Button} from '../../../../../shared/button/button';
import {Dialog} from '../../../../../shared/dialog/dialog';
import {FileUpload} from '../../../../../shared/file-upload/file-upload';
import {LoadingDialog} from '../../../../../shared/loading-dialog/loading-dialog';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {isEmptyValidator} from '../../../../../../core/utility/Validation';
import {DISPUTE_RESOLUTION, DisputeResolution} from '../../../../../../core/constants/constants';
import {PostAdminPanelDisputeResolveDTO} from '../../../../../../core/models/payments/PostAdminPanelDisputeResolveDTO';
import {finalize} from 'rxjs';
import {ComboBox} from '../../../../../shared/combo-box/combo-box';
import {InputNumber} from '../../../../../shared/input-number/input-number';
import {OptionItem} from '../../../../../../core/models/OptionItem';
import {isDisputeResolution} from '../../../../../../core/type-guards/payment-type.guard';
import {DisputePaymentDTO} from '../../../../../../core/models/payments/DisputePaymentDTO';
import {SnakeCasePipe} from '../../../../../../core/pipes/snake-case-pipe/snake-case-pipe';

@Component({
  selector: 'app-resolve-dispute-dialog',
  imports: [
    Button,
    Dialog,
    LoadingDialog,
    ReactiveFormsModule,
    TranslatePipe,
    ComboBox,
    InputNumber,
    SnakeCasePipe
  ],
  templateUrl: './resolve-dispute-dialog.html',
  styleUrl: './resolve-dispute-dialog.css',
})
export class ResolveDisputeDialog {
  private _adminService = inject(AdminService);
  private _formBuilder = inject(FormBuilder);

  readonly isOpen = model.required<boolean>();
  readonly dispute = input.required<DisputePaymentDTO>();
  readonly paymentTotalAmount = input.required<number>();

  readonly loading = signal<boolean>(false);

  readonly resolveDisputeSuccess = output<void>();

  readonly resolutionOptions: OptionItem[] = Object.values(DISPUTE_RESOLUTION).map(value => ({
    key: value,
    value: value,
  }));

  readonly form = this._formBuilder.group({
    resolution: new FormControl<OptionItem | null>(this.resolutionOptions[0]),
    partialRefundAmount: new FormControl<number | null>(null),
    reviewerNotes: new FormControl<string>("",[
      Validators.maxLength(500)
    ]),
  });

  closeDialog() {
    this.isOpen.set(false);
    this.form.reset({
      resolution: this.resolutionOptions[0],
      reviewerNotes: null
    });
  }

  selectResolution(option?: OptionItem): void {
    if (!option) {
      return;
    }

    const partialRefundControl = this.form.controls.partialRefundAmount;

    if (option.key === DISPUTE_RESOLUTION.PARTIAL_REFUND) {
      partialRefundControl.setValidators([Validators.required, Validators.min(0), Validators.max(this.paymentTotalAmount())]);
    } else {
      partialRefundControl.clearValidators();
      partialRefundControl.setValue(null);
    }

    partialRefundControl.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const resolution = this.form.value.resolution?.key ?? '';

    const payload: PostAdminPanelDisputeResolveDTO = {
      resolution: isDisputeResolution(resolution) ? resolution : DISPUTE_RESOLUTION.REFUND_BUYER,
      partialRefundAmount: this.form.value.partialRefundAmount ?? null,
      reviewerNotes: this.form.value.reviewerNotes ?? ''
    };

    this._adminService.resolveDispute(this.dispute().id, payload).pipe(finalize(() => {
      this.loading.set(false);
    })).subscribe(() => {
      this.resolveDisputeSuccess.emit();
    });
  }

  protected readonly DISPUTE_RESOLUTION = DISPUTE_RESOLUTION;
}
