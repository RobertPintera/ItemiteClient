import {Component, effect, inject, input, model,output, signal, untracked} from '@angular/core';
import {Dialog} from '../../../../shared/dialog/dialog';
import {LoadingDialog} from '../../../../shared/loading-dialog/loading-dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {isEmptyValidator} from '../../../../../core/utility/Validation';
import {Button} from '../../../../shared/button/button';
import {FileUpload} from '../../../../shared/file-upload/file-upload';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {CategoryDTO} from '../../../../../core/models/category/CategoryDTO';
import {finalize} from 'rxjs';
import {PostAdminPanelCategoryDTO} from '../../../../../core/models/category/PostAdminPanelCategoryDTO';
import {PutAdminPanelCategoryDTO} from '../../../../../core/models/category/PutAdminPanelCategoryDTO';

@Component({
  selector: 'app-category-dialog',
  imports: [
    Dialog,
    LoadingDialog,
    TranslatePipe,
    ReactiveFormsModule,
    Button,
    FileUpload
  ],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.css',
})
export class CategoryDialog {
  private _adminService = inject(AdminService);
  private _formBuilder = inject(FormBuilder);
  private _sanitizer = inject(DomSanitizer);

  readonly isOpen = model.required<boolean>();

  readonly editedCategory = input<CategoryDTO | null>(null);
  readonly parentCategoryId = input.required<number | null>();

  readonly operationSuccess = output<void>();

  readonly isOpenFileUpload = signal<boolean>(false);
  readonly isOpenPreviewImageDialog = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly imagePreview = signal<SafeUrl | null>(null);

  readonly form = this._formBuilder.group({
    name: new FormControl<string>("", [
      Validators.required,
      isEmptyValidator,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    description: new FormControl<string>("",[
      Validators.maxLength(500)
    ]),
    parentCategoryId: new FormControl<number | null>(null),
    svgImage: new FormControl<File | null>(null, Validators.required),
  });

  constructor() {
    effect(() => {
      const isOpen = this.isOpen();
      const editedCategory = untracked(() => this.editedCategory());
      const parentCategoryId = untracked(() => this.parentCategoryId());

      if(!isOpen) return;

      const svgControl = this.form.controls.svgImage;

      if (parentCategoryId === null) {
        svgControl.setValidators([Validators.required]);
      } else {
        svgControl.clearValidators();
        svgControl.setValue(null);
        this.imagePreview.set(null);
      }

      this.fillForm(editedCategory, parentCategoryId);
    });
  }

  closeDialog(){
    this.isOpen.set(false);
    this.form.reset({
      name: "",
      description: "",
      svgImage: null
    });
  }

  cancelPreviewImageDialog() {
    this.isOpenPreviewImageDialog.set(false);
  }

  openPreviewImageDialog() {
    this.isOpenPreviewImageDialog.set(true);
  }

  deleteImage() {
    this.imagePreview.set(null);
    this.form.patchValue({ svgImage: null });
    this.form.controls.svgImage.markAsDirty();
    this.form.controls.svgImage.markAsTouched();
    this.isOpenPreviewImageDialog.set(false);
  }

  cancelFileUpload() {
    this.isOpenFileUpload.set(false);
  }

  openEditFileUpload() {
    this.isOpenPreviewImageDialog.set(false);
    this.isOpenFileUpload.set(true);
  }

  openFileUpload(){
    this.isOpenFileUpload.set(true);
  }

  confirmFileUpload(file: File) {
    this.isOpenFileUpload.set(false);

    this.form.patchValue({ svgImage: file });
    this.form.controls.svgImage.markAsDirty();
    this.form.controls.svgImage.markAsTouched();

    const objectUrl = URL.createObjectURL(file);
    this.imagePreview.set(
      this._sanitizer.bypassSecurityTrustUrl(objectUrl)
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.editedCategory()?.id;

    if(!id){
      const payload: PostAdminPanelCategoryDTO = {
        name: this.form.value.name ?? '',
        description: this.form.value.description ?? '',
        parentCategoryId: this.form.value.parentCategoryId,
        svgImage: this.form.value.svgImage ?? null,
      };

      this._adminService.createCategory(payload).pipe(
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe(() => {
        this.form.reset({
          name: null,
          description: "",
          svgImage: null
        });
        this.operationSuccess.emit();
        this.isOpen.set(false);
      });
    } else{
      const payload: PutAdminPanelCategoryDTO = {
        name: this.form.value.name ?? '',
        description: this.form.value.description ?? '',
        parentCategoryId: this.form.value.parentCategoryId,
        svgImage: this.form.value.svgImage ?? null,
      };

      this._adminService.updateCategory(id, payload).pipe(
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe(() => {
        this.form.reset({
          name: null,
          description: "",
          svgImage: null
        });
        this.operationSuccess.emit();
        this.isOpen.set(false);
      });
    }
  }

  private fillForm(category: CategoryDTO | null, parentCategoryId: number | null) {
    this.form.patchValue({
      parentCategoryId: parentCategoryId
    });

    if (!category) {
      this.form.patchValue({name: "", description: "", svgImage: null});
      this.imagePreview.set(null);
      return;
    }

    this.form.patchValue({
      name: category.name,
      description: category.description,
      svgImage: null
    });

    if (category.svgImage) {
      const blob = new Blob([category.svgImage], { type: 'image/svg+xml' });
      const file = new File([blob], 'image.svg', { type: 'image/svg+xml' });

      this.form.patchValue({ svgImage: file });

      const url = URL.createObjectURL(file);
      this.imagePreview.set(this._sanitizer.bypassSecurityTrustUrl(url));
    }
  }
}
