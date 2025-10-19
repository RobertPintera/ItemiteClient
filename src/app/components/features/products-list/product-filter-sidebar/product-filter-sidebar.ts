import {Component, input, output} from '@angular/core';
import {Category} from '../../../../core/models/Category';
import {CategoryTree} from './category-tree/category-tree';
import {Button} from '../../../shared/button/button';

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [
    CategoryTree,
    Button,
  ],
  templateUrl: './product-filter-sidebar.html',
  styleUrl: './product-filter-sidebar.css'
})
export class ProductFilterSidebar {
  readonly isXl = input.required<boolean>();
  readonly filterClose = output<void>();

  readonly mainCategory: string = "Electronics";

  closeFilter(){
    this.filterClose.emit();
  }

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
