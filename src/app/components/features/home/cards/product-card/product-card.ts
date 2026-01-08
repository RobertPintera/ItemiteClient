import {Component, inject, input} from '@angular/core';
import {ListingItemDTO} from '../../../../../core/models/listing-general/LitstingItemDTO';
import {LISTING_TYPES} from '../../../../../core/constants/constants';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {BasicCategory} from '../../../../../core/models/category/BasicCategory';

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
  private _translator = inject(TranslateService);

  readonly product = input<ListingItemDTO>();
  protected readonly LISTING_TYPES = LISTING_TYPES;

  getCategoryName(category: BasicCategory): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }
}
