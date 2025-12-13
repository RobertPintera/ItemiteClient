import {Component, input, model, output } from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {CategoryTreeDTO} from '../../../../../core/models/CategoryTreeDTO';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.html',
  imports: [
    NgClass,
    NgTemplateOutlet,
    TranslatePipe
  ],
  styleUrl: './category-tree.css'
})
export class CategoryTree {
  readonly selectedIds = model<number[]>([]);

  readonly categories = input<CategoryTreeDTO[]>([]);
  readonly level = input<number>(0);

  readonly categorySelected = output<number[]>();

  toggleCategory(categoryId: number) {
    const current = this.selectedIds();
    if (current.includes(categoryId)) {
      this.selectedIds.set(current.filter(id => id !== categoryId));
    } else {
      this.selectedIds.set([...current, categoryId]);
    }
    this.categorySelected.emit(this.selectedIds());
  }

  isChecked(categoryId: number) {
    return this.selectedIds().includes(categoryId);
  }
}
