import {Component, input, model, OnInit, output, signal} from '@angular/core';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingResponseDTO} from '../../../../core/models/ListingResponseDTO';
import {Loader} from '../../../shared/loader/loader';
import {SORT_DIRECTION, SortBy, SortDirection, SORTS_BY} from '../../../../core/constants/constants';
import {ListingFilter} from '../../../../core/models/ListingFilter';
import {OptionItem} from '../../../../core/models/OptionItem';
import {ProductItem} from '../../../shared/product-item/product-item';

@Component({
  selector: 'app-product-list-view',
  imports: [
    ProductItem,
    Paginator,
    ComboBox,
    TranslatePipe,
    Button,
    Loader,
    ProductItem
  ],
  templateUrl: './product-list-view.html',
  styleUrl: './product-list-view.css'
})
export class ProductListView implements OnInit {
  readonly pageNumber = model.required<number | null>();
  readonly pageSize = model.required<number | null>();

  readonly filter = input.required<ListingFilter>();
  readonly isBlocked = input.required<boolean>();
  readonly totalPages = input.required<number>();
  readonly listing = input.required<ListingResponseDTO | null>();
  readonly loading = input.required<boolean>();

  readonly isMd = input.required<boolean>();
  readonly isXl = input.required<boolean>();

  readonly filterOpen = output<void>();
  readonly filterChange  = output<Partial<ListingFilter>>();

  readonly sortDirection = signal<OptionItem>({ key: 'none', value: '-'});
  readonly sortBy = signal<OptionItem>({ key: 'none', value: '-'});

  sortDirectionOptions = [
    { key: 'none', value: '-'},
    { key: 'Ascending', value: 'sort_directions.ascending' },
    { key: 'Descending', value: 'sort_directions.descending' },
  ];

  sortByOptions = [
    { key: 'none', value: '-'},
    { key: 'Price', value: 'sort_by.price' },
    { key: 'CreationDate', value: 'sort_by.creation_date' },
    { key: 'Views', value: 'sort_by.views' },
  ];

  ngOnInit() {
    const sortDirectionKey = this.filter().sortDirection;
    const selectedSortDirectionOption = this.sortDirectionOptions.find(opt => opt.key === sortDirectionKey);

    if (selectedSortDirectionOption) {
      this.sortDirection.set(selectedSortDirectionOption);
    } else {
      this.sortDirection.set(this.sortByOptions[0]);
    }

    const sortByKey = this.filter().sortBy;
    const selectedSortByOption = this.sortByOptions.find(opt => opt.key === sortByKey);

    if (selectedSortByOption) {
      this.sortBy.set(selectedSortByOption);
    } else {
      this.sortBy.set(this.sortByOptions[0]);
    }
  }

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
