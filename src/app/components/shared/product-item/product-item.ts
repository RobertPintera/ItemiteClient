import {Component, HostBinding, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {DatePipe, NgClass} from '@angular/common';
import {ListingItemDTO} from '../../../core/models/listing-general/LitstingItemDTO';
import {LISTING_TYPES} from '../../../core/constants/constants';

@Component({
  selector: 'app-product-item',
  imports: [
    RouterLink,
    TranslatePipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css'
})
export class ProductItem {
  @HostBinding('class') hostClass = 'w-full';

  readonly isMd = input.required<boolean>();
  readonly showStatus = input<boolean>(false);
  readonly product = input<ListingItemDTO>();
  protected readonly LISTING_TYPES = LISTING_TYPES;
}
