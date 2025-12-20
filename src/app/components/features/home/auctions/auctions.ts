import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AuctionCard} from '../cards/auction-card/auction-card';
import {ListingService} from '../../../../core/services/listing-service/listing.service';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {Carousel} from '../../../shared/carousel/carousel';
import {ListingItemDTO} from '../../../../core/models/LitstingItemDTO';

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
  private listingService = inject(ListingService);

  readonly auctions = signal<ListingItemDTO[]>([]);

  readonly firstHalfAuctions = computed(() => this.auctions().slice(0, this.auctions().length / 2));
  readonly secondHalfAuctions = computed(() => this.auctions().slice(this.auctions().length / 2));

  ngOnInit() {
    this.listingService.loadDedicatedListing(LISTING_TYPES.AUCTION).subscribe({
      next: (data) => {
        this.auctions.set(data);
      }
    });
  }

}
