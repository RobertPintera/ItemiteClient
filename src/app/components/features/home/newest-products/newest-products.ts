import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Carousel} from '../../../shared/carousel/carousel';
import {ProductCard} from '../cards/product-card/product-card';
import {ListingService} from '../../../../core/services/listing-service/listing.service';
import {LISTING_TYPES, SORT_DIRECTION, SORTS_BY} from '../../../../core/constants/constants';
import {ListingResponseDTO} from '../../../../core/models/ListingResponseDTO';
import {ListingItemDTO} from '../../../../core/models/LitstingItemDTO';

@Component({
  selector: 'app-newest-products',
  imports: [
    TranslatePipe,
    Carousel,
    ProductCard
  ],
  templateUrl: './newest-products.html',
  styleUrl: './newest-products.css'
})
export class NewestProducts implements OnInit {
  private listingService = inject(ListingService);

  readonly listing = signal<ListingResponseDTO | null>(null);

  readonly products = signal<ListingItemDTO[]>([]);

  readonly firstHalfProducts = computed(() => this.products().slice(0, this.products().length / 2));
  readonly secondHalfProducts = computed(() => this.products().slice(this.products().length / 2));

  ngOnInit() {
    this.listingService.loadListing({pageSize: 10, listingType: LISTING_TYPES.PRODUCT, sortBy: SORTS_BY.CREATION_DATE, sortDirection: SORT_DIRECTION.ASCENDING}).
      subscribe({
        next: (data) => {
          this.listing.set(data);
          this.products.set(this.listing()?.items ?? []);
        }
      });
  }
}
