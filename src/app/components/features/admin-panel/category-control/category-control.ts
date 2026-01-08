import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from '../../../shared/button/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CategoryDialog} from './category-dialog/category-dialog';
import {CategoryDTO} from '../../../../core/models/category/CategoryDTO';
import {LoadingDialog} from '../../../shared/loading-dialog/loading-dialog';
import {AdminService} from '../../../../core/services/admin-service/admin.service';
import {finalize} from 'rxjs';
import {CategoryView} from '../../../../core/models/category/CategoryView';
import {Dialog} from '../../../shared/dialog/dialog';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {DeleteAdminPanelCategoryDTO} from '../../../../core/models/category/DeleteAdminPanelCategoryDTO';

@Component({
  selector: 'app-category-control',
  imports: [
    Button,
    TranslatePipe,
    RouterLink,
    CategoryDialog,
    LoadingDialog,
    Dialog,
    ReactiveFormsModule,
  ],
  templateUrl: './category-control.html',
  styleUrl: './category-control.css',
})
export class CategoryControl implements OnInit {
  private _categoryService = inject(CategoryService);
  private _adminService = inject(AdminService);
  private _sanitizer = inject(DomSanitizer);
  private _route = inject(ActivatedRoute);
  private _formBuilder = inject(FormBuilder);
  private _translator = inject(TranslateService);

  readonly categories = signal<CategoryView[]>([]);

  readonly isOpenDialog = signal<boolean>(false);
  readonly isOpenDeleteDialog = signal<boolean>(false);
  readonly editedCategory = signal<CategoryDTO | null>(null);
  readonly loading = signal<boolean>(false);

  readonly deleteCategoryId = signal<number | null>(null);
  readonly parentCategoryId = signal<number | null>(null);

  readonly deleteForm = this._formBuilder.group({
    deleteFullTree: new FormControl<boolean>(false),
  });

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      this.parentCategoryId.set(id);
      this.loadCategories(id);
    });
  }

  getCategoryName(category: any): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

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
    this.deleteForm.reset({
      deleteFullTree: false,
    });
    this.deleteCategoryId.set(null);
    this.isOpenDeleteDialog.set(false);
  }

  confirmDeleteCategory(): void {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }

    const categoryId = this.deleteCategoryId();
    if(!categoryId) return;

    const payload : DeleteAdminPanelCategoryDTO = {
      deleteFullTree: this.deleteForm.controls.deleteFullTree.value ?? false
    };

    this.loading.set(true);

    this._adminService.deleteCategory(categoryId, payload).pipe(finalize(() => {
      this.loading.set(false);
    })).subscribe(() => {
      this.deleteForm.reset({
        deleteFullTree: false,
      });
      this.refreshCategories();
    });

    this.isOpenDeleteDialog.set(false);
  }

  refreshCategories(): void {
    this.loadCategories(this.parentCategoryId());
  }

  private loadCategories(parentId: number | null) {
    this.loading.set(true);

    if(!parentId){
      this._categoryService.loadMainCategories().pipe(
        finalize(() => this.loading.set(false))
      ).subscribe(categories => {
        this.categories.set(categories.map(category => ({
          ...category,
          safeSvg: category.svgImage ? this._sanitizer.bypassSecurityTrustHtml(category.svgImage) : null
        })));
      });
    }
    else {
      this._categoryService.loadSubcategories(parentId).pipe(
        finalize(() => this.loading.set(false))
      ).subscribe(categories => {
        this.categories.set(categories.map(category => ({
          ...category,
          safeSvg: category.svgImage ? this._sanitizer.bypassSecurityTrustHtml(category.svgImage) : null
        })));
      });
    }
  }
}
