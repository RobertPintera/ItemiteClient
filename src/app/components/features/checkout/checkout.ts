import {Component, inject, OnDestroy, OnInit, signal, ViewChild,} from '@angular/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {TranslatePipe} from '@ngx-translate/core';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {StripeCardElementOptions, StripeElementsOptions} from '@stripe/stripe-js';
import {PaymentService} from '../../../core/services/payment-service/payment-service';
import {Button} from '../../shared/button/button';

@Component({
  selector: 'app-checkout',
  imports: [
    RouterLink,
    TranslatePipe,
    StripeCardComponent,
    Button
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  @ViewChild(StripeCardComponent) card?: StripeCardComponent;

  private productListingService = inject(ProductListingService);
  private auctionListingService = inject(AuctionListingService);
  private stripeService = inject(StripeService);
  private paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);

  // Stripe card
  // For tests: 4242 4242 4242 4242 12/34 12345

  readonly cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '24px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  readonly elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      const type = params.get('type');
      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      if(type === 'Product')
        this.productListingService.loadProudctListingAuth(validId).subscribe(product => this.article.set(product));
      else if (type === 'Auction')
        this.auctionListingService.loadAuctionListingAuth(validId).subscribe(auction => this.article.set(auction));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pay() {
    if (!this.card) return;

    this.stripeService.createPaymentMethod({
      type: 'card',
      card: this.card.element
    }).subscribe(result => {
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentMethod) {
        const paymentMethodId = result.paymentMethod.id;
        const productListingId = this.article()?.id;
        if (!productListingId) return;
        this.paymentService.purchaseProduct(productListingId, paymentMethodId).subscribe();
      }
    });

  }
}
