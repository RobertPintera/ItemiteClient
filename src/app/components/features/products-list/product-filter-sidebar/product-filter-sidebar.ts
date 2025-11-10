import {Component, inject, input, OnInit, output } from '@angular/core';
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

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [
    CategoryTree,
    Button,
    ComboBox,
    TranslatePipe,
    GeocoderAutocomplete,
  ],
  templateUrl: './product-filter-sidebar.html',
  styleUrl: './product-filter-sidebar.css'
})
export class ProductFilterSidebar implements OnInit {
  readonly isXl = input.required<boolean>();
  readonly filterClose = output<void>();

  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  readonly filterChange  = output<Partial<ListingFilter>>();

  readonly categoryTree = this.categoryService.subCategories;

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
        // next: tree => console.log('Category tree loaded'),
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

    if (!isNaN(numericValue)) {
      this.filterChange.emit({ distance: numericValue });
    }

    this.filterChange.emit({distance: null});
  }

  updateLocalization(newLocalization: Localization | null) {
    const lattitude = newLocalization ? newLocalization.latitude : null;
    const longtitude = newLocalization ? newLocalization.longitude : null;

    this.filterChange.emit({latitude: lattitude, longitude: longtitude});
  }
}
