import {Component, inject, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {CategoryDTO} from '../../../../core/models/CategoryDTO';


@Component({
  selector: 'app-categories',
  imports: [
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<CategoryDTO[]>([]);

  ngOnInit(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (data) => (this.categories.set(data)),
      error: (error) => console.error('Error:', error)
    });
  }
}
