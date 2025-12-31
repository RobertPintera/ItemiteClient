import {Component, computed, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {DomSanitizer} from '@angular/platform-browser';


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
  private _sanitizer = inject(DomSanitizer);


  readonly categories = computed(() =>
    this._categoryService.mainCategories().map(category => ({
      ...category,
      safeSvg: this._sanitizer.bypassSecurityTrustHtml(category.svgImage)
    }))
  );
}
