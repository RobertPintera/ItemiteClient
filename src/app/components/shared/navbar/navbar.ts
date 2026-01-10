import {Component, inject, signal} from '@angular/core';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {CategoryDTO} from '../../../core/models/category/CategoryDTO';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private _categoryService = inject(CategoryService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _translator = inject(TranslateService);

  readonly categories = this._categoryService.mainCategories;
  readonly isProductsPage = signal<boolean>(this._router.url.startsWith('/products'));
  readonly selectedCategoryId = signal<number | null>(null);

  getCategoryName(category: CategoryDTO): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

  constructor() {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isProductsPage.set(event.urlAfterRedirects.startsWith('/products'));

        const idParam = this._route.snapshot.queryParamMap.get('id');
        this.selectedCategoryId.set(idParam ? Number(idParam) : null);
      }
    });
  }
}
