import {Component, effect, inject, input, model, output, signal} from '@angular/core';
import {ProductItem} from './product-item/product-item';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingDTO} from '../../../../core/models/ListingDTO';
import {Loader} from '../../../shared/loader/loader';
import {SORT_DIRECTION, SortBy, SortDirection, SORTS_BY} from '../../../../core/constants/constants';
import {ListingFilter} from '../../../../core/models/ListingFilter';
import {OptionItem} from '../../../../core/models/OptionItem';

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
  readonly pageNumber = model.required<number>();
  readonly pageSize = model.required<number>();
  readonly totalPages = input.required<number>();

  readonly listing = input.required<ListingDTO | null>();
  readonly loading = input.required<boolean>();

  readonly isMd = input.required<boolean>();
  readonly isXl = input.required<boolean>();

  readonly filterOpen = output<void>();
  readonly filterChange  = output<Partial<ListingFilter>>();

  sortDirect = [
    { key: 'none', value: '-'},
    { key: 'ascending', value: 'sort_directions.ascending' },
    { key: 'descending', value: 'sort_directions.descending' },
  ];

  sortBy = [
    { key: 'none', value: '-'},
    { key: 'price', value: 'sort_by.price' },
    { key: 'creationDate', value: 'sort_by.creation_date' },
    { key: 'views', value: 'sort_by.views' },
  ];

  useSortDirection(option?: OptionItem): void {
    if (!option) return;

    const allowed = Object.values(SORT_DIRECTION);
    if (allowed.includes(option.key as SortDirection)) {
      this.filterChange.emit({sortDirection: option.key as SortDirection});
      return;
    }
    this.filterChange.emit({sortDirection: null});
  }

  useSortBy(option?: OptionItem): void {
    if (!option) return;

    const allowed = Object.values(SORTS_BY);
    if (allowed.includes(option.key as SortBy)) {
      this.filterChange.emit({sortBy: option.key as SortBy});
      return;
    }
    this.filterChange.emit({sortBy: null});
  }

  usePaginator(pageNumber: number): void {
    this.filterChange.emit({pageNumber: pageNumber});
  }

  openFilter(): void {
    this.filterOpen.emit();
  }
}
