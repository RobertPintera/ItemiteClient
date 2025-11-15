import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private categoryService = inject(CategoryService);
  categories = this.categoryService.mainCategories;
}
