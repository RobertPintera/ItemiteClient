import {Component, inject, signal, OnInit, OnDestroy, ViewChild, HostBinding} from '@angular/core';
import { ProductListView } from './product-list-view/product-list-view';
import { ProductFilterSidebar } from './product-filter-sidebar/product-filter-sidebar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ListingFilter } from '../../../core/models/listing-general/ListingFilter';
import { ListingResponseDTO } from '../../../core/models/listing-general/ListingResponseDTO';
import {Subject, debounceTime, switchMap, takeUntil, finalize, catchError, of} from 'rxjs';
import { ListingService } from '../../../core/services/listing-service/listing.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OptionItem} from '../../../core/models/OptionItem';
import {Localization} from '../../../core/models/location/Localization';
import {GetListingDTO} from '../../../core/models/listing-general/GetListingDTO';
import {isListingType, isSortDirection} from '../../../core/type-guards/listing-type.guard';

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

  private _breakpointObserver = inject(BreakpointObserver);
  private _listingService = inject(ListingService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private isFirstLoad = true;

  readonly isMd = signal<boolean>(false);
  readonly isXl = signal<boolean>(false);
  readonly isFilterOpen = signal<boolean>(false);
  readonly listing = signal<ListingResponseDTO | null>(null);
  readonly loading = signal<boolean>(false);
  readonly isBlocked = signal<boolean>(false);

  readonly sortDirectionOptions: OptionItem[] = [
    { key: 'none', value: '-'},
    { key: 'Ascending', value: 'sort_directions.ascending' },
    { key: 'Descending', value: 'sort_directions.descending' },
  ];

  readonly sortByOptions: OptionItem[] = [
    { key: 'none', value: '-'},
    { key: 'Price', value: 'sort_by.price' },
    { key: 'CreationDate', value: 'sort_by.creation_date' },
    { key: 'Views', value: 'sort_by.views' },
  ];

  readonly listingTypesOptions: OptionItem[]  = [
    { key: 'none', value: '-'},
    { key: 'Auction', value: 'listing_types.auction' },
    { key: 'Product', value: 'listing_types.product' },
  ];

  readonly distancesOptions: OptionItem[]  = [
    { key: 'none', value: '-'},
    { key: '20', value: '20' },
    { key: '50', value: '50' },
    { key: '70', value: '70' },
    { key: '100', value: '100' },
  ];

  readonly filter = signal<ListingFilter>({
    pageSize: 5,
    pageNumber: 1,
    categoryIds: [],
    priceFrom: null,
    priceTo: null,
    priceError: null,
    listingType: this.listingTypesOptions[0],
    localization: null,
    distance: this.distancesOptions[0],
    localizationText: '',
    sortDirection: this.sortDirectionOptions[0],
    sortBy: this.sortByOptions[0],
  });

  // Debouncing: delays API calls when filters change
  private filterSubject = new Subject<GetListingDTO>();
  private destroy$ = new Subject<void>();

  mainCategoryId : number | null = null;

  ngOnInit() {
    this._breakpointObserver.observe([
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

        return this._listingService.loadListing(filter).pipe(
          catchError(err => {
            console.error('Error loading listings:', err);
            return of(null);
          }),
          finalize(() => {
            this.isBlocked.set(false);
            this.loading.set(false);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => this.listing.set(data),
    });

    this._route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const updated: Partial<ListingFilter> = {};

      const num = (name: string) => {
        const v = params.get(name);
        return v !== null ? Number(v) : null;
      };
      const str = (name: string) => params.get(name);

      updated.pageNumber = num('pageNumber') ?? this.filter().pageNumber;
      updated.priceFrom = num('priceFrom');
      updated.priceTo = num('priceTo');

      const latitude = num('latitude');
      const longitude = num('longitude');

      let localization: Localization | null = null;
      const localizationText = str('localizationText');
      const parts = localizationText?.split(',').map(p => p.trim()) ?? [];
      updated.localizationText = localizationText ?? '';

      if(!(latitude === null || longitude === null)) {
        localization = {
          country: '',
          state: '',
          formatted: localizationText ?? '',
          city: '',
          latitude: latitude,
          longitude: longitude,
        };

        if(parts.length > 1) {
          localization.city = parts[0] ?? '';
          localization.state = parts[1] ?? '';
          localization.country = parts[2] ?? '';
        }
      }

      const distanceValue = str('distance');
      updated.distance =
        this.distancesOptions.find(o => o.key === distanceValue) ??
        this.distancesOptions[0];

      const listingTypeValue = str('listingType');
      updated.listingType =
        this.listingTypesOptions.find(o => o.key === listingTypeValue) ??
        this.listingTypesOptions[0];

      const sortByValue = str('sortBy');
      updated.sortBy =
        this.sortByOptions.find(o => o.key === sortByValue) ??
        this.sortByOptions[0];

      const sortDirectionValue = str('sortDirection');
      updated.sortDirection =
        this.sortDirectionOptions.find(o => o.key === sortDirectionValue) ??
        this.sortDirectionOptions[0];

      const mainCategoryId = num('id');
      const categoryIds = params.getAll('categoryIds').map(Number).filter(n => !isNaN(n));

      if (this.mainCategoryId !== mainCategoryId) {
        this.isFirstLoad = true;
      }

      this.mainCategoryId = mainCategoryId;

      updated.categoryIds =
        categoryIds.length > 0
          ? categoryIds
          : mainCategoryId != null
            ? [mainCategoryId]
            : [];

      const newFilter = { ...this.filter(), ...updated };
      this.filter.set(newFilter);

      if(this.isFirstLoad){
        this.isFirstLoad = false;
        this.loading.set(true);
        this.isBlocked.set(true);

        const listingTypeKey = this.filter().listingType?.key;
        const sortDirectionKey = this.filter().sortDirection?.key;
        const sortByKey = this.filter().sortBy?.key;
        const distanceKey = this.filter().distance?.key;
        const distance = distanceKey && distanceKey !== 'none' ? Number(distanceKey) : null;

        const payload: GetListingDTO = {
          pageSize: this.filter().pageSize,
          pageNumber: this.filter().pageNumber,
          listingType: isListingType(listingTypeKey) ? listingTypeKey : null,
          sortBy: isListingType(sortByKey) ? sortByKey : null,
          sortDirection: isSortDirection(sortDirectionKey) ? sortDirectionKey : null,
          priceFrom: this.filter().priceFrom,
          priceTo: this.filter().priceTo,
          longitude: this.filter().localization?.longitude ?? null,
          latitude: this.filter().localization?.latitude ?? null,
          distance: distance,
          categoryIds: this.filter().categoryIds
        };

        this._listingService.loadListing(payload).pipe(
          catchError(err => {
            console.error('Error loading listings:', err);
            return of(null);
          }),
          finalize(() => {
            this.isBlocked.set(false);
            this.loading.set(false);
          })
        ).subscribe(data => {
          this.listing.set(data);
        });
      }
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
      this.filterSidebarChild.closeFilter();
    }
    this.isFilterOpen.set(false);
    document.body.classList.remove('overflow-hidden');
  }

  updateFilterParameters(partial: Partial<ListingFilter>){
    const newFilter = { ...this.filter(), ...partial };

    if (newFilter.categoryIds?.length) {
      const otherCategories = newFilter.categoryIds.filter(id => id !== this.mainCategoryId);
      if (otherCategories.length > 0) {
        newFilter.categoryIds = otherCategories;
      } else {
        newFilter.categoryIds = this.mainCategoryId ? [this.mainCategoryId] : [];
      }
    }

    this.filter.set(newFilter);
  }

  updateFilter(){
    const filter = this.filter();

    this.filter().pageNumber = 1;

    const uniqueCategoryIds = [...new Set(filter.categoryIds || [])];

    const query = this.serializeFilterToQuery({
      ...filter,
      categoryIds: uniqueCategoryIds
    });

    if (this.mainCategoryId != null) {
      query['id'] = this.mainCategoryId;
    }

    this._router.navigate([], {
      queryParams: query
    });


    console.log(uniqueCategoryIds);
    this.applyFilter();
  }

  private applyFilter() {
    this.isBlocked.set(true);

    const listingTypeKey = this.filter().listingType?.key;
    const sortDirectionKey = this.filter().sortDirection?.key;
    const sortByKey = this.filter().sortBy?.key;
    const distanceKey = this.filter().distance?.key;
    const distance = distanceKey && distanceKey !== 'none' ? Number(distanceKey) : null;

    const payload: GetListingDTO = {
      pageSize: this.filter().pageSize,
      pageNumber: this.filter().pageNumber,
      listingType: isListingType(listingTypeKey) ? listingTypeKey : null,
      sortBy: isListingType(sortByKey) ? sortByKey : null,
      sortDirection: isSortDirection(sortDirectionKey) ? sortDirectionKey : null,
      priceFrom: this.filter().priceFrom,
      priceTo: this.filter().priceTo,
      longitude: this.filter().localization?.longitude ?? null,
      latitude: this.filter().localization?.latitude ?? null,
      distance: distance,
      categoryIds: this.filter().categoryIds
    };

    this.filterSubject.next(payload);
  }

  private serializeFilterToQuery(filter: ListingFilter): Record<string, string | number | (string | number)[]> {
    const params: Record<string, string | number | (string | number)[]> = {};

    const latitude = filter.localization?.latitude;
    const longitude = filter.localization?.longitude;

    if (filter.categoryIds?.length) params['categoryIds'] = [...new Set(filter.categoryIds)];
    if (filter.priceFrom !== null) params['priceFrom'] = filter.priceFrom;
    if (filter.priceTo !== null) params['priceTo'] = filter.priceTo;
    if (filter.listingType && filter.listingType.key !== "none") params['listingType'] = filter.listingType.key;
    if (filter.distance !== null && filter.distance.key !== "none") params['distance'] = filter.distance.key;
    if (latitude != null) params['latitude'] = latitude;
    if (longitude != null) params['longitude'] = longitude;
    if (filter.sortBy && filter.sortBy.key !== "none") params['sortBy'] = filter.sortBy.key;
    if (filter.sortDirection && filter.sortDirection.key !== "none") params['sortDirection'] = filter.sortDirection.key;
    if (filter.pageNumber !== null) params['pageNumber'] = filter.pageNumber;
    if (filter.localizationText !== null && filter.localizationText.trim() !== '') params['localizationText'] = filter.localizationText;

    return params;
  }
}
