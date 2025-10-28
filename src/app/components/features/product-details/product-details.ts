import {Component, computed, inject, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Carousel} from '../../shared/carousel/carousel';
import {Product} from '../../../core/models/Product';
import {Button} from '../../shared/button/button';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  imports: [
    NgOptimizedImage,
    Carousel,
    Button,
    TranslatePipe,
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  private breakpointObserver = inject(BreakpointObserver);
  readonly isLg = signal<boolean>(false);

  images= [
    {
      "src": "assets/laptop_chromebook_icon.svg"
    },
    {
      "src": "assets/laptop_chromebook_icon.svg"
    },
    {
      "src": "assets/laptop_chromebook_icon.svg"
    },
    {
      "src": "assets/laptop_chromebook_icon.svg"
    },
    {
      "src": "assets/laptop_chromebook_icon.svg"
    },
    {
      "src": "assets/laptop_chromebook_icon.svg"
    },
  ];

  readonly product = signal<Product>({
    id: 'p1',
    name: 'Apple iPhone 15 Pro',
    categories: ['Electronics', 'Smartphones', 'Apple'],
    image: 'assets/laptop_chromebook_icon.svg',
    isNegotiable: false,
    price: 4999,
    localization: 'Warsaw, Poland',
    dateOfIssue: '2025-09-20',
  });

  readonly categoriesWithId = computed(() =>
    this.product()?.categories.map((category, index) => ({
      id: index + 1,
      name: category,
    })) ?? []
  );

  constructor() {
    this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe(result => {
      this.isLg.set(result.breakpoints['(min-width: 1024px)']);
    });
  }
}
