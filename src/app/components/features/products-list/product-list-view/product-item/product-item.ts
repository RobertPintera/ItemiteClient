import {Component, HostBinding, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ListingItemDTO} from '../../../../../core/models/LitstingItemDTO';

@Component({
  selector: 'app-product-item',
  imports: [
    RouterLink
  ],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css'
})
export class ProductItem {
  @HostBinding('class')
    hostClass = 'w-full';

  readonly isMd = input.required<boolean>();
  readonly product = input<ListingItemDTO>();
}
