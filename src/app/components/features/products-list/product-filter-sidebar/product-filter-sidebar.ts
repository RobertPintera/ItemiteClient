import {Component, effect, inject, input, OnInit, output, signal, untracked} from '@angular/core';
import {CategoryTree} from './category-tree/category-tree';
import {Button} from '../../../shared/button/button';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe} from '@ngx-translate/core';
import {LISTING_TYPES, ListingType} from '../../../../core/constants/constants';
import {ListingFilter} from '../../../../core/models/ListingFilter';
import {GeocoderAutocomplete} from '../../../shared/geocoder-autocomplete/geocoder-autocomplete';
import {Localization} from '../../../../core/models/Localization';
import {CategoryTreeDTO} from '../../../../core/models/CategoryTreeDTO';
import {InputNumber} from '../../../shared/input-number/input-number';
import {OptionItem} from '../../../../core/models/OptionItem';
import {FilterSidebar} from '../../../../core/models/FilterSidebar';

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [
    CategoryTree,
    Button,
    ComboBox,
    TranslatePipe,
    GeocoderAutocomplete,
    InputNumber,
  ],
  templateUrl: './product-filter-sidebar.html',
  styleUrl: './product-filter-sidebar.css'
})
export class ProductFilterSidebar implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  readonly filter = input.required<ListingFilter>();
  readonly localizationText = input.required<string | null>();
  readonly isXl = input.required<boolean>();
  readonly isFilterOpen = input.required<boolean>();

  readonly filterClose = output<void>();
  readonly filterChange  = output<Partial<ListingFilter>>();
  readonly localizationTextChange = output<string>();

  readonly categoryTree = signal<CategoryTreeDTO | null>(null);

  readonly lastFilterSidebar = signal<FilterSidebar>({
    categoryIds: [],
    priceFrom: null,
    priceTo: null,
    priceError: null,
    listingType: { key: 'none', value: '-'},
    localizationText: '',
    localization: null,
    distance: { key: 'none', value: '-'}
  });

  readonly filterSidebar = signal<FilterSidebar>({
    categoryIds: [],
    priceFrom: null,
    priceTo: null,
    priceError: null,
    listingType: { key: 'none', value: '-'},
    localizationText: '',
    localization: null,
    distance: { key: 'none', value: '-'}
  });

  listingTypesOptions: OptionItem[]  = [
    { key: 'none', value: '-'},
    { key: 'auction', value: 'listing_types.auction' },
    { key: 'product', value: 'listing_types.product' },
  ];

  distancesOptions: OptionItem[]  = [
    { key: 'none', value: '-'},
    { key: '20', value: '20' },
    { key: '50', value: '50' },
    { key: '70', value: '70' },
    { key: '100', value: '100' },
  ];

  constructor() {
    effect(() => {
      const isXl = this.isXl();
      const isFilterOpen = untracked(() => this.isFilterOpen());
      const lastFilter = untracked(() => this.lastFilterSidebar());
      if(isXl && isFilterOpen) {
        this.filterSidebar.set(structuredClone(lastFilter));
        this.filterClose.emit();
      }
    });

    effect(() => {
      const filterSidebar = this.filterSidebar();
      const isXl = untracked(() => this.isXl());
      if(isXl) {
        this.lastFilterSidebar.set(structuredClone(filterSidebar));
      }
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;
      if (validId === null) return;

      this.categoryService.loadCategoryTree(validId).subscribe({
        next: tree => this.categoryTree.set(tree),
        error: err => console.error(err)
      });
    });

    this.filterSidebar().priceFrom = this.filter().priceFrom;
    this.filterSidebar().priceTo = this.filter().priceTo;

    const listingTypeKey = this.filter().listingType;
    const selectedListingType = this.listingTypesOptions.find(opt => opt.key === listingTypeKey);

    if (selectedListingType) {
      this.filterSidebar().listingType = selectedListingType;
    } else {
      this.filterSidebar().listingType = this.listingTypesOptions[0];
    }

    const distanceKey = this.filter().distance?.toString();
    const selectedDistance = this.distancesOptions.find(opt => opt.key === distanceKey);

    if (selectedDistance) {
      this.filterSidebar().distance = selectedDistance;
    } else {
      this.filterSidebar().distance = this.distancesOptions[0];
    }

    const categoryIds = this.filter().categoryIds;
    if(categoryIds){
      this.filterSidebar().categoryIds = categoryIds;
    }

    const localizationText = this.localizationText();
    if(localizationText) {
      this.filterSidebar().localizationText = localizationText;
      console.log(localizationText);
    }
  }

  closeFilterX(){
    this.filterSidebar.set(structuredClone(this.lastFilterSidebar()));
    this.filterClose.emit();
  }

  useListingType(option?: OptionItem): void {
    if(!option || !this.isXl()) return;

    const allowed = Object.values(LISTING_TYPES);
    const value = allowed.includes(option.key as ListingType) ? option.key as ListingType : null;

    this.updateFilter({listingType: value});
  }

  useDistance(option?: OptionItem): void {
    if(!option || !this.isXl()) return;

    const numericValue = Number(option.key);
    const value = !isNaN(numericValue) ? numericValue : null;

    this.updateFilter({distance: value});
  }

  useLocalization(newLocalization: Localization | null) {
    if(!this.isXl() || newLocalization?.formatted === this.lastFilterSidebar().localization?.formatted) return;

    this.updateFilter({
      latitude: newLocalization?.latitude ?? null,
      longitude: newLocalization?.longitude ?? null,
    });
  }

  useLocalizationText(formatted: string) {
    if(!this.isXl() || formatted === this.lastFilterSidebar().localizationText) return;

    this.localizationTextChange.emit(formatted);
  }

  usePriceFrom(priceFrom: number | null) {
    const priceTo = this.filterSidebar().priceTo;
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.filterSidebar().priceError = 'Minimal price cannot be greater than maximal price.';
      return;
    }
    this.filterSidebar().priceError = null;

    if(!this.isXl() || priceFrom === this.lastFilterSidebar().priceFrom) return;

    this.updateFilter({priceFrom: priceFrom});
  }

  usePriceTo(priceTo: number | null) {
    const priceFrom = Number(this.filterSidebar().priceFrom);
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.filterSidebar().priceError = 'Minimal price cannot be greater than maximal price.';
      return;
    }
    this.filterSidebar().priceError = null;

    if(!this.isXl() || priceTo === this.lastFilterSidebar().priceTo) return;

    this.updateFilter({priceTo: priceTo});
  }

  useCategoriesIds(categoryIds: number[]) {
    if(!this.isXl()) return;
    this.updateFilter({ categoryIds });
  }

  applyMobileFilter() {
    const sidebar = this.filterSidebar();

    const listingTypeKey = sidebar.listingType.key;
    const allowed = Object.values(LISTING_TYPES);
    const listingTypeValue = allowed.includes(listingTypeKey as ListingType) ? listingTypeKey as ListingType : null;

    const distanceKey = Number(sidebar.distance.key);
    const distanceValue = !isNaN(distanceKey) ? distanceKey : null;

    const priceFrom =  sidebar.priceFrom;
    const priceTo = sidebar.priceTo;

    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.filterSidebar().priceError = 'Minimal price cannot be greater than maximal price.';
      return;
    }

    const longitude = sidebar.localization?.longitude ?? null;
    const latitude = sidebar.localization?.latitude ?? null;

    const categoryIds = sidebar.categoryIds;

    const partial: Partial<ListingFilter> = {
      listingType: listingTypeValue,
      priceFrom: priceFrom,
      priceTo: priceTo,
      longitude: longitude,
      latitude: latitude,
      distance: distanceValue,
      categoryIds: categoryIds
    };
    this.updateFilter(partial);
    this.filterClose.emit();
  }

  private updateFilter(partial: Partial<ListingFilter>) {
    this.lastFilterSidebar.set(structuredClone(this.filterSidebar()));
    this.localizationTextChange.emit(this.filterSidebar().localizationText);
    this.filterChange.emit(partial);
  }
}
