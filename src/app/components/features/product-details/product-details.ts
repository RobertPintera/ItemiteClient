import {Component, computed, effect, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {Gallery} from '../../shared/gallery/gallery';
import {DatePipe, isPlatformBrowser, isPlatformServer, NgClass} from '@angular/common';
import {Map, Marker} from 'leaflet';
import {LISTING_TYPES} from '../../../core/constants/constants';
import {ListingService} from '../../../core/services/listing-service/listing.service';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {FloatingChatContainer} from '../chat/floating-chat-container/floating-chat-container';
import {UserService} from '../../../core/services/user-service/user.service';
import {BidHistoryDialog} from './bid-history-dialog/bid-history-dialog';
import {IndividualPricingDialog} from './individual-pricing-dialog/individual-pricing-dialog';
import {DeleteIndividualPricingDialog} from './delete-individual-pricing-dialog/delete-individual-pricing-dialog';

@Component({
  selector: 'app-product-details',
  imports: [
    Button,
    TranslatePipe,
    Gallery,
    DatePipe,
    RouterLink,
    FloatingChatContainer,
    NgClass,
    BidHistoryDialog,
    IndividualPricingDialog,
    DeleteIndividualPricingDialog,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnDestroy {
  private _breakpointObserver = inject(BreakpointObserver);
  private _productListingService = inject(ProductListingService);
  private _auctionListingService = inject(AuctionListingService);
  private _userService = inject(UserService);
  private _listingService = inject(ListingService);
  private _route = inject(ActivatedRoute);
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);

  private _toggleFollowSubject = new Subject<void>();
  private _destroy$ = new Subject<void>();

  private _mapInitialized = false;
  private _map?: Map ;
  private readonly _mapElement = 'map';
  private currentMarker = signal<Marker | undefined>(undefined);

  private _showChat = signal(false);
  readonly showChat = this._showChat.asReadonly();

  readonly isUserLogged = computed(() => this._userService.isUserLoggedIn());

  readonly isAuthorLogged = computed(() => {
    if(!this._userService.isUserLoggedIn()) return false;
    return this._userService.userBasicInfo().id === this.article()?.owner.id;
  });

  readonly isLg = signal<boolean>(false);
  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);
  readonly isFollowed = signal<boolean>(false);
  readonly isFollowLoading = signal<boolean>(false);
  readonly isClickPhoneNumber = signal<boolean>(false);
  readonly isOwner = signal<boolean>(false);

  readonly isOpenBidHistory = signal<boolean>(false);
  readonly isOpenBidDialog = signal<boolean>(false);
  readonly isOpenIndividualPricingDialog = signal<boolean>(false);
  readonly isOpenDeleteIndividualPricingDialog = signal<boolean>(false);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  OnMessageClicked(): void {
    // User not logged in
    //  => send message leads to logging page
    if(!this._userService.isUserLoggedIn()){
      this._router.navigate(['login']);
      return;
    }

    // User is listing author
    //  => show chat list of specific listing
    if(this.isAuthorLogged()) {
      const productId = this.article()?.id;
      this._router.navigate(['chats'], { queryParams: { productId }});
      return;
    }

    this.switchChatVisibility();
  }


  disableChatVisibility(): void {
    this._showChat.set(false);
  }

  switchChatVisibility(): void {
    this._showChat.set(!this._showChat());
  }

  ngOnInit() {
    if(isPlatformServer(this._platformId)){
      const id = this._route.snapshot.queryParamMap.get('id');
      const type = this._route.snapshot.queryParamMap.get('type');

      const validId = id && !isNaN(+id) ? +id : null;
      if (!validId) return;

      if (type === LISTING_TYPES.PRODUCT) {
        this._productListingService.loadProductListingPublic(validId).subscribe(product => {
          this.article.set(product);
        });
      }
      else {
        this._auctionListingService.loadAuctionListingPublic(validId).subscribe(auction => {
          this.article.set(auction);
        });
      }
    }

    if(isPlatformBrowser(this._platformId)){
      this._breakpointObserver.observe(['(min-width: 1024px)']).pipe(takeUntil(this._destroy$)).subscribe(result => {
        this.isLg.set(result.breakpoints['(min-width: 1024px)']);
      });

      this._route.queryParamMap.pipe(takeUntil(this._destroy$)).subscribe(params => {
        const id = params.get('id');
        const type = params.get('type');

        const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

        if (validId === null) return;

        if(type === 'Product'){
          this._productListingService.loadProudctListingAuth(validId).subscribe({
            next: product => {
              this.article.set(product);
              this.isFollowed.set(product.isFollowed ?? false);
              this._listingService.addFollowedListing(product.id);
            },
            error: err => console.error(err)
          });
        } else if (type === 'Auction'){
          this._auctionListingService.loadAuctionListingAuth(validId).subscribe({
            next: product => {
              this.article.set(product);
              this.isFollowed.set(product.isFollowed ?? false);
            },
            error: err => console.error(err)
          });
        }
      });

      this._toggleFollowSubject
        .pipe(debounceTime(300), takeUntil(this._destroy$))
        .subscribe(() => this.handleToggle());
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  constructor() {
    effect(async () => {
      const a = this.article();
      if (!this._mapInitialized && a?.location?.latitude != null && a?.location?.longitude != null && a?.location?.city) {
        await this.initMap(a.location.latitude, a.location.longitude, a.location.city);
        this._mapInitialized = true;
      }
    });

    effect(() => {
      const user = this._userService.userBasicInfo();
      const article = this.article();

      if(user.id === article?.owner.id){
        this.isOwner.set(true);
      }
    });
  }

  async initMap(lat:number, lng:number, city:string) {
    if (isPlatformBrowser(this._platformId)) {
      const { map, tileLayer, marker, Icon } = await import('leaflet');

      Icon.Default.prototype.options.iconRetinaUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowSize = [25, 41];

      this._map = map(this._mapElement).setView([lat,lng], 13);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this._map);
      this.currentMarker.set(marker([lat, lng]).addTo(this._map).bindPopup(city).openPopup());

      this._map.dragging.disable();
      this._map.scrollWheelZoom.disable();
      this._map.doubleClickZoom.disable();
      this._map.boxZoom.disable();
      this._map?.setZoomAround(this.currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949], 10);
    }
  }

  clickNumber() {
    this.isClickPhoneNumber.set(true);
  }

  toggleFollowed() {
    this._toggleFollowSubject.next();
  }

  openBidHistory() {
    this.isOpenBidHistory.set(true);
  }

  openDeleteIndividualPricing() {
    this.isOpenDeleteIndividualPricingDialog.set(true);
  }


  openIndividualPricing() {
    this.isOpenIndividualPricingDialog.set(true);
  }

  updateAuction() {
    const id = this.auction?.id;
    if(!id) return;

    this._auctionListingService.loadAuctionListingAuth(id).subscribe({
      next: product => {
        this.article.set(product);
        this.isFollowed.set(product.isFollowed ?? false);
      },
      error: err => console.error(err)
    });
  }

  private handleToggle() {
    if (this.isFollowLoading()) return;

    const id = this.article()?.id;
    if (!id) return;

    this.isFollowLoading.set(true);
    const currentlyFollowed = this.isFollowed();

    if(!currentlyFollowed){
      this._listingService.addFollowedListing(id).subscribe({
        next: () => {
          this.isFollowed.set(true);
          this.isFollowLoading.set(false);
        },
        error: err => console.error(err)
      });
    } else{
      this._listingService.deleteFollowedListing(id).subscribe({
        next: () => {
          this.isFollowed.set(false);
          this.isFollowLoading.set(false);
        },
        error: err => console.error(err)
      });
    }
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
