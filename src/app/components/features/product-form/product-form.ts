import {Component, DestroyRef, inject, signal} from '@angular/core';
import {ProductGeneralForm} from './product-general-form/product-general-form';
import {AuctionForm} from './auction-form/auction-form';
import {ActivatedRoute} from '@angular/router';
import {LISTING_TYPES, ListingType} from '../../../core/constants/constants';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/product-listings/ProductListingDTO';
import {AuctionListingDTO} from '../../../core/models/auction-listing/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {catchError, map, of, switchMap} from 'rxjs';
import {LoadingDialog} from '../../shared/loading-dialog/loading-dialog';
import {UserService} from '../../../core/services/user-service/user.service';

@Component({
  selector: 'app-product-form',
  imports: [
    ProductGeneralForm,
    AuctionForm,
    TranslatePipe,
    LoadingDialog
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm{
  private _route = inject(ActivatedRoute);
  private _destroyRef = inject(DestroyRef);
  private _auctionListingService = inject(AuctionListingService);
  private _productListingService = inject(ProductListingService);
  private _userService = inject(UserService);

  readonly userInfo = this._userService.userBasicInfo;

  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);
  readonly formType = signal<ListingType | null>(null);
  readonly loading = signal<boolean>(false);
  readonly notFound = signal<boolean>(false);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  constructor() {
    this._route.queryParamMap
      .pipe(
        takeUntilDestroyed(this._destroyRef),
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
          this.notFound.set(false);

          if (!formType || !id) {
            this.article.set(null);
            return of(null);
          }

          return formType === LISTING_TYPES.PRODUCT
            ? this._productListingService.loadProductListingAuth(id).pipe(catchError(() => {
              this.notFound.set(true);
              return of(null);
            }))
            : this._auctionListingService.loadAuctionListingAuth(id).pipe(catchError(() => {
              this.notFound.set(true);
              return of(null);
            }));
        }),
      )
      .subscribe({
        next: listing => {
          this.article.set(listing);
        },
      });
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
