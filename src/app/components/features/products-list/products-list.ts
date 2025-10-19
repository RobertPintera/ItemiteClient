import {Component, inject, signal} from '@angular/core';
import {ProductListView} from './product-list-view/product-list-view';
import {ProductFilterSidebar} from './product-filter-sidebar/product-filter-sidebar';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-products-list',
  imports: [
    ProductListView,
    ProductFilterSidebar,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList {
  private breakpointObserver = inject(BreakpointObserver);

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);

  constructor() {
    this.breakpointObserver.observe([
      '(min-width: 768px)',
      '(min-width: 1280px)'
    ]).subscribe(result => {
      this.isMd.set(result.breakpoints['(min-width: 768px)']);
      this.isXl.set(result.breakpoints['(min-width: 1280px)']);

      if (this.isXl() && this.isFilterOpen()) {
        this.closeFilter();
      }
    });
  }

  openFilter(){
    this.isFilterOpen.set(true);
    document.body.classList.add('overflow-hidden');
  }

  closeFilter(): void {
    this.isFilterOpen.set(false);
    document.body.classList.remove('overflow-hidden');
  }
}
