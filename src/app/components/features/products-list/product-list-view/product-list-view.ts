import {Component, inject, input, output} from '@angular/core';
import {ProductItem} from './product-item/product-item';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingDTO} from '../../../../core/models/ListingDTO';
import {Loader} from '../../../shared/loader/loader';
import {SortBy, SortDirection} from '../../../../core/constants/constants';

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

  useSorting(sorting: { key: string; value: string }): void {
    if(!sorting) return;
  }

  useSortDirection(sortDirection: { key: string; value: string }): void {
    if(!sortDirection) return;
  }

  openFilter(): void {
    this.filterOpen.emit();
  }
}
