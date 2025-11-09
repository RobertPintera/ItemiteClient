import {Component, inject, input, output} from '@angular/core';
import {ProductItem} from './product-item/product-item';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingDTO} from '../../../../core/models/ListingDTO';
import {Loader} from '../../../shared/loader/loader';
import {SORT_DIRECTION, SortBy, SortDirection} from '../../../../core/constants/constants';

@Component({
  selector: 'app-product-list-view',
  imports: [
    ProductItem,
    Paginator,
    ComboBox,
    TranslatePipe,
    Button,
    Loader
  ],
  templateUrl: './product-list-view.html',
  styleUrl: './product-list-view.css'
})
export class ProductListView {
  private translate = inject(TranslateService);

  readonly listing = input.required<ListingDTO | null>();
  readonly loading = input.required<boolean>();
  readonly isMd = input.required<boolean>();
  readonly isXl = input.required<boolean>();
  readonly filterOpen = output<void>();
  readonly sortDirectionChange  = output<null | SortDirection>();
  readonly sortByChange  = output<null | SortBy>();

  sortDirect = [
    { key: 'none', value: '-'},
    { key: 'ascending', value: 'sorting_directions.ascending' },
    { key: 'descending', value: 'sorting_directions.descending' },
  ];

  sortBy = [
    { key: 'none', value: '-'},
    { key: 'price', value: 'sort_by.price' },
    { key: 'creation_date', value: 'sort_by.creation_date' },
    { key: 'views', value: 'sort_by.views' },
  ];

  useSortDirection(sortDirection: { key: string; value: string }): void {
    if(!sortDirection) return;

    const allowedKeys = Object.values(SORT_DIRECTION);

    function isSortDirection(key: string): key is SortDirection {
      return allowedKeys.includes(key as SortDirection);
    }

    if (isSortDirection(sortDirection.key)) {
      this.sortDirectionChange.emit(sortDirection.key);
    } else if (sortDirection.key.includes('none')) {
      this.sortDirectionChange.emit(null);
    }
  }

  useSortBy(sorting: { key: string; value: string }): void {
    if(!sorting) return;
  }

  openFilter(): void {
    this.filterOpen.emit();
  }
}
