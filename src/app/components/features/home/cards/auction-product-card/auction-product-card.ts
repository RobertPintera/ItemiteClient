import {Component, input, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {AuctionProduct} from '../../../../../core/models/AuctionProduct';

@Component({
  selector: 'app-auction-product-card',
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './auction-product-card.html',
  styleUrl: './auction-product-card.css'
})
export class AuctionProductCard {
  readonly product = input<AuctionProduct>();

  isXl = signal<boolean>(false);

  private mediaQuery = window.matchMedia('(min-width: 640px)');
  private listener = (event: MediaQueryListEvent) => this.isXl.set(event.matches);

  constructor() {
    this.isXl.set(this.mediaQuery.matches);
    this.mediaQuery.addEventListener('change', this.listener);
  }

  ngOnDestroy() {
    this.mediaQuery.removeEventListener('change', this.listener);
  }
}
