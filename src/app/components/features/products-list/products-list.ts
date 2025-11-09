import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ProductListView } from './product-list-view/product-list-view';
import { ProductFilterSidebar } from './product-filter-sidebar/product-filter-sidebar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ListingFilter } from '../../../core/models/ListingFilter';
import { ListingDTO } from '../../../core/models/ListingDTO';
import { Subject, debounceTime, switchMap, takeUntil, finalize } from 'rxjs';
import { ListingService } from '../../../core/services/listing/listing.service';
import { SortBy, SortDirection } from '../../../core/constants/constants';

@Component({
  selector: 'app-products-list',
  imports: [
    ProductListView,
    ProductFilterSidebar,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private listingService = inject(ListingService);

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);

  listing = signal<ListingDTO | null>(null);
  loading = signal<boolean>(false);

  filter = signal<ListingFilter>({
    pageSize: 10, pageNumber: 1,
    listingType: null,
    sortBy: null, sortDirection: null,
    priceFrom: null, priceTo: null,
    longitude: null, latitude: null, distance: null,
    categoryIds: [],
  });

  private filterSubject = new Subject<ListingFilter>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
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

    this.filterSubject.pipe(
      debounceTime(1000),
      switchMap(filter => {
        this.loading.set(true);
        return this.listingService.loadListing(filter).pipe(
          finalize(() => {
            setTimeout(() => this.loading.set(false), 500);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => this.listing.set(data),
      error: (err) => console.error(err)
    });

    this.applyFilter(this.filter());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openFilter() {
    this.isFilterOpen.set(true);
    document.body.classList.add('overflow-hidden');
  }

  closeFilter(): void {
    this.isFilterOpen.set(false);
    document.body.classList.remove('overflow-hidden');
  }

  updateFilter(partial: Partial<ListingFilter>) {
    const newFilter = { ...this.filter(), ...partial };
    this.filter.set(newFilter);
    this.applyFilter(newFilter);
  }

  private applyFilter(filter: ListingFilter) {
    this.filterSubject.next(filter);
  }

  onSortByChange(sortBy: SortBy | null) {
    this.updateFilter({ sortBy });
  }

  onSortDirectionChange(sortDirection: SortDirection | null) {
    this.updateFilter({ sortDirection });
  }
}
