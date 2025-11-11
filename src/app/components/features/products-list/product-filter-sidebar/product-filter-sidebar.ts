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
  priceFrom = signal<number | null>(null);
  priceTo = signal<number | null>(null);

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

  useListingType(option: { key: string; value: string }): void {
    if(!option) return;

    const allowed = Object.values(LISTING_TYPES);
    if (allowed.includes(option.key as ListingType)) {
      this.filterChange.emit({listingType: option.key as ListingType});
      return;
    }
    this.filterChange.emit({listingType: null});
  }

  useDistance(option: { key: string; value: string }): void {
    if(!option) return;

    const numericValue = Number(option.key);
    this.filterChange.emit({distance: !isNaN(numericValue) ? numericValue : null});
  }

  useLocalization(newLocalization: Localization | null) {
    const latitude = newLocalization?.latitude ?? null;
    const longitude = newLocalization?.longitude ?? null;

    this.filterChange.emit({latitude: latitude, longitude: longitude});
  }

  onPriceFromInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'ArrowUp', 'ArrowDown'];
    if (allowedKeys.includes(event.key)) return;

    const input = event.target as HTMLInputElement;

    const regex = /^\d*\.?\d{0,2}$/;

    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  onPriceToInput(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
      'Home', 'End', 'Enter', '.', ',', // dopuszczamy . i , (zamienimy na .)
    ];
  }

  usePriceFrom(priceFrom: number | null) {
    this.filterChange.emit({priceFrom: priceFrom});
  }

  usePriceTo(priceTo: number | null) {
    this.filterChange.emit({priceTo: priceTo});
  }

  useCategoriesIds(categoriesIds: number[]) {
    this.filterChange.emit(({categoryIds: categoriesIds}));
  }
}
