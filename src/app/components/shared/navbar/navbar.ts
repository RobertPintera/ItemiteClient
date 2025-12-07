import {Component, inject, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {NavigationEnd, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  readonly categories = this.categoryService.mainCategories;
  readonly isProductsPage = signal<boolean>(this.router.url.startsWith('/products'));

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isProductsPage.set(event.urlAfterRedirects.startsWith('/products'));
      }
    });
  }

  getHref(categoryId: number) {
    return this.router
      .createUrlTree(['/products'], { queryParams: { id: categoryId } })
      .toString();
  }
}
