import {Component, inject, signal, OnInit, OnDestroy, ViewChild, HostBinding} from '@angular/core';
import { ProductListView } from './product-list-view/product-list-view';
import { ProductFilterSidebar } from './product-filter-sidebar/product-filter-sidebar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ListingFilter } from '../../../core/models/ListingFilter';
import { ListingDTO } from '../../../core/models/ListingDTO';
import {Subject, debounceTime, switchMap, takeUntil, finalize, catchError, of} from 'rxjs';
import { ListingService } from '../../../core/services/listing/listing.service';
import {ActivatedRoute} from '@angular/router';
import {ListingType, SortBy, SortDirection} from '../../../core/constants/constants';

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
  @HostBinding('class') hostClass = 'w-full';
  @ViewChild(ProductFilterSidebar) filterSidebarChild!: ProductFilterSidebar;

  private breakpointObserver = inject(BreakpointObserver);
  private listingService = inject(ListingService);
  private route = inject(ActivatedRoute);

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);
  readonly listing = signal<ListingDTO | null>(null);
  readonly loading = signal<boolean>(true);

  readonly filter = signal<ListingFilter>({
    pageSize: 5, pageNumber: 1,
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

    this.route.queryParamMap.subscribe(params => {
      const updated: Partial<ListingFilter> = {};

      const num = (name: string) => {
        const v = params.get(name);
        return v !== null ? Number(v) : null;
      };

      const str = (name: string) => params.get(name);

      updated.pageNumber = num('pageNumber') ?? this.filter().pageNumber;
      updated.pageSize = num('pageSize') ?? this.filter().pageSize;
      updated.priceFrom = num('priceFrom');
      updated.priceTo = num('priceTo');
      updated.longitude = num('longitude');
      updated.latitude = num('latitude');
      updated.distance = num('distance');

      updated.listingType = str('listingType') as ListingType;
      updated.sortBy = str('sortBy') as SortBy;
      updated.sortDirection = str('sortDirection') as SortDirection;

      const categoryIds = params.getAll('categoryIds');
      updated.categoryIds = categoryIds.map(Number);

      const newFilter = { ...this.filter(), ...updated };
      this.filter.set(newFilter);

      this.applyFilter(this.filter());
    });
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
