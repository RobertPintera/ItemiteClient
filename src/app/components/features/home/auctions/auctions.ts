import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Product} from '../../../../core/models/Product';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-auctions',
  imports: [
    NgOptimizedImage,
    TranslatePipe
  ],
  templateUrl: './auctions.html',
  styleUrl: './auctions.css'
})
export class Auctions {
  products : Product[] = [
    {
      id: 'p1',
      name: 'Smartwatch Pro X200',
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 899.99
    },
    {
      id: 'p2',
      name: 'Wireless Headphones Max',
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 1299.00
    }];
}
