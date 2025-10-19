import {Component, computed, HostBinding, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Product} from '../../../../../core/models/Product';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css'
})
export class ProductItem {
  @HostBinding('class')
    hostClass = 'w-full';

  readonly product = input<Product>();

  readonly categoriesWithId = computed(() =>
    this.product()?.categories.map((category, index) => ({
      id: index + 1,
      name: category,
    })) ?? []
  );
}
