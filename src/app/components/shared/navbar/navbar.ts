import {Component, inject, signal} from '@angular/core';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {NavigationEnd, Router, RouterLink} from '@angular/router';

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

  readonly categories = this._categoryService.mainCategories;
  readonly isProductsPage = signal<boolean>(this._router.url.startsWith('/products'));

  constructor() {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isProductsPage.set(event.urlAfterRedirects.startsWith('/products'));
      }
    });
  }

  getHref(categoryId: number) {
    return this._router
      .createUrlTree(['/products'], { queryParams: { id: categoryId } })
      .toString();
  }
}
