import { Component } from '@angular/core';
import {Baner} from './baner/baner';
import {Categories} from './categories/categories';
import {DedicatedProducts} from './dedicated-products/dedicated-products';
import {NewestProducts} from './newest-products/newest-products';
import {Auctions} from './auctions/auctions';

@Component({
  selector: 'app-home',
  imports: [
    Baner,
    Categories,
    DedicatedProducts,
    NewestProducts,
    Auctions,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
}
