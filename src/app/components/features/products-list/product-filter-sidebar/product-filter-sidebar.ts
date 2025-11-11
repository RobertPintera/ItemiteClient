import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {CategoryTree} from './category-tree/category-tree';
import {Button} from '../../../shared/button/button';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe} from '@ngx-translate/core';
import {LISTING_TYPES, ListingType } from '../../../../core/constants/constants';
import {ListingFilter} from '../../../../core/models/ListingFilter';
import {GeocoderAutocomplete} from '../../../shared/geocoder-autocomplete/geocoder-autocomplete';
import {Localization} from '../../../../core/models/Localization';
import {CategoryTreeDTO} from '../../../../core/models/CategoryTreeDTO';
import {InputNumber} from '../../../shared/input-number/input-number';

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

  readonly isXl = input.required<boolean>();
  readonly filterClose = output<void>();
  readonly filterChange  = output<Partial<ListingFilter>>();

  categoryTree = signal<CategoryTreeDTO | null>(null);
  draftFilter = signal<Partial<ListingFilter>>({});
  priceError = signal<string | null>(null);

  categoryIds = signal<number[]>([]);
  priceFrom = signal<number | null>(null);
  priceTo = signal<number | null>(null);
  listingType = signal<ListingType | null>(null);
  localization = signal<Localization | null>(null);
  distance = signal<number | null>(null);

  listingTypes = [
    { key: 'none', value: '-'},
    { key: 'auction', value: 'listing_types.auction' },
    { key: 'product', value: 'listing_types.product' },
  ];

  distances = [
    { key: 'none', value: '-'},
    { key: '20', value: '20' },
    { key: '50', value: '50' },
    { key: '70', value: '70' },
    { key: '100', value: '100' },
  ];


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
  }

  closeFilter(){
    this.filterClose.emit();
  }

  private updateFilter(partial: Partial<ListingFilter>) {
    if (this.isXl()) {
      this.filterChange.emit(partial);
    } else {
      this.draftFilter.set({...this.draftFilter(), ...partial});
    }
  }

  useListingType(option: { key: string; value: string }): void {
    const allowed = Object.values(LISTING_TYPES);
    const value = allowed.includes(option.key as ListingType) ? option.key as ListingType : null;
    this.listingType.set(value);
    this.updateFilter({ listingType: value });
  }

  useDistance(option: { key: string; value: string }): void {
    const numericValue = Number(option.key);
    const value = !isNaN(numericValue) ? numericValue : null;
    this.distance.set(value);
    this.updateFilter({ distance: value });
  }

  useLocalization(newLocalization: Localization | null) {
    this.localization.set(newLocalization);
    this.updateFilter({
      latitude: newLocalization?.latitude ?? null,
      longitude: newLocalization?.longitude ?? null,
    });
  }

  usePriceFrom(priceFrom: number | null) {
    const priceTo = this.priceTo();
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.priceError.set('Minimal price cannot be greater than maximal price.');
      return;
    }
    this.priceError.set(null);

    this.priceFrom.set(priceFrom);
    this.updateFilter({ priceFrom });
  }

  usePriceTo(priceTo: number | null) {
    const priceFrom = this.priceFrom();
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.priceError.set('Minimal price cannot be greater than maximal price.');
      return;
    }
    this.priceError.set(null);

    this.priceTo.set(priceTo);
    this.updateFilter({ priceTo });
  }

  useCategoriesIds(categoryIds: number[]) {
    this.categoryIds.set(categoryIds);
    this.updateFilter({ categoryIds });
  }

  applyMobileFilter() {
    this.filterChange.emit(this.draftFilter());
    this.closeFilter();
  }
}
