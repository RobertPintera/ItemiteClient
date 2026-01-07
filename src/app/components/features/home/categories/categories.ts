import {Component, computed, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
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
  private _translator = inject(TranslateService)

  getCategoryName(category: any): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

  readonly categories = computed(() =>
    this._categoryService.mainCategories().map(category => ({
      ...category,
      safeSvg: category.svgImage ? this._sanitizer.bypassSecurityTrustHtml(category.svgImage) : ''
    }))
  );
}
