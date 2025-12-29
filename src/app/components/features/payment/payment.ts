import {Component, inject, OnDestroy, OnInit, signal, ViewChild,} from '@angular/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProductListingDTO} from '../../../core/models/product-listings/ProductListingDTO';
import {AuctionListingDTO} from '../../../core/models/auction-listing/AuctionListingDTO';
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
import {InputNumber} from '../../shared/input-number/input-number';
import {PaymentForm} from '../../../core/models/PaymentForm';
import {PostBidAuctionListingDTO} from '../../../core/models/auction-listing/PostBidAuctionListingDTO';
import {isEmptyValidator, postalCodeValidator} from '../../../core/utility/Validation';

@Component({
  selector: 'app-payment',
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
    ComboBox,
    InputNumber
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit, OnDestroy {
  @ViewChild(StripeCardNumberComponent) card?: StripeCardNumberComponent;

  private _productListingService = inject(ProductListingService);
  private _auctionListingService = inject(AuctionListingService);
  private _errorHandlerService = inject(ErrorHandlerService);
  private _paymentService = inject(PaymentService);
  private _route = inject(ActivatedRoute);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  protected stripeService = inject(StripeService);

  readonly countriesOptions = countries.map(country => ({
    key: country.code,
    value: country.name
  }));

  readonly form = this._formBuilder.group<PaymentForm>({
    firstName: new FormControl<string>('', [
      Validators.required,
      isEmptyValidator,
      Validators.minLength(2),
      Validators.maxLength(30)]),
    lastName: new FormControl<string>('', [
      Validators.required,
      isEmptyValidator,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^(\+?[1-9]\d{0,2}[-.\s]?)?(\d{1,4}[-.\s]?){1,5}\d{1,4}$/),
      Validators.maxLength(20)]),
    address: new FormControl<string>('', [Validators.required, isEmptyValidator]),
    city: new FormControl<string>('', [Validators.required, isEmptyValidator]),
    country: new FormControl<OptionItem | null>(null, Validators.required),
    postalCode: new FormControl<string>(''),

    //Only for auctions
    bidAmount: new FormControl<number | null>(null),
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
    this._route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      const type = params.get('type');
      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      if(type === 'Product')
        this._productListingService.loadProudctListingAuth(validId).subscribe(product => this.article.set(product));
      else if (type === 'Auction')
        this._auctionListingService.loadAuctionListingAuth(validId).subscribe(auction => {
          this.article.set(auction);
          const minBid = auction.currentBid ?? auction.startingBid;

          const bidControl = this.form.controls.bidAmount;
          if (bidControl) {
            bidControl.setValue(minBid);
            bidControl.setValidators([
              Validators.required,
              Validators.min(minBid),
              Validators.max(999999.99),
              Validators.pattern(/^\d+(\.\d{1,2})?$/)
            ]);
            bidControl.updateValueAndValidity();
          }
        });
    });

    this.form.controls.country.valueChanges.subscribe(() => {
      const postalControl = this.form.controls.postalCode;
      postalControl.setValidators([
        Validators.required,
        postalCodeValidator(this.form.controls.country)
      ]);
      postalControl.updateValueAndValidity();
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
        this._errorHandlerService.SendRawErrorMessage(result.error.message ?? 'Error');
        this.loading.set(false);
      } else if (result.paymentMethod) {
        const paymentMethodId = result.paymentMethod.id;
        const productListingId = this.article()?.id;
        if (!productListingId) return;

        if (this.product) {
          this._paymentService.purchaseProduct(productListingId, paymentMethodId).pipe(finalize(() => this.loading.set(false))).subscribe(() => {
            this._router.navigate(['/payment-success']);
          });
        } else if (this.auction) {
          const payload: PostBidAuctionListingDTO = {
            price: formValues.bidAmount ?? 0,
            paymentMethodId: paymentMethodId,
          };

          this._auctionListingService.bidAuctionListing(productListingId, payload).pipe(finalize(() => this.loading.set(false))).subscribe(() => {
            this._router.navigate(['/payment-success']);
          });
        }
      }
    });
  }
}
