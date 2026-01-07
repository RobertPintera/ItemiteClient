import {Component, inject, input, model, output } from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {CategoryTreeDTO} from '../../../../../core/models/category/CategoryTreeDTO';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.html',
  imports: [
    NgClass,
    NgTemplateOutlet,
  ],
  styleUrl: './category-tree.css'
})
export class CategoryTree {
  private _translator = inject(TranslateService)

  readonly selectedIds = model<number[]>([]);

  readonly categories = input<CategoryTreeDTO[]>([]);
  readonly level = input<number>(0);

  readonly categorySelected = output<number[]>();

  getCategoryName(category: any): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

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
