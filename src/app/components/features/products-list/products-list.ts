import { Component } from '@angular/core';
import {ProductListView} from './product-list-view/product-list-view';
import {ProductFilterSidebar} from './product-filter-sidebar/product-filter-sidebar';

@Component({
  selector: 'app-products-list',
  imports: [
    ProductListView,
    ProductFilterSidebar
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList {

}
