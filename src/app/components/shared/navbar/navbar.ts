import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    TranslatePipe,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  readonly categories = this.categoryService.mainCategories;

  goToCategory(categoryId: number) {
    const url = this.router.createUrlTree(['/products'], { queryParams: { id: categoryId } }).toString();

    if (this.router.url.startsWith('/products')) {
      window.location.href = url;
    } else {
      this.router.navigate(['/products'], { queryParams: { id: categoryId } });
    }
  }

}
