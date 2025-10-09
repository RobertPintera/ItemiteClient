import {Component, input, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {AuctionProduct} from '../../../../../core/models/AuctionProduct';

interface ProductInfoItem {
  id: number;
  label: string;
  value: string | number | undefined;
}

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
  isRow = signal<boolean>(false);

  info = signal<ProductInfoItem[]>([])

  private breakpoints: { name: 'sm' | 'lg' | 'xl'; query: string; list?: MediaQueryList; listener?: (e: MediaQueryListEvent) => void }[] = [
    { name: 'sm', query: '(min-width: 640px)' },
    { name: 'lg', query: '(min-width: 1024px)' },
    { name: 'xl', query: '(min-width: 1280px)' }
  ];

  ngOnInit() {
    this.info.set([
      { id: 1, label: 'Bidders number', value: this.product()?.biddersNumber },
      { id: 2, label: 'Current price', value: this.product()?.highestPrice },
      { id: 3, label: 'Auction end date', value: this.product()?.endDate },
    ]);

    if (typeof window === 'undefined') return;

    this.breakpoints.forEach(bp => {
      const list = window.matchMedia(bp.query);
      const listener = () => this.updateIsRow();
      bp.list = list;
      bp.listener = listener;

      this.updateIsRow();

      list.addEventListener('change', listener);
    });
  }

  ngOnDestroy() {
    this.breakpoints.forEach(bp => {
      if (bp.list && bp.listener) {
        bp.list.removeEventListener('change', bp.listener);
      }
    });
  }

  private updateIsRow() {
    const sm = this.breakpoints.find(bp => bp.name === 'sm')?.list?.matches ?? false;
    const lg = this.breakpoints.find(bp => bp.name === 'lg')?.list?.matches ?? false;
    const xl = this.breakpoints.find(bp => bp.name === 'xl')?.list?.matches ?? false;

    this.isRow.set((xl && lg) || (!lg && sm));
  }
}
