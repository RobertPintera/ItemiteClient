import {Component, inject } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Carousel} from '../../../shared/carousel/carousel';
import {ProductCard} from '../cards/product-card/product-card';
import {ListingService} from '../../../../core/services/listing-service/listing.service';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dedicated-products',
  imports: [
    TranslatePipe,
    Carousel,
    ProductCard
  ],
  templateUrl: './dedicated-products.html',
  styleUrl: './dedicated-products.css'
})
export class DedicatedProducts{
  private _listingService = inject(ListingService);

  readonly products = toSignal(
    this._listingService.loadDedicatedListing(LISTING_TYPES.PRODUCT),
    { initialValue: [] }
  );
}
