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

  private mediaQuery?: MediaQueryList;
  private listener?: (event: MediaQueryListEvent) => void;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(min-width: 640px)');
      this.listener = (event: MediaQueryListEvent) => this.isXl.set(event.matches);

      this.isXl.set(this.mediaQuery.matches);
      this.mediaQuery.addEventListener('change', this.listener);
    }
  }

  ngOnDestroy() {
    if (this.mediaQuery && this.listener) {
      this.mediaQuery.removeEventListener('change', this.listener);
    }
  }
}
