import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Product} from '../../../../core/models/Product';
import {Carousel} from '../../../shared/carousel/carousel';
import {ProductCard} from '../cards/product-card/product-card';

@Component({
  selector: 'app-dedicated-products',
  imports: [
    TranslatePipe,
    Carousel,
    ProductCard
  ],
  templateUrl: './dedicated-products.html',
  styleUrl: './dedicated-products.css'
})
export class DedicatedProducts {
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
   },
   {
     id: 'p7',
     name: 'Drone AirCam 4K',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 1899.00
   },
   {
     id: 'p8',
     name: 'Laptop Gaming Beast 17"',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 7499.00
   },
   {
     id: 'p9',
     name: 'Wireless Charging Pad Pro',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: true,
     price: 199.99
   },
   {
     id: 'p10',
     name: 'Smart Home Hub 2.0',
     image: 'assets/laptop_chromebook_icon.svg',
     isNegotiable: false,
     price: 999.00
   }
  ];
}
