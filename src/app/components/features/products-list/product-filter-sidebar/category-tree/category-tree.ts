import {Component, input} from '@angular/core';
import {Category} from '../../../../../core/models/Category';

@Component({
  selector: 'app-category-tree',
  imports: [],
  templateUrl: './category-tree.html',
  styleUrl: './category-tree.css'
})
export class CategoryTree {
  readonly categories = input<Category[]>([]);
  readonly level = input<number>(0);
}
