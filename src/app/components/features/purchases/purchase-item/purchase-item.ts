import {Component, input} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {PurchaseItemDTO} from '../../../../core/models/payments/PurchaseItemDTO';

@Component({
  selector: 'app-purchase-item',
  imports: [
    Button,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './purchase-item.html',
  styleUrl: './purchase-item.css',
})
export class PurchaseItem {
  readonly purchase = input.required<PurchaseItemDTO>();

  protected readonly LISTING_TYPES = LISTING_TYPES;
}
