import {Component, DestroyRef, inject, signal} from '@angular/core';
import {ProductGeneralForm} from './product-general-form/product-general-form';
import {AuctionForm} from './auction-form/auction-form';
import {ActivatedRoute} from '@angular/router';
import {LISTING_TYPES, ListingType} from '../../../core/constants/constants';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {EMPTY, map, switchMap} from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [
    ProductGeneralForm,
    AuctionForm,
    TranslatePipe
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm{
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private auctionListingService = inject(AuctionListingService);
  private productListingService = inject(ProductListingService);

  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);
  readonly formType = signal<ListingType | null>(null);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  constructor() {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(params => {
          const type = params.get('type');
          const id = params.get('id');

          const formType =
            type === LISTING_TYPES.PRODUCT || type === LISTING_TYPES.AUCTION
              ? type
              : null;

          this.formType.set(formType);

          return { formType, id: id ? Number(id) : null };
        }),
        switchMap(({ formType, id }) => {
          if (!formType || !id) {
            this.article.set(null);
            return EMPTY;
          }

          return formType === LISTING_TYPES.PRODUCT ? this.productListingService.loadProudctListingAuth(id)
            : this.auctionListingService.loadAuctionListingAuth(id);
        })
      )
      .subscribe({
        next: listing => {
          this.article.set(listing);
        },
        error: err => console.error(err)
      });
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
