import {Component, effect, inject, input, model, output, signal, untracked} from '@angular/core';
import {Button} from "../../../../shared/button/button";
import {Dialog} from "../../../../shared/dialog/dialog";
import {TranslatePipe} from '@ngx-translate/core';
import {LoadingDialog} from '../../../../shared/loading-dialog/loading-dialog';
import {FileUpload} from '../../../../shared/file-upload/file-upload';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {isEmptyValidator} from '../../../../../core/utility/Validation';
import {AdminService} from '../../../../../core/services/admin-service/admin.service';
import {finalize} from 'rxjs';
import {BannerDTO} from '../../../../../core/models/banners/BannerDTO';
import {BANNER_POSITION} from '../../../../../core/constants/constants';
import {OptionItem} from '../../../../../core/models/OptionItem';
import {PostAdminPanelBannerDTO} from '../../../../../core/models/banners/PostAdminPanelBannerDTO';
import {PutAdminPanelBannerDTO} from '../../../../../core/models/banners/PutAdminPanelBannerDTO';
import {ComboBox} from '../../../../shared/combo-box/combo-box';
import {SnakeCasePipe} from '../../../../../core/pipes/snake-case-pipe/snake-case-pipe';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-banner-dialog',
  imports: [
    Button,
    Dialog,
    TranslatePipe,
    LoadingDialog,
    FileUpload,
    ReactiveFormsModule,
    ComboBox,
    SnakeCasePipe
  ],
  templateUrl: './banner-dialog.html',
  styleUrl: './banner-dialog.css',
})
export class BannerDialog {
  private _adminService = inject(AdminService);
  private _formBuilder = inject(FormBuilder);

  readonly isOpen =  model.required<boolean>();

  readonly editedBanner = input<BannerDTO | null>(null);

  readonly operationSuccess = output<void>();

  readonly loading = signal<boolean>(false);
  readonly isOpenPreviewImageDialog = signal<boolean>(false);
  readonly isOpenFileUpload = signal<boolean>(false);
  readonly imagePreview = signal<SafeUrl | null>(null);

  readonly positionOptions: OptionItem[] = Object.values(BANNER_POSITION).map(value => ({
    key: value,
    value: value,
  }));

  readonly form = this._formBuilder.group({
    name: new FormControl<string>("", [
      Validators.required,
      isEmptyValidator,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    position: new FormControl<OptionItem | null>(this.positionOptions[0], [
      Validators.required
    ]),
    photo: new FormControl<File | null>(null, [
      Validators.required
    ]),
    isActive: new FormControl<boolean>(false)
  });

  constructor() {
    effect(() => {
      const isOpen = this.isOpen();
      const editedBanner = untracked(() => this.editedBanner());

      if(!isOpen) return;

      this.fillForm(editedBanner);
    });

    effect(() => {
      const imagePreview = this.imagePreview();
      const photoControl = this.form.controls.photo;

      if (imagePreview) {
        photoControl.clearValidators();
      } else {
        photoControl.setValidators([Validators.required]);
      }
      photoControl.updateValueAndValidity();
    });
  }

  closeDialog(): void {
    this.isOpen.set(false);
    this.form.reset({
      name: '',
      isActive: false,
      position: this.positionOptions[0],
      photo: null
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
    this.form.patchValue({ photo: null });
    this.form.controls.photo.markAsDirty();
    this.form.controls.photo.markAsTouched();
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

    this.form.patchValue({ photo: file });
    this.form.controls.photo.markAsDirty();
    this.form.controls.photo.markAsTouched();

    const previewUrl = URL.createObjectURL(file);
    this.imagePreview.set(previewUrl);
  }


  submit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const id = this.editedBanner()?.id;

    if(!id){
      const photo = this.form.value.photo;
      if(!photo) return;

      const payload: PostAdminPanelBannerDTO = {
        name: this.form.value.name ?? '',
        position: this.form.value.position?.key ?? BANNER_POSITION.LEFT,
        offsetX: 0,
        offsetY: 0,
        isActive: this.form.value.isActive ?? false,
        photo: photo,
      };

      this._adminService.createBanner(payload).pipe(
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe(() => {
        this.form.reset({
          name: '',
          isActive: false,
          position: this.positionOptions[0],
          photo: null
        });
        this.operationSuccess.emit();
        this.isOpen.set(false);
      });
    }
    else {
      const payload: PutAdminPanelBannerDTO = {
        name: this.form.value.name ?? '',
        position: this.form.value.position?.key ?? BANNER_POSITION.LEFT,
        offsetX: 0,
        offsetY: 0,
        isActive: this.form.value.isActive ?? false,
        photo: this.form.value.photo ?? null,
      };

      this._adminService.updateBanner(id, payload).pipe(
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe(() => {
        this.form.reset({
          name: '',
          isActive: false,
          position: this.positionOptions[0],
          photo: null
        });
        this.operationSuccess.emit();
        this.isOpen.set(false);
      });
    }
  }

  private fillForm(banner: BannerDTO | null){
    if (!banner) {
      this.form.patchValue({name: "", position: this.positionOptions[0], isActive: false, photo: null});
      this.imagePreview.set(null);
      return;
    }

    const positionOption = this.positionOptions.find(
      option => option.key === banner.position
    ) ?? this.positionOptions[0];

    this.form.patchValue({
      name: banner.name,
      position: positionOption,
      isActive: banner.isActive,
      photo: null
    });

    if (banner.url) {
      this.imagePreview.set(banner.url);
    } else {
      this.imagePreview.set(null);
    }
  }
}
