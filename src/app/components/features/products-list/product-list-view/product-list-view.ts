import {Component, HostBinding, inject, input, OnInit, output, signal} from '@angular/core';
import {Product} from '../../../../core/models/Product';
import {ProductItem} from './product-item/product-item';
import {Paginator} from '../../../shared/paginator/paginator';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {ListingService} from '../../../../core/services/listing/listing.service';
import {ListingDTO} from '../../../../core/models/ListingDTO';

@Component({
  selector: 'app-product-list-view',
  imports: [
    ProductItem,
    Paginator,
    ComboBox,
    TranslatePipe,
    Button
  ],
  templateUrl: './product-list-view.html',
  styleUrl: './product-list-view.css'
})
export class ProductListView implements OnInit {
  private translate = inject(TranslateService);
  private listingService = inject(ListingService);

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
    this.listingService.loadListing().subscribe({
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

  products: Product[] = [
    {
      id: 'p1',
      name: 'Apple iPhone 15 Pro',
      categories: ['Electronics', 'Smartphones', 'Apple'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 4999,
      localization: 'Warsaw, Poland',
      dateOfIssue: '2025-09-20',
    },
    {
      id: 'p2',
      name: 'Gaming Laptop ASUS ROG Strix',
      categories: ['Electronics', 'Computers', 'Gaming'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 7299,
      localization: 'Kraków, Poland',
      dateOfIssue: '2025-09-28',
    },
    {
      id: 'p3',
      name: 'Mountain Bike Trek X-Caliber 8',
      categories: ['Sports', 'Bikes', 'Outdoor'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 3899,
      localization: 'Gdańsk, Poland',
      dateOfIssue: '2025-10-05',
    },
    {
      id: 'p4',
      name: 'Samsung 65" QLED 4K Smart TV',
      categories: ['Electronics', 'TVs', 'Home Entertainment'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 5499,
      localization: 'Poznań, Poland',
      dateOfIssue: '2025-09-30',
    },
    {
      id: 'p5',
      name: 'Leather Office Chair Ergonomic Comfort',
      categories: ['Furniture', 'Office', 'Home'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 899,
      localization: 'Wrocław, Poland',
      dateOfIssue: '2025-10-10',
    }
  ];
}
