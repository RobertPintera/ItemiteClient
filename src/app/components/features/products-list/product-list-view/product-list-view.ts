import {Component, HostBinding, inject, input, OnInit, output, signal} from '@angular/core';
import {ProductItem} from './product-item/product-item';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingService} from '../../../../core/services/listing/listing.service';
import {ListingDTO} from '../../../../core/models/ListingDTO';
import {finalize} from 'rxjs';
import {Loader} from '../../../shared/loader/loader';

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
export class ProductListView implements OnInit {
  private translate = inject(TranslateService);
  private listingService = inject(ListingService);

  loading = signal<boolean>(false);
  listing = signal<ListingDTO | null>(null);

  readonly isMd = input.required<boolean>();
  readonly isXl = input.required<boolean>();
  readonly filterOpen = output<void>();

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

  ngOnInit() {
    this.loading.set(true);
    this.listingService.loadListing()
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.loading.set(false);
          }, 3000);
        })
      )
      .subscribe({
        next: listing => this.listing.set(listing),
        error: err => console.error(err)
      });
  }

  useSorting(sorting: { key: string; value: string }): void {
    if(!sorting) return;
  }

  useSortDirect(sortDirection: { key: string; value: string }): void {
    if(!sortDirection) return;
  }

  openFilter(): void {
    this.filterOpen.emit();
  }
}
