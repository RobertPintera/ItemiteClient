import {Component, input} from '@angular/core';
import {Category} from '../../../../../core/models/Category';
import {NgClass, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.html',
  imports: [
    NgClass,
    NgTemplateOutlet
  ],
  styleUrl: './category-tree.css'
})
export class CategoryTree {
  readonly categories = input<Category[]>([]);
  readonly level = input<number>(0);
}
