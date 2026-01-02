import {Component, inject, input, model, output, signal} from '@angular/core';
import {Dialog} from "../../../shared/dialog/dialog";
import {Button} from '../../../shared/button/button';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumber} from '../../../shared/input-number/input-number';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingDialog} from '../../../shared/loading-dialog/loading-dialog';
import {ProductListingService} from '../../../../core/services/product-listing-service/product-listing.service';
import {PostUserPriceDTO} from '../../../../core/models/product-listings/PostUserPriceDTO';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-individual-pricing-dialog',
  imports: [
    Dialog,
    Button,
    FormsModule,
    InputNumber,
    ReactiveFormsModule,
    TranslatePipe,
    LoadingDialog
  ],
  templateUrl: './individual-pricing-dialog.html',
  styleUrl: './individual-pricing-dialog.css',
})
export class IndividualPricingDialog {
  private _productService = inject(ProductListingService);
  private _formBuilder = inject(FormBuilder);

  readonly isOpen = input.required<boolean>();
  readonly listingId = input.required<number>();
  readonly userId = input.required<number>();

  onClose = output<void>();

  readonly loading = signal<boolean>(false);

  readonly form = this._formBuilder.group({
    price: new FormControl<number>(0,[
      Validators.required,
      Validators.min(0.01),
      Validators.max(1000000),
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
  });

  closeDialog(){
    this.onClose.emit();
    this.form.reset({
      price: 0
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const price = this.form.value.price;

    if (price === null || price === undefined) return;

    const payload : PostUserPriceDTO = {
      price: price,
    };

    this._productService.addUserIndividualPrice(this.listingId(), this.userId(), payload).pipe(
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe(() => {
      this.form.reset({
        price: 0
      });
      this.onClose.emit();
    });
  }
}
