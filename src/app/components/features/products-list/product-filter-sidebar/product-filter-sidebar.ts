import { Component } from '@angular/core';
import {Category} from '../../../../core/models/Category';
import {CategoryTree} from './category-tree/category-tree';

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [
    CategoryTree
  ],
  templateUrl: './product-filter-sidebar.html',
  styleUrl: './product-filter-sidebar.css'
})
export class ProductFilterSidebar {
  readonly mainCategory: string = "Electronics";

  readonly categories: Category[] = [
    {
      id: "1",
      name: "Computers",
    },
    {
      id: "2",
      name: "Laptops",
    },
    {
      id: "3",
      name: "Computer Accessories",
      subcategories: [
        {
          id: "4",
          name: "Mouses",
        },
        {
          id: "5",
          name: "Keyboards",
        }
      ]
    },
  ];

}
