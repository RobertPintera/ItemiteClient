import { Component } from '@angular/core';
import {Product} from '../../../../core/models/Product';
import {ProductItem} from './product-item/product-item';

@Component({
  selector: 'app-product-list-view',
  imports: [
    ProductItem
  ],
  templateUrl: './product-list-view.html',
  styleUrl: './product-list-view.css'
})
export class ProductListView {
  products: Product[] = [
    {
      id: 'p1',
      name: 'Apple iPhone 15 Pro',
      categories: ['Electronics', 'Smartphones', 'Apple'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 4999,
      localization: 'Warsaw, Poland',
      dateOfIssue: '2025-09-20',
    },
    {
      id: 'p2',
      name: 'Gaming Laptop ASUS ROG Strix',
      categories: ['Electronics', 'Computers', 'Gaming'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 7299,
      localization: 'Kraków, Poland',
      dateOfIssue: '2025-09-28',
    },
    {
      id: 'p3',
      name: 'Mountain Bike Trek X-Caliber 8',
      categories: ['Sports', 'Bikes', 'Outdoor'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 3899,
      localization: 'Gdańsk, Poland',
      dateOfIssue: '2025-10-05',
    },
    {
      id: 'p4',
      name: 'Samsung 65" QLED 4K Smart TV',
      categories: ['Electronics', 'TVs', 'Home Entertainment'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: false,
      price: 5499,
      localization: 'Poznań, Poland',
      dateOfIssue: '2025-09-30',
    },
    {
      id: 'p5',
      name: 'Leather Office Chair Ergonomic Comfort',
      categories: ['Furniture', 'Office', 'Home'],
      image: 'assets/laptop_chromebook_icon.svg',
      isNegotiable: true,
      price: 899,
      localization: 'Wrocław, Poland',
      dateOfIssue: '2025-10-10',
    }
  ];
}
