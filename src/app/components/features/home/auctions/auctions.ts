import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AuctionCard} from '../cards/auction-card/auction-card';
import {ListingService} from '../../../../core/services/listing-service/listing.service';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {Carousel} from '../../../shared/carousel/carousel';
import {ListingItemDTO} from '../../../../core/models/listing-general/LitstingItemDTO';

@Component({
  selector: 'app-auctions',
  imports: [
    TranslatePipe,
    AuctionCard,
    Carousel
  ],
  templateUrl: './auctions.html',
  styleUrl: './auctions.css'
})
export class Auctions implements OnInit {
  private _listingService = inject(ListingService);

  readonly auctions = signal<ListingItemDTO[]>([]);

  readonly firstHalfAuctions = computed(() => {
    const items = this.auctions();
    const half = Math.ceil(items.length / 2);
    return items.slice(0, half);
  });

  readonly secondHalfAuctions = computed(() => {
    const items = this.auctions();
    const half = Math.ceil(items.length / 2);
    return items.slice(half);
  });

  ngOnInit() {
    this._listingService.loadDedicatedListing(LISTING_TYPES.AUCTION).subscribe({
      next: (data) => {
        this.auctions.set(data);
      }
    });
  }

}
