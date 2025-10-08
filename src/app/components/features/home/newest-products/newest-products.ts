import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Product} from '../../../../core/models/Product';
import {TranslatePipe} from '@ngx-translate/core';
import {Carousel} from '../../../shared/carousel/carousel';
import {ProductCard} from '../cards/product-card/product-card';

@Component({
  selector: 'app-newest-products',
  imports: [
    TranslatePipe,
    Carousel,
    ProductCard
  ],
  templateUrl: './newest-products.html',
  styleUrl: './newest-products.css'
})
export class NewestProducts {
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
    },
    {
      id: 'p3',
      name: '4K Ultra HD TV 55"',
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 2999.00
    },
    {
      id: 'p4',
      name: 'Mechanical Keyboard RGB',
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 499.50
    },
    {
      id: 'p5',
      name: 'Gaming Mouse UltraSpeed',
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 249.99
    },
    {
      id: 'p6',
      name: 'Portable Bluetooth Speaker',
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 399.00
    }];

  readonly firstHalfProducts = this.products.slice(0, this.products.length / 2);
  readonly secondHalfProducts = this.products.slice(this.products.length / 2);
}
