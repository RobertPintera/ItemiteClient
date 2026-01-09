import {Component, inject, input} from '@angular/core';
import {SaleItemDTO} from '../../../../core/models/payments/SaleItemDTO';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {Button} from '../../../shared/button/button';
import {DatePipe} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {UnderscorePipe} from '../../../../core/pipes/underscore-pipe/underscore-pipe';
import {imageError} from '../../../../core/utility/global-utility';
import {BasicCategory} from '../../../../core/models/category/BasicCategory';

@Component({
  selector: 'app-sale-item',
  imports: [
    Button,
    DatePipe,
    TranslatePipe,
    RouterLink,
    UnderscorePipe
  ],
  templateUrl: './sale-item.html',
  styleUrl: './sale-item.css',
})
export class SaleItem {
  private _translator = inject(TranslateService);

  readonly sale = input.required<SaleItemDTO>();

  getCategoryName(category: BasicCategory): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

  protected readonly LISTING_TYPES = LISTING_TYPES;
  protected readonly imageError = imageError;
}
