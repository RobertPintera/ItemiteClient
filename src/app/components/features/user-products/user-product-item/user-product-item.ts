import {Component, HostBinding, input} from '@angular/core';
import {ListingItemDTO} from '../../../../core/models/LitstingItemDTO';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user-product-item',
  imports: [
    RouterLink,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './user-product-item.html',
  styleUrl: './user-product-item.css'
})
export class UserProductItem {
  @HostBinding('class') hostClass = 'w-full';

  readonly isMd = input.required<boolean>();
  readonly product = input<ListingItemDTO>();
  protected readonly LISTING_TYPES = LISTING_TYPES;
}
