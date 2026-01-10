import {Component, input, model, output } from '@angular/core';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingResponseDTO} from '../../../../core/models/listing-general/ListingResponseDTO';
import {Loader} from '../../../shared/loader/loader';
import {SORT_DIRECTION, SortBy, SortDirection, SORTS_BY} from '../../../../core/constants/constants';
import {ListingFilter} from '../../../../core/models/listing-general/ListingFilter';
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
export class ProductListView {
  readonly filter = model.required<ListingFilter>();

  readonly isBlocked = input.required<boolean>();
  readonly totalPages = input.required<number>();
  readonly listing = input.required<ListingResponseDTO | null>();
  readonly loading = input.required<boolean>();
  readonly sortDirectionOptions = input.required<OptionItem[]>();
  readonly sortByOptions = input.required<OptionItem[]>();

  readonly isMd = input.required<boolean>();
  readonly isXl = input.required<boolean>();

  readonly filterOpen = output<void>();
  readonly filterUpdate = output<void>();

  useSortDirection(option?: OptionItem): void {
    if (!option) return;

    const allowed = Object.values(SORT_DIRECTION);
    if (allowed.includes(option.key as SortDirection)) {
      this.filter().sortDirection = option;
    }
    else {
      this.filter().sortDirection = this.sortDirectionOptions()[0];
    }

    this.filterUpdate.emit();
  }

  useSortBy(option?: OptionItem): void {
    if (!option) return;

    const allowed = Object.values(SORTS_BY);
    if (allowed.includes(option.key as SortBy)) {
      this.filter().sortBy = option;
    }else{
      this.filter().sortBy = this.sortByOptions()[0];
    }

    this.filterUpdate.emit();
  }

  usePaginator(pageNumber: number): void {
    this.filter().pageNumber = pageNumber;
    this.filterUpdate.emit();
  }

  openFilter(): void {
    this.filterOpen.emit();
  }
}
