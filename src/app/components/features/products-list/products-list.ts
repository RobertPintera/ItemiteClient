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

  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);

  constructor() {
    this.breakpointObserver.observe(['(min-width: 1280px)']).subscribe(result => {
      this.isXl.set(result.matches);
    });
  }

  openFilter(){
    this.isFilterOpen.set(true);
  }

  closeFilter(): void {
    this.isFilterOpen.set(false);
  }
}
