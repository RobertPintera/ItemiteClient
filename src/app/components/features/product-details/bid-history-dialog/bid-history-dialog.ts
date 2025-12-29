import {Component, effect, inject, input, model, OnInit, signal} from '@angular/core';
import {Bid} from '../../../../core/models/auction-listing/Bid';
import {AuctionListingService} from '../../../../core/services/auction-listing-service/auction-listing.service';
import {Dialog} from '../../../shared/dialog/dialog';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-bid-dialog-history',
  imports: [
    Dialog,
    DatePipe
  ],
  templateUrl: './bid-history-dialog.html',
  styleUrl: './bid-history-dialog.css',
})
export class BidHistoryDialog implements OnInit {
  private _auctionListingService = inject(AuctionListingService);

  readonly isOpen = model.required<boolean>();
  readonly id = input.required<number>();
  readonly bids = signal<Bid[]>([]);

  ngOnInit() {
    this._auctionListingService
      .showBidHistoryAuctionListing(this.id())
      .subscribe(bids => this.bids.set(bids));
  }

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;

      this._auctionListingService
        .showBidHistoryAuctionListing(this.id())
        .subscribe(bids => this.bids.set(bids));
    });
  }

  closeDialog(){
    this.isOpen.set(false);
  }
}
