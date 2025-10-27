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
  products: Product[] = [
    {
      id: 'p1',
      name: 'Smartwatch Pro X200',
      categories: ['Electronics', 'Wearables', 'Smart Devices'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 899.99,
      localization: 'Warsaw, Poland',
      dateOfIssue: '2025-09-25',
    },
    {
      id: 'p2',
      name: 'Wireless Headphones Max',
      categories: ['Electronics', 'Audio', 'Headphones'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 1299.0,
      localization: 'Kraków, Poland',
      dateOfIssue: '2025-10-01',
    },
    {
      id: 'p3',
      name: '4K Ultra HD TV 55"',
      categories: ['Electronics', 'TV & Video', 'Home Entertainment'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 2999.0,
      localization: 'Gdańsk, Poland',
      dateOfIssue: '2025-09-28',
    },
    {
      id: 'p4',
      name: 'Mechanical Keyboard RGB',
      categories: ['Electronics', 'Computer Accessories', 'Peripherals'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 499.5,
      localization: 'Poznań, Poland',
      dateOfIssue: '2025-10-05',
    },
    {
      id: 'p5',
      name: 'Gaming Mouse UltraSpeed',
      categories: ['Electronics', 'Computer Accessories', 'Gaming'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 249.99,
      localization: 'Wrocław, Poland',
      dateOfIssue: '2025-09-30',
    },
    {
      id: 'p6',
      name: 'Portable Bluetooth Speaker',
      categories: ['Electronics', 'Audio', 'Portable Devices'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 399.0,
      localization: 'Łódź, Poland',
      dateOfIssue: '2025-10-10',
    },
  ];


  readonly firstHalfProducts = this.products.slice(0, this.products.length / 2);
  readonly secondHalfProducts = this.products.slice(this.products.length / 2);
}
