import {Component, inject, input, model, output} from '@angular/core';
import {Dialog} from "../../../shared/dialog/dialog";
import {InputNumber} from '../../../shared/input-number/input-number';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {AuctionListingService} from '../../../../core/services/auction-listing-service/auction-listing.service';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-bid-dialog',
  imports: [
    Dialog,
    InputNumber,
    TranslatePipe,
    Button,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './bid-dialog.html',
  styleUrl: './bid-dialog.css',
})
export class BidDialog {
  private auctionService = inject(AuctionListingService);
  private formBuilder = inject(FormBuilder);

  readonly isOpen = model.required<boolean>();
  readonly currentBid = input.required<number>();
  readonly auctionId = input.required<number>();

  readonly bidAction = output<void>();

  readonly form = this.formBuilder.nonNullable.group({
    bid: [0, [
      Validators.required,
      Validators.min(0)
    ]]
  });

  closeDialog() {
    this.isOpen.set(false);
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;

    const bid = this.form.value.bid;

    this.auctionService.bidAuctionListing(this.auctionId(), bid ?? 0)
      .subscribe({
        next: () => {
          this.form.reset();
          this.bidAction.emit();
          this.isOpen.set(false);
        },
      });
  }
}
