import {Component, inject, signal, OnInit, OnDestroy, ViewChild, HostBinding} from '@angular/core';
import { ProductListView } from './product-list-view/product-list-view';
import { ProductFilterSidebar } from './product-filter-sidebar/product-filter-sidebar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ListingFilter } from '../../../core/models/ListingFilter';
import { ListingResponseDTO } from '../../../core/models/ListingResponseDTO';
import {Subject, debounceTime, switchMap, takeUntil, finalize, catchError, of} from 'rxjs';
import { ListingService } from '../../../core/services/listing-service/listing.service';
import {ActivatedRoute, Router} from '@angular/router';
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
  private router = inject(Router);

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);
  readonly listing = signal<ListingResponseDTO | null>(null);
  readonly loading = signal<boolean>(true);
  readonly isBlocked = signal<boolean>(false);

  readonly filter = signal<ListingFilter>({
    pageSize: 5, pageNumber: 1,
    listingType: null,
    sortBy: null, sortDirection: null,
    priceFrom: null, priceTo: null,
    longitude: null, latitude: null, distance: null,
    categoryIds: [],
  });
  readonly localizationText = signal<string | null>(null);

  // Debouncing: delays API calls when filters change
  private filterSubject = new Subject<ListingFilter>();
  private destroy$ = new Subject<void>();

  mainCategoryId : number | null = null;

  ngOnInit() {
    this.breakpointObserver.observe([
      '(min-width: 768px)',
      '(min-width: 1280px)'
    ]).pipe(takeUntil(this.destroy$)).subscribe(result => {
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
            setTimeout(() => {
              this.isBlocked.set(false);
              this.loading.set(false);
            }, 500);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => this.listing.set(data),
    });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
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

      const mainCategoryId = num('id');
      const categoryIds = params.getAll('categoryIds').map(Number);
      this.mainCategoryId = mainCategoryId;
      updated.categoryIds = categoryIds.length > 0 ? categoryIds : (mainCategoryId ? [mainCategoryId] : []);

      const newFilter = { ...this.filter(), ...updated };
      this.filter.set(newFilter);
      this.localizationText.set(str("localizationText"));

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
      this.filterSidebarChild.closeFilterX();
    }
    this.isFilterOpen.set(false);
    document.body.classList.remove('overflow-hidden');
  }

  updateFilter(partial: Partial<ListingFilter>) {
    const newFilter = { ...this.filter(), ...partial };

    const hasOtherChanges = Object.keys(partial).some(key => key !== 'pageNumber' && partial[key as keyof ListingFilter] !== this.filter()[key as keyof ListingFilter]);

    if (hasOtherChanges) {
      newFilter.pageNumber = 1;
    }

    if (newFilter.categoryIds?.length) {
      const otherCategories = newFilter.categoryIds.filter(id => id !== this.mainCategoryId);
      if (otherCategories.length > 0) {
        newFilter.categoryIds = otherCategories;
      } else {
        newFilter.categoryIds = this.mainCategoryId ? [this.mainCategoryId] : [];
      }
    }

    this.filter.set(newFilter);

    const uniqueCategoryIds = [...new Set(newFilter.categoryIds || [])];

    const query = this.serializeFilterToQuery({
      ...newFilter,
      categoryIds: uniqueCategoryIds
    });

    if (this.mainCategoryId != null) {
      query['id'] = this.mainCategoryId;
    }

    const formatted = this.localizationText();
    if (formatted?.trim()) {
      query['localizationText'] = formatted;
    }

    this.router.navigate([], {
      queryParams: query
    });

    this.applyFilter(newFilter);
  }

  updateLocalizationText(localizationText: string){
    this.localizationText.set(localizationText);

    const query = this.serializeFilterToQuery(this.filter());

    if (this.mainCategoryId != null) {
      query['id'] = this.mainCategoryId;
    }

    const formatted = this.localizationText();
    if (formatted && formatted.trim() !== '') {
      query['localizationText'] = formatted;
    }

    this.router.navigate([], {
      queryParams: query
    });
  }

  private applyFilter(filter: ListingFilter) {
    this.isBlocked.set(true);
    this.filterSubject.next(filter);
  }

  private serializeFilterToQuery(filter: ListingFilter): Record<string, string | number | (string | number)[]> {
    const params: Record<string, string | number | (string | number)[]> = {};

    if (filter.categoryIds?.length) params['categoryIds'] = [...new Set(filter.categoryIds)];
    if (filter.priceFrom != null) params['priceFrom'] = filter.priceFrom;
    if (filter.priceTo != null) params['priceTo'] = filter.priceTo;
    if (filter.listingType) params['listingType'] = filter.listingType;
    if (filter.distance != null) params['distance'] = filter.distance;
    if (filter.latitude != null) params['latitude'] = filter.latitude;
    if (filter.longitude != null) params['longitude'] = filter.longitude;
    if (filter.sortBy) params['sortBy'] = filter.sortBy;
    if (filter.sortDirection) params['sortDirection'] = filter.sortDirection;
    if (filter.pageNumber != null) params['pageNumber'] = filter.pageNumber;
    if (filter.pageSize != null) params['pageSize'] = filter.pageSize;

    return params;
  }
}
