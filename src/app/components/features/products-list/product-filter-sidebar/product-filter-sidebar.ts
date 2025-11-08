import {Component, inject, input, OnInit, output } from '@angular/core';
import {CategoryTree} from './category-tree/category-tree';
import {Button} from '../../../shared/button/button';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [
    CategoryTree,
    Button,
    ComboBox,
    TranslatePipe,
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

  listingTypes = [
    { key: 'none', value: '-'},
    { key: 'auction', value: 'listing_types.auction' },
    { key: 'product', value: 'listing_types.product' },
  ];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');

      const validId = id !== null && !isNaN(Number(id)) ? Number(id) : null;

      if (validId === null) return;

      this.categoryService.loadCategoryTree(validId).subscribe({
        next: tree => console.log('Category tree loaded'),
        error: err => console.error(err)
      });
    });
  }

  closeFilter(){
    this.filterClose.emit();
  }

  useListingType(sorting: { key: string; value: string }): void {
    if(!sorting) return;
  }
}
