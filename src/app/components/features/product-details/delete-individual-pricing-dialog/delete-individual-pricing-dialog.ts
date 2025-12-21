import {Component, inject, input, model, signal} from '@angular/core';
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
    InputNumber,
    LoadingDialog,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './delete-individual-pricing-dialog.html',
  styleUrl: './delete-individual-pricing-dialog.css',
})
export class DeleteIndividualPricingDialog {
  private productService = inject(ProductListingService);
  private formBuilder = inject(FormBuilder);

  readonly isOpen = model.required<boolean>();
  readonly listingId = input.required<number>();

  readonly loading = signal<boolean>(false);

  readonly form = this.formBuilder.group({
    userId: new FormControl<number>(0, [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ])
  });

  closeDialog(){
    this.isOpen.set(false);
    this.form.reset({
      userId: 0,
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.form.value.userId;

    if (userId === null || userId === undefined) return;

    this.productService.deleteUserIndividualPrice(this.listingId(), userId).pipe(
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe(() => {
      this.form.reset({
        userId: 0,
      });
      this.isOpen.set(false);
    });
  }
}
