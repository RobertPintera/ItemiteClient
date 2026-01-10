import {Component, inject, input, model, output, signal} from '@angular/core';
import {LoadingDialog} from '../../../../shared/loading-dialog/loading-dialog';
import {Button} from '../../../../shared/button/button';
import {Dialog} from '../../../../shared/dialog/dialog';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {PaymentService} from '../../../../../core/services/payment-service/payment-service';
import {ImageMedia} from '../../../../../core/models/graphics/ImageMedia';
import {isEmptyValidator} from '../../../../../core/utility/Validation';
import {OptionItem} from '../../../../../core/models/OptionItem';
import {finalize} from 'rxjs';
import {PostDisputeDTO} from '../../../../../core/models/payments/PostDisputeDTO';
import {ComboBox} from '../../../../shared/combo-box/combo-box';
import {MediaManager} from '../../../../shared/media-manager/media-manager';

@Component({
  selector: 'app-dispute-dialog',
  imports: [
    LoadingDialog,
    Button,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    ComboBox,
    MediaManager
  ],
  templateUrl: './dispute-dialog.html',
  styleUrl: './dispute-dialog.css',
})
export class DisputeDialog {
  private _paymentService = inject(PaymentService);
  private _formBuilder = inject(FormBuilder);

  readonly isOpen = model.required<boolean>();
  readonly paymentId = input.required<number>();

  readonly disputeSuccess = output<void>();

  readonly loading = signal<boolean>(false);

  readonly form = this._formBuilder.group({
    reason: new FormControl<OptionItem | null>(null, Validators.required),
    description: new FormControl<string>("",[
      Validators.required,
      isEmptyValidator,
      Validators.maxLength(500)
    ]),
    photos: new FormControl<ImageMedia[]>([], Validators.required),
  });

  readonly reasonOptions: OptionItem[] = [
    { key: "ItemNotReceived", value: "purchases.dispute.reason.item_not_received" },
    { key: "ItemNotAsDescribed", value: "purchases.dispute.reason.item_not_as_described" },
    { key: "ItemDamaged", value: "purchases.dispute.reason.item_damaged" },
    { key: "Other", value: "purchases.dispute.reason.other" },
  ];

  closeDialog(){
    this.isOpen.set(false);
    this.form.reset({
      reason: null,
      description: "",
      photos: []
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const images: ImageMedia[] = this.form.value.photos ?? [];

    const photos: File[] = images
      .map(img => img.imageFile)
      .filter((file): file is File => file instanceof File);

    const payload: PostDisputeDTO = {
      reason: this.form.value.reason?.key ?? '',
      description: this.form.value.description ?? '',
      photos: photos
    };

    this.loading.set(true);

    this._paymentService.dispute(this.paymentId(), payload).pipe(
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe(() => {
      this.form.reset({
        reason: {key: "1", value: "1"},
        description: "",
        photos: []
      });
      this.disputeSuccess.emit();
      this.isOpen.set(false);
    });
  }
}
