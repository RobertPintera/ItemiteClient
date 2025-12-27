import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';


@Component({
  selector: 'app-categories',
  imports: [
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  private _categoryService = inject(CategoryService);

  readonly categories = this._categoryService.mainCategories;
}
