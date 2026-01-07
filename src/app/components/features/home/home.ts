import {Component, inject, OnInit, signal} from '@angular/core';
import {Baner} from './baner/baner';
import {Categories} from './categories/categories';
import {DedicatedProducts} from './dedicated-products/dedicated-products';
import {NewestProducts} from './newest-products/newest-products';
import {Auctions} from './auctions/auctions';
import {BannerService} from '../../../core/services/banner-service/banner-service';
import {BannerDTO} from '../../../core/models/banners/BannerDTO';
import {BANNER_POSITION} from '../../../core/constants/constants';

@Component({
  selector: 'app-home',
  imports: [
    Baner,
    Categories,
    DedicatedProducts,
    NewestProducts,
    Auctions,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private _bannerService = inject(BannerService);

  readonly topBanner = signal<BannerDTO | null>(null);
  readonly bottomBanner = signal<BannerDTO | null>(null);

  ngOnInit() {
    this._bannerService.loadActivebanners().subscribe(banners => {
      this.topBanner.set(
        banners.find(b => b.position === BANNER_POSITION.TOP) ?? null
      );

      this.bottomBanner.set(
        banners.find(b => b.position === BANNER_POSITION.BOTTOM) ?? null
      );
    });
  }
}
