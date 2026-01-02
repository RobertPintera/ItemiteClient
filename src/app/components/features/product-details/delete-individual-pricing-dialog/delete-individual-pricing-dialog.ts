import {Component, inject, input, model, output, signal} from '@angular/core';
import {ProductListingService} from '../../../../core/services/product-listing-service/product-listing.service';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {finalize} from 'rxjs';
import {Button} from '../../../shared/button/button';
import {Dialog} from '../../../shared/dialog/dialog';
import {InputNumber} from '../../../shared/input-number/input-number';
import {LoadingDialog} from '../../../shared/loading-dialog/loading-dialog';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-delete-individual-pricing-dialog',
  imports: [
    Button,
    Dialog,
    LoadingDialog,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './delete-individual-pricing-dialog.html',
  styleUrl: './delete-individual-pricing-dialog.css',
})
export class DeleteIndividualPricingDialog {
  private _productService = inject(ProductListingService);
  private _formBuilder = inject(FormBuilder);

  readonly isOpen = input.required<boolean>();
  readonly listingId = input.required<number>();

  readonly loading = signal<boolean>(false);
  readonly userId = input.required<number>();

  onClose = output<void>();

  readonly form = this._formBuilder.group({});

  closeDialog(){
    this.onClose.emit();
    this.form.reset({
      userId: 0,
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.userId();

    this._productService.deleteUserIndividualPrice(this.listingId(), userId).pipe(
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe(() => {
      this.form.reset({
        userId: 0,
      });
      this.onClose.emit();
    });
  }
}
