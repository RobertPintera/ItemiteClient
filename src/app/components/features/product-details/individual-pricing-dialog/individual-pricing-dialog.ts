import {Component, inject, input, model, signal} from '@angular/core';
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
  private productService = inject(ProductListingService);
  private formBuilder = inject(FormBuilder);

  readonly isOpen = model.required<boolean>();
  readonly listingId = input.required<number>();

  readonly loading = signal<boolean>(false);

  readonly form = this.formBuilder.nonNullable.group({
    userId: [0, [
      Validators.required,
    ]],
    price: new FormControl<number>(0,[
      Validators.required,
      Validators.min(0.01),
      Validators.max(1000000),
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
  });

  closeDialog(){
    this.isOpen.set(false);
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;

    const userId = this.form.value.userId;
    const price = this.form.value.price;

    if (!userId || !price) return;

    const payload : PostUserPriceDTO = {
      price: price,
    };

    this.productService.addUserIndividualPrice(this.listingId(), userId, payload).pipe(
      finalize(() => {
        this.loading.set(false);
        this.isOpen.set(false);
      })
    ).subscribe(() => {
      this.form.reset();
    });
  }
}
