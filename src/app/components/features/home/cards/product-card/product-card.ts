import {Component, input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Product} from '../../../../../core/models/Product';

@Component({
  selector: 'app-product-card',
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  readonly product = input<Product>();
}
