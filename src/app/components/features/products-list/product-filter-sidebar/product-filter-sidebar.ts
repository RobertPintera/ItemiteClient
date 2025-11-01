import {Component, inject, input, OnInit, output } from '@angular/core';
import {CategoryTree} from './category-tree/category-tree';
import {Button} from '../../../shared/button/button';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [
    CategoryTree,
    Button,
  ],
  templateUrl: './product-filter-sidebar.html',
  styleUrl: './product-filter-sidebar.css'
})
export class ProductFilterSidebar implements OnInit {
  readonly isXl = input.required<boolean>();
  readonly filterClose = output<void>();

  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  readonly categoryTree = this.categoryService.subCategories;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const name = params.get('category');
      const id = params.get('id');

      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;
      const validName = typeof name === 'string' && name.trim().length > 0 ? name : null;

      if (validId === null || validName === null) return;

      this.categoryService.loadCategoryTree(validId).subscribe({
        next: tree => console.log('Category tree loaded:', tree),
        error: err => console.error(err)
      });
    });
  }


  closeFilter(){
    this.filterClose.emit();
  }
}
