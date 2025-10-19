import {Component, inject, signal} from '@angular/core';
import {ProductListView} from './product-list-view/product-list-view';
import {ProductFilterSidebar} from './product-filter-sidebar/product-filter-sidebar';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [
    ProductListView,
    ProductFilterSidebar,
    NgClass
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList {
  private breakpointObserver = inject(BreakpointObserver);

  readonly isSm = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);

  constructor() {
    this.breakpointObserver.observe(['(min-width: 1280px)']).subscribe(result => {
      this.isXl.set(result.matches);
      if (result.matches && this.isFilterOpen()) {
        this.closeFilter();
      }
    });

    this.breakpointObserver.observe(['(min-width: 640px)']).subscribe(result => {
      this.isSm.set(result.matches);
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
