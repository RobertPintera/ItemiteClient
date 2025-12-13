import {Component, input} from '@angular/core';
import {ListingItemDTO} from '../../../../../core/models/LitstingItemDTO';
import {LISTING_TYPES} from '../../../../../core/constants/constants';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  styleUrl: './product-card.css'
})
export class ProductCard {
  readonly product = input<ListingItemDTO>();
  protected readonly LISTING_TYPES = LISTING_TYPES;
}
