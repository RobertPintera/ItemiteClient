import {Component, inject, input, model, OnInit, signal} from '@angular/core';
import {Bid} from '../../../../core/models/auction-listing/Bid';
import {AuctionListingService} from '../../../../core/services/auction-listing-service/auction-listing.service';
import {Dialog} from '../../../shared/dialog/dialog';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-bid-history',
  imports: [
    Dialog,
    DatePipe
  ],
  templateUrl: './bid-history.html',
  styleUrl: './bid-history.css',
})
export class BidHistory implements OnInit {
  private _auctionListingService = inject(AuctionListingService);

  readonly isOpen = model.required<boolean>();
  readonly id = input.required<number>();
  readonly bids = signal<Bid[]>([]);

  ngOnInit() {
    this._auctionListingService
      .showBidHistoryAuctionListing(this.id())
      .subscribe(bids => this.bids.set(bids));
  }

  closeDialog(){
    this.isOpen.set(false);
  }
}
