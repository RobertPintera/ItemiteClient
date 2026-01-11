import {Component, inject, input, model, OnInit, output, signal } from '@angular/core';
import {CategoryTree} from './category-tree/category-tree';
import {Button} from '../../../shared/button/button';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LISTING_TYPES, ListingType} from '../../../../core/constants/constants';
import {ListingFilter} from '../../../../core/models/listing-general/ListingFilter';
import {GeocoderAutocomplete} from '../../../shared/geocoder-autocomplete/geocoder-autocomplete';
import {Localization} from '../../../../core/models/location/Localization';
import {CategoryTreeDTO} from '../../../../core/models/category/CategoryTreeDTO';
import {InputNumber} from '../../../shared/input-number/input-number';
import {OptionItem} from '../../../../core/models/OptionItem';

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
  private _categoryService = inject(CategoryService);
  private _route = inject(ActivatedRoute);
  private _translator = inject(TranslateService);

  readonly filter = model.required<ListingFilter>();


  readonly mainCategoryId = input.required<number | null>();
  readonly isXl = input.required<boolean>();
  readonly isFilterOpen = input.required<boolean>();
  readonly listingTypesOptions = input.required<OptionItem[]>();
  readonly distancesOptions = input.required<OptionItem[]>();
  readonly isBlocked = input.required<boolean>();

  readonly filterClose = output<void>();
  readonly filterApply = output<void>();

  readonly categoryTree = signal<CategoryTreeDTO | null>(null);

  ngOnInit() {
    this._route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;
      if (validId === null) return;

      this._categoryService.loadCategoryTree(validId).subscribe({
        next: tree => this.categoryTree.set(tree),
        error: err => console.error(err)
      });
    });
  }

  getCategoryName(category: CategoryTreeDTO | null): string {
    if (!category) return '';

    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

  closeFilter(){
    this.filterClose.emit();
  }

  useListingType(option?: OptionItem): void {
    if(!option) return;

    const allowed = Object.values(LISTING_TYPES);

    if (allowed.includes(option.key as ListingType)) {
      this.filter().listingType = option;
    }
    else {
      this.filter().listingType = this.listingTypesOptions()[0];
    }
  }

  useDistance(option?: OptionItem): void {
    if(!option) return;

    if (this.distancesOptions().includes(option)) {
      this.filter().distance = option;
    }
    else {
      this.filter().distance = this.distancesOptions()[0];
    }
  }

  useLocalization(newLocalization: Localization | null) {
    this.filter().localization = newLocalization;
  }

  useLocalizationText(formatted: string) {
    if(formatted === this.filter().localizationText) return;

    this.filter().localizationText = formatted;
    this.filter().localization = null;
  }

  usePriceFrom(priceFrom: number | null) {
    const priceTo = this.filter().priceTo;
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.filter().priceError = 'products_filter.min_max_price_error';
      return;
    }
    this.filter().priceError = null;
  }

  usePriceTo(priceTo: number | null) {
    const priceFrom = this.filter().priceFrom;
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.filter().priceError = 'products_filter.min_max_price_error';
      return;
    }
    this.filter().priceError = null;
  }

  useCategoriesIds(categoryIds: number[]) {
    const otherCategories = categoryIds.filter(id => id !== this.mainCategoryId());
    const mainCategory = this.mainCategoryId();

    console.log(otherCategories);

    if (otherCategories.length > 0) {
      this.filter().categoryIds = otherCategories;
    } else {
      this.filter().categoryIds = mainCategory ? [mainCategory] : [];
    }
  }

  applyFilter() {
    const priceFrom =  this.filter().priceFrom;
    const priceTo = this.filter().priceTo;

    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      this.filter().priceError = 'products_filter.min_max_price_error';
      return;
    }

    this.filterApply.emit();
    this.filterClose.emit();
  }
}
