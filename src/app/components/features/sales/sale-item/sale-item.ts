import {Component, input} from '@angular/core';
import {SaleItemDTO} from '../../../../core/models/payments/SaleItemDTO';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {Button} from '../../../shared/button/button';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {UnderscorePipe} from '../../../../core/pipes/underscore-pipe/underscore-pipe';
import {imageError} from '../../../../core/utility/global-utility';

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
  readonly sale = input.required<SaleItemDTO>();

  protected readonly LISTING_TYPES = LISTING_TYPES;
  protected readonly imageError = imageError;
}
