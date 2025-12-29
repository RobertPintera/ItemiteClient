import {Component, input, signal, ViewEncapsulation,} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {Button} from '../button/button';
import {Dialog} from '../dialog/dialog';
import {FileUpload} from '../file-upload/file-upload';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ImageMedia} from '../../../core/models/graphics/ImageMedia';
import {TranslatePipe} from '@ngx-translate/core';

/* eslint-disable @typescript-eslint/no-empty-function */

@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.html',
  imports: [
    CdkDropList,
    Button,
    CdkDrag,
    CdkDragPlaceholder,
    Dialog,
    FileUpload,
    TranslatePipe,
  ],
  styleUrl: './media-manager.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MediaManager,
      multi: true
    }
  ]
})
export class MediaManager implements ControlValueAccessor{
  private onChange: (value: ImageMedia[]) => void = () => {};
  private onTouched: () => void = () => {};

  readonly maxImages = input<number>(6);

  readonly images = signal<ImageMedia[]>([]);
  readonly isEditOrder = signal<boolean>(false);

  readonly selectedImage = signal<ImageMedia | null>(null);

  readonly isDisabled = signal<boolean>(false);
  readonly isEditItem = signal<boolean>(false);
  readonly isOpenDialog = signal<boolean>(false);
  readonly isOpenFileUpload = signal<boolean>(false);

  private nextId = 1;

  toggleEditOrder() {
    this.isEditOrder.set(!this.isEditOrder());
    this.onTouched();
  }

  drop(event: CdkDragDrop<ImageMedia[]>) {
    const array = [...this.images()];
    moveItemInArray(array, event.previousIndex, event.currentIndex);

    array.forEach((img, index) => img.imageOrder = index + 1);

    this.images.set(array);

    this.onTouched();
    this.onChange(this.images());
  }

  // ---- FileUpload ----
  openFileUpload() {
    this.isOpenFileUpload.set(true);
  }

  fileUploadConfirm(file: File) {
    const newImage: ImageMedia = {
      imageId: this.nextId++,
      imageOrder: this.images().length + 1,
      existing: false,
      imageFile: file,
      imageUrl: URL.createObjectURL(file)
    };

    this.images.update(arr => [...arr, newImage]);
    this.onTouched();
    this.onChange(this.images());

    this.isOpenFileUpload.set(false);
  }


  fileUploadCancel() {
    this.isOpenFileUpload.set(false);
  }

  // ---- Dialog - Edit/Delete ----

  openDialog(image: ImageMedia ) {
    this.selectedImage.set(image);
    this.isOpenDialog.set(true);
  }

  closeDialog(){
    this.isOpenDialog.set(false);
  }

  deleteSelectedImage() {
    const img = this.selectedImage();
    if (!img) return;

    this.images.update(arr => {
      const filtered = arr.filter(i => i.imageId !== img.imageId);
      return filtered.map((img, index) => ({ ...img, imageOrder: index + 1 }));
    });

    this.onTouched();
    this.onChange(this.images());

    this.selectedImage.set(null);
    this.isOpenDialog.set(false);
  }

  openEditFileUpload() {
    this.isOpenDialog.set(false);
    this.isEditItem.set(true);
  }

  editFileUploadConfirm(file: File) {
    const img = this.selectedImage();
    if (!img) return;

    this.images.update(array =>
      array.map(image =>
        image.imageId === img.imageId
          ? { ...image, imageFile: file, imageUrl: URL.createObjectURL(file), existing: false }
          : image
      )
    );

    this.onTouched();
    this.onChange(this.images());

    this.selectedImage.set(null);
    this.isEditItem.set(false);
  }

  editFileUploadCancel(){
    this.selectedImage.set(null);
    this.isEditItem.set(false);
  }


  // ------ forms -----
  writeValue(images: ImageMedia[] | null): void {
    if (!images) { this.images.set([]); return; }

    this.images.set([...images].sort((a, b) => a.imageOrder - b.imageOrder));

    const maxId = Math.max(0, ...images.map(i => i.imageId));
    this.nextId = maxId + 1;
  }

  registerOnChange(fn: (value: ImageMedia[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
  // -------------------
}
