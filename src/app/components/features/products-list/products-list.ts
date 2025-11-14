import {Component, inject, signal, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ProductListView } from './product-list-view/product-list-view';
import { ProductFilterSidebar } from './product-filter-sidebar/product-filter-sidebar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ListingFilter } from '../../../core/models/ListingFilter';
import { ListingDTO } from '../../../core/models/ListingDTO';
import {Subject, debounceTime, switchMap, takeUntil, finalize, catchError, of} from 'rxjs';
import { ListingService } from '../../../core/services/listing/listing.service';

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
  @ViewChild(ProductFilterSidebar) filterSidebarChild!: ProductFilterSidebar;

  private breakpointObserver = inject(BreakpointObserver);
  private listingService = inject(ListingService);

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);
  readonly listing = signal<ListingDTO | null>(null);
  readonly loading = signal<boolean>(true);

  readonly filter = signal<ListingFilter>({
    pageSize: 10, pageNumber: 1,
    listingType: null,
    sortBy: null, sortDirection: null,
    priceFrom: null, priceTo: null,
    longitude: null, latitude: null, distance: null,
    categoryIds: [],
  });

  // Debouncing: delays API calls when filters change
  private filterSubject = new Subject<ListingFilter>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.breakpointObserver.observe([
      '(min-width: 768px)',
      '(min-width: 1280px)'
    ]).subscribe(result => {
      this.isMd.set(result.breakpoints['(min-width: 768px)']);
      this.isXl.set(result.breakpoints['(min-width: 1280px)']);
    });

    this.filterSubject.pipe(
      debounceTime(1000),
      switchMap(filter => {
        this.loading.set(true);
        return this.listingService.loadListing(filter).pipe(
          catchError(err => {
            console.error('Error loading listings:', err);
            return of(null);
          }),
          finalize(() => {
            setTimeout(() => this.loading.set(false), 500);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => this.listing.set(data),
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

  closeOverlay() {
    if (this.filterSidebarChild) {
      this.filterSidebarChild.closeFilterX(); // resetuje sidebar
    }
    this.isFilterOpen.set(false); // zamyka overlay
    document.body.classList.remove('overflow-hidden');
  }

  updateFilter(partial: Partial<ListingFilter>) {
    const newFilter = {...this.filter(), ...partial};
    this.filter.set(newFilter);
    this.applyFilter(newFilter);
  }

  private applyFilter(filter: ListingFilter) {
    this.filterSubject.next(filter);
  }
}
