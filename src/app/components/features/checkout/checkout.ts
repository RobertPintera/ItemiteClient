import {Component, inject, OnDestroy, OnInit, signal, ViewChild,} from '@angular/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {TranslatePipe} from '@ngx-translate/core';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent, StripeCardGroupDirective, StripeCardNumberComponent, StripeService
} from 'ngx-stripe';
import {StripeCardElementOptions, StripeCardNumberElementOptions, StripeElementsOptions} from '@stripe/stripe-js';
import {PaymentService} from '../../../core/services/payment-service/payment-service';
import {Button} from '../../shared/button/button';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoadingDialog} from '../../shared/loading-dialog/loading-dialog';
import {ErrorHandlerService} from '../../../core/services/error-handler-service/error-handler-service';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {OptionItem} from '../../../core/models/OptionItem';
import {countries} from '../../../core/constants/countries';

@Component({
  selector: 'app-checkout',
  imports: [
    RouterLink,
    TranslatePipe,
    Button,
    ReactiveFormsModule,
    StripeCardGroupDirective,
    StripeCardNumberComponent,
    StripeCardExpiryComponent,
    StripeCardCvcComponent,
    LoadingDialog,
    ComboBox
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  @ViewChild(StripeCardNumberComponent) card?: StripeCardNumberComponent;

  private productListingService = inject(ProductListingService);
  private auctionListingService = inject(AuctionListingService);
  private errorHandlerService = inject(ErrorHandlerService);
  private paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  protected stripeService = inject(StripeService);

  readonly countriesOptions = countries.map(country => ({
    key: country.code,
    value: country.name
  }));

  readonly form = this.formBuilder.group({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl<string>('', [Validators.required]),
    address: new FormControl<string>('', Validators.required),
    city: new FormControl<string>('', Validators.required),
    country: new FormControl<OptionItem | null>(null, Validators.required),
    postalCode: new FormControl<string>('', Validators.required),
  });

  // Stripe card
  // For tests: 4242 4242 4242 4242 12/34 12345

  readonly cardNumberOptions: StripeCardNumberElementOptions = {
    showIcon: true,
    style: {
      base: {
        fontSize: '18px',
        color: '#111827',
        '::placeholder': {
          color: '#9CA3AF',
        },
      },
    },
  };

  readonly cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  readonly elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  readonly loading = signal<boolean>(false);
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.card) return;

    this.loading.set(true);

    const formValues = this.form.value;

    this.stripeService.createPaymentMethod({
      type: 'card',
      card: this.card.element,
      billing_details: {
        name: `${formValues.firstName} ${formValues.lastName}`,
        email: formValues.email,
        phone: formValues.phoneNumber,
        address: {
          line1: formValues.address,
          city: formValues.city,
          postal_code: formValues.postalCode,
          country: formValues.country?.key
        }
      }
    }).subscribe(result => {
      if (result.error) {
        this.errorHandlerService.SendRawErrorMessage(result.error.message ?? 'Error');
        this.loading.set(false);
      } else if (result.paymentMethod) {
        const paymentMethodId = result.paymentMethod.id;
        const productListingId = this.article()?.id;
        if (!productListingId) return;

        this.paymentService.purchaseProduct(productListingId, paymentMethodId).pipe(finalize(() => this.loading.set(false))).subscribe(() => {
          this.router.navigate(['/checkout-success']);
        });
      }
    });

  }
}
