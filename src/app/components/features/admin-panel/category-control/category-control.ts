import {Component, computed, inject, signal} from '@angular/core';
import {Button} from '../../../shared/button/button';
import {TranslatePipe} from '@ngx-translate/core';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import {MainCategoryDialog} from './main-category-dialog/main-category-dialog';
import {CategoryDTO} from '../../../../core/models/category/CategoryDTO';
import {ConfirmDialog} from '../../../shared/confirm-dialog/confirm-dialog';
import {LoadingDialog} from '../../../shared/loading-dialog/loading-dialog';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-category-control',
  imports: [
    Button,
    TranslatePipe,
    RouterLink,
    MainCategoryDialog,
    ConfirmDialog,
    LoadingDialog,
  ],
  templateUrl: './category-control.html',
  styleUrl: './category-control.css',
})
export class CategoryControl {
  private _categoryService = inject(CategoryService);
  private _adminService = inject(AdminService);
  private _sanitizer = inject(DomSanitizer);

  readonly categories = computed(() =>
    this._categoryService.mainCategories().map(category => ({
      ...category,
      safeSvg: category.svgImage ? this._sanitizer.bypassSecurityTrustHtml(category.svgImage) : ''
    }))
  );

  readonly isOpenDialog = signal<boolean>(false);
  readonly isOpenDeleteDialog = signal<boolean>(false);
  readonly editedCategory = signal<CategoryDTO | null>(null);
  readonly loading = signal<boolean>(false);

  readonly deleteCategoryId = signal<number | null>(null);

  openDialog(category?: CategoryDTO): void {
    if(category) {
      this.editedCategory.set(category);
    }
    else {
      this.editedCategory.set(null);
    }
    this.isOpenDialog.set(true);
  }

  openDeleteDialog(id: number): void {
    this.deleteCategoryId.set(id);
    this.isOpenDeleteDialog.set(true);
  }

  closeDeleteDialog(): void {
    this.deleteCategoryId.set(null);
    this.isOpenDeleteDialog.set(false);
  }

  confirmDeleteCategory(): void {
    const categoryId = this.deleteCategoryId();
    if(!categoryId) return;

    this.loading.set(true);

    this._adminService.deleteCategory(categoryId).pipe(finalize(() => {
      this.loading.set(false);
    })).subscribe(() => {
      this.refreshCategories();
    });

    this.isOpenDeleteDialog.set(false);
  }

  refreshCategories(): void {
    this._categoryService.loadMainCategories().subscribe(() => {
      console.log(this._categoryService.mainCategories());
    });
  }
}
