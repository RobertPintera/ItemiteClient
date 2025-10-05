import { Component } from '@angular/core';
import {Baner} from './baner/baner';
import {Categories} from './categories/categories';
import {DedicatedProducts} from './dedicated-products/dedicated-products';

@Component({
  selector: 'app-home',
  imports: [
    Baner,
    Categories,
    DedicatedProducts
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
