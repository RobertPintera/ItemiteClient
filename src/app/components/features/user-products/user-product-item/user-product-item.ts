import {Component, HostBinding, input} from '@angular/core';
import {ListingItemDTO} from '../../../../core/models/LitstingItemDTO';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-product-item',
  imports: [
    RouterLink
  ],
  templateUrl: './user-product-item.html',
  styleUrl: './user-product-item.css'
})
export class UserProductItem {
  @HostBinding('class') hostClass = 'w-full';

  readonly isMd = input.required<boolean>();
  readonly product = input<ListingItemDTO>();
}
