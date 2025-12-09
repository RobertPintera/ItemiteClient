import {Component, effect, inject, OnInit, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {Gallery} from '../../shared/gallery/gallery';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {Map, Marker} from 'leaflet';
import {UserService} from '../../../core/services/user-service/user.service';
import {LISTING_TYPES} from '../../../core/constants/constants';

@Component({
  selector: 'app-product-details',
  imports: [
    Button,
    TranslatePipe,
    Gallery,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private _breakpointObserver = inject(BreakpointObserver);
  private _productListingService = inject(ProductListingService);
  private _auctionListingService = inject(AuctionListingService);
  private _userService = inject(UserService);
  private _route = inject(ActivatedRoute);
  private _platformId = inject(PLATFORM_ID);

  private _mapInitialized = false;
  private _map?: Map ;
  private readonly _mapEl = 'map';
  private _currentMarker : WritableSignal<Marker | undefined> = signal(undefined);

  readonly isLg = signal<boolean>(false);
  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);
  readonly isClickPhoneNumber = signal<boolean>(false);
  readonly isOwner = signal<boolean>(false);

  get product(): ProductListingDTO | null {
    const value = this.article();
    return isProductListing(value) ? value : null;
  }

  get auction(): AuctionListingDTO | null {
    const value = this.article();
    return isAuctionListing(value) ? value : null;
  }

  ngOnInit() {
    this._route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const type = params.get('type');

      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      if(type === 'Product'){
        this._productListingService.loadProductListing(validId).subscribe({
          next: product => {
            this.article.set(product);
          },
          error: err => console.error(err)
        });
      }else if (type === 'Auction'){
        this._auctionListingService.loadAuctionListing(validId).subscribe({
          next: product => {
            this.article.set(product);
          },
          error: err => console.error(err)
        });
      }
    });
  }

  constructor() {
    this._breakpointObserver.observe(['(min-width: 1024px)']).subscribe(result => {
      this.isLg.set(result.breakpoints['(min-width: 1024px)']);
    });

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

      this._map = map(this._mapEl).setView([lat,lng], 13);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this._map);
      this._currentMarker.set(marker([lat, lng]).addTo(this._map).bindPopup(city).openPopup());

      this._map.dragging.disable();
      this._map.scrollWheelZoom.disable();
      this._map.doubleClickZoom.disable();
      this._map.boxZoom.disable();
      this._map?.setZoomAround(this._currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949], 10);
    }
  }

  clickNumber() {
    this.isClickPhoneNumber.set(true);
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
