import {Component, inject, OnInit, signal} from '@angular/core';
import {ProductListView} from './product-list-view/product-list-view';
import {ProductFilterSidebar} from './product-filter-sidebar/product-filter-sidebar';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ListingFilter} from '../../../core/models/ListingFilter';
import {ListingDTO} from '../../../core/models/ListingDTO';
import {finalize} from 'rxjs';
import {ListingService} from '../../../core/services/listing/listing.service';

@Component({
  selector: 'app-products-list',
  imports: [
    ProductListView,
    ProductFilterSidebar,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private listingService = inject(ListingService);

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);

  listing = signal<ListingDTO | null>(null);
  listingFilter = signal<ListingFilter>({
    pageSize: 10,
    pageNumber: 1,
    listingType: null,
    sortBy: null,
    sortDirection: null,
    priceFrom: null,
    priceTo: null,
    longitude: null,
    latitude: null,
    distance: null,
    categoryIds: [],
  });
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loading.set(true);
    this.listingService.loadListing()
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.loading.set(false);
          }, 3000);
        })
      )
      .subscribe({
        next: listing => this.listing.set(listing),
        error: err => console.error(err)
      });
  }

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
