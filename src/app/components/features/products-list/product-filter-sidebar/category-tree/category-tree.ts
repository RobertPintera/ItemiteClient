import {Component, input} from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {CategoryTreeDTO} from '../../../../../core/models/CategoryTreeDTO';

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
  readonly categories = input<CategoryTreeDTO[]>([]);
  readonly level = input<number>(0);
}
