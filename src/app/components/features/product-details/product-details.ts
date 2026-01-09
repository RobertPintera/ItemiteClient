import {Component, computed, effect, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/product-listings/ProductListingDTO';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuctionListingDTO} from '../../../core/models/auction-listing/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {Gallery} from '../../shared/gallery/gallery';
import {DatePipe, isPlatformBrowser, isPlatformServer, NgClass} from '@angular/common';
import {Map, Marker} from 'leaflet';
import {ButtonSeverity, LISTING_TYPES} from '../../../core/constants/constants';
import {ListingService} from '../../../core/services/listing-service/listing.service';
import {debounceTime, finalize, Subject, takeUntil} from 'rxjs';
import {FloatingChatContainer} from '../chat/floating-chat-container/floating-chat-container';
import {UserService} from '../../../core/services/user-service/user.service';
import {BidHistoryDialog} from './bid-history-dialog/bid-history-dialog';
import {imageError} from '../../../core/utility/global-utility';
import {CategoryDTO} from '../../../core/models/category/CategoryDTO';
import {AdminService} from '../../../core/services/admin-service/admin.service';
import {LoadingDialog} from '../../shared/loading-dialog/loading-dialog';
import {ConfirmDialog} from '../../shared/confirm-dialog/confirm-dialog';

interface ButtonSettings {
  label: string;
  onClick?: () => void;
  routerLink?: string[];
  queryParams?: Record<string, string | number | boolean>;
  severity?: ButtonSeverity;
}

interface ButtonOrder {
  id: string;
  settings: ButtonSettings;
}

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
    LoadingDialog,
    ConfirmDialog,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnDestroy {
  private _breakpointObserver = inject(BreakpointObserver);
  private _adminService = inject(AdminService);
  private _productListingService = inject(ProductListingService);
  private _auctionListingService = inject(AuctionListingService);
  private _userService = inject(UserService);
  private _listingService = inject(ListingService);
  private _route = inject(ActivatedRoute);
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private _translator = inject(TranslateService);

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

  readonly loading = signal<boolean>(false);
  readonly isOpenDeleteOfferDialog = signal<boolean>(false);
  readonly isOpenBidHistory = signal<boolean>(false);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  getCategoryName(category: CategoryDTO): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
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
          this._productListingService.loadProductListingAuth(validId).subscribe({
            next: product => {
              this.article.set(product);
              console.log(this.product);
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

  openDeleteOfferDialog(){
    this.isOpenDeleteOfferDialog.set(true);
  }

  cancelDeleteOfferDialog() {
    this.isOpenDeleteOfferDialog.set(false);
  }

  deleteOffer(){
    const id = this.article()?.id;

    if(!id) return;

    this.loading.set(true);

    this._adminService.deleteListing(id).pipe(finalize(() => {
      this.loading.set(false);
      this.isOpenDeleteOfferDialog.set(false);
    })).subscribe(() => {
      this._router.navigate(['/']);
    });
  }

  openBidHistory() {
    this.isOpenBidHistory.set(true);
  }

  getVisibleButtons(): ButtonOrder[] {
    const buttonsSettings: ButtonSettings[] = [];

    const isArchived = this.article()?.isArchived;

    // For products
    if(this.product){
      if (this.isAuthorLogged()){
        if (!isArchived)
          buttonsSettings.push({label: 'controls.edit', routerLink: ['/product-form'], queryParams: { id: this.product.id, type: LISTING_TYPES.PRODUCT }});
        buttonsSettings.push({label: 'product_details.view_messages', onClick: () => this.OnMessageClicked()});
      }
      else {
        if (!isArchived)
          buttonsSettings.push({label: 'product_details.buy', routerLink: ['/payment'], queryParams: { id: this.product.id, type: LISTING_TYPES.PRODUCT }});
        buttonsSettings.push({label: 'product_details.send_message', onClick: () => this.OnMessageClicked()});
      }
      buttonsSettings.push({ label: this.isClickPhoneNumber() ? this.product.owner.phoneNumber ?? 'product_details.no_phone' : 'product_details.call', onClick: () => this.clickNumber()});
    }
    // For auctions
    else if (this.auction){
      if (this.isAuthorLogged()){
        if (!isArchived)
          buttonsSettings.push({label: 'controls.edit', routerLink: ['/product-form'], queryParams: { id: this.auction.id, type: LISTING_TYPES.AUCTION }});
        buttonsSettings.push({label: 'product_details.view_messages', onClick: () => this.OnMessageClicked()});
      }
      else {
        if (!isArchived)
          buttonsSettings.push({label: 'product_details.bid', routerLink: ['/payment'], queryParams: { id: this.auction.id, type: LISTING_TYPES.AUCTION }});
        buttonsSettings.push({label: 'product_details.send_message', onClick: () => this.OnMessageClicked()});
      }
      buttonsSettings.push({label: this.isClickPhoneNumber() ? this.auction.owner.phoneNumber ?? 'product_details.no_phone' : 'product_details.call', onClick: () => this.clickNumber(),});
      buttonsSettings.push({label: 'product_details.bids_history', onClick: () => this.openBidHistory()});
    }

    if(this._userService.userInfo().roles.includes('Admin') && !this.article()?.isArchived){
      buttonsSettings.push({label: 'product_details.delete_offer', severity: "danger", onClick: () => this.openDeleteOfferDialog()});
    }

    return buttonsSettings.map((btn, index) => ({
      id: `${index + 1}`,
      settings: {
        ...btn,
        severity: btn.severity ?? (index % 2 === 0 ? 'primary' : 'secondary'),
      },
    }));
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
  protected readonly imageError = imageError;
}
