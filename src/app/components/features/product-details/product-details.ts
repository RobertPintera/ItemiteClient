import {Component, computed, effect, inject, OnInit, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe} from '@ngx-translate/core';
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {ProductListingDTO} from '../../../core/models/ProductListingDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {AuctionListingDTO} from '../../../core/models/AuctionListingDTO';
import {isAuctionListing, isProductListing} from '../../../core/type-guards/listing-type.guard';
import {AuctionListingService} from '../../../core/services/auction-listing-service/auction-listing.service';
import {Gallery} from '../../shared/gallery/gallery';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {Map, Marker} from 'leaflet';
import {FloatingChatContainer} from '../chat/floating-chat-container/floating-chat-container';
import {UserService} from '../../../core/services/user-service/user.service';

@Component({
  selector: 'app-product-details',
  imports: [
    Button,
    TranslatePipe,
    Gallery,
    DatePipe,
    FloatingChatContainer,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private productListingService = inject(ProductListingService);
  private auctionListingService = inject(AuctionListingService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private userService: UserService = inject(UserService);
  private _router = inject(Router);

  private mapInitialized = false;
  private map?: Map ;
  private readonly mapEl = 'map';
  private currentMarker : WritableSignal<Marker | undefined> = signal(undefined);

  private _showChat = signal(false);
  readonly showChat = this._showChat.asReadonly();
  readonly isAuthorLogged = computed(() => {
    if(!this.userService.isUserLoggedIn()) return false;
    return this.userService.userBasicInfo().id === this.article()?.owner.id;
  });


  readonly isLg = signal<boolean>(false);
  readonly article = signal<ProductListingDTO | AuctionListingDTO | null>(null);
  readonly isClickPhoneNumber = signal<boolean>(false);

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
    if(!this.userService.isUserLoggedIn()){
      this._router.navigate(['login']);
      return;
    }

    // User is listing author
    //  => show chat list of specific listing
    if(this.isAuthorLogged()) {
      const productId = this.product!.id;
      this._router.navigate(['chats'], { queryParams: { productId }});
      return;
    }

    this.SwitchChatVisibility();
  }

  DisableChatVisibility(): void {
    this._showChat.set(false);
  }
  SwitchChatVisibility(): void {
    this._showChat.set(!this._showChat());
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const type = params.get('type');

      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      if(type === 'Product'){
        this.productListingService.loadProductListing(validId).subscribe({
          next: product => {
            this.article.set(product);
          },
          error: err => console.error(err)
        });
      }else if (type === 'Auction'){
        this.auctionListingService.loadAuctionListing(validId).subscribe({
          next: product => {
            this.article.set(product);
          },
          error: err => console.error(err)
        });
      }
    });
  }

  constructor() {
    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe(result => {
      this.isLg.set(result.breakpoints['(min-width: 1024px)']);
    });

    effect(async () => {
      const a = this.article();
      if (!this.mapInitialized && a?.location?.latitude != null && a?.location?.longitude != null && a?.location?.city) {
        await this.InitMap(a.location.latitude, a.location.longitude, a.location.city);
        this.mapInitialized = true;
      }
    });
  }

  async InitMap(lat:number, lng:number, city:string) {
    if (isPlatformBrowser(this.platformId)) {
      const { map, tileLayer, marker, Icon } = await import('leaflet');

      Icon.Default.prototype.options.iconRetinaUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowUrl = 'marker-icon.png';
      Icon.Default.prototype.options.shadowSize = [25, 41];

      this.map = map(this.mapEl).setView([lat,lng], 13);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
      this.currentMarker.set(marker([lat, lng]).addTo(this.map).bindPopup(city).openPopup());

      this.map.dragging.disable();
      this.map.scrollWheelZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.boxZoom.disable();
      this.map?.setZoomAround(this.currentMarker()?.getLatLng() ?? [50.2970546, 18.6926949], 10);
    }
  }

  ClickNumber() {
    this.isClickPhoneNumber.set(true);
  }
}
