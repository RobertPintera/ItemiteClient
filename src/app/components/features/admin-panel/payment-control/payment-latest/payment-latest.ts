import { Component } from '@angular/core';
import {Loader} from "../../../../shared/loader/loader";
import {Paginator} from "../../../../shared/paginator/paginator";
import {ProductItem} from "../../../../shared/product-item/product-item";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-payment-latest',
  imports: [
    Loader,
    Paginator,
    ProductItem,
    TranslatePipe
  ],
  templateUrl: './payment-latest.html',
  styleUrl: './payment-latest.css',
})
export class PaymentLatest {

}
