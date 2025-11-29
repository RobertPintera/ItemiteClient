import {Component, signal, ViewEncapsulation,} from '@angular/core';
import {Image} from '../../../core/models/Image';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {Button} from '../button/button';
import {Dialog} from '../dialog/dialog';
import {FileUpload} from '../file-upload/file-upload';


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
  ],
  styleUrl: './media-manager.css',
  encapsulation: ViewEncapsulation.None,
})
export class MediaManager {
  readonly images = signal<Image[]>([]);
  readonly isEditOrder = signal<boolean>(false);

  readonly selectedImage = signal<Image | null>(null);

  readonly isEditItem = signal<boolean>(false);
  readonly isOpenDialog = signal<boolean>(false);
  readonly isOpenFileUpload = signal<boolean>(false);

  private nextId = 1;

  toggleEditOrder() {
    this.isEditOrder.set(!this.isEditOrder());
  }

  addImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImage: Image = {
        imageId: this.nextId++,
        imageUrl: reader.result as string,
        imageOrder: this.images().length
      };
      this.images.update(arr => [...arr, newImage]);
    };
    reader.readAsDataURL(file);
  }

  drop(event: CdkDragDrop<Image[]>) {
    const arr = [...this.images()];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);

    arr.forEach((img, index) => img.imageOrder = index);

    this.images.set(arr);
  }

  // ---- FileUpload ----
  openFileUpload() {
    this.isOpenFileUpload.set(true);
  }

  fileUploadConfirm(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const newImage: Image = {
        imageId: this.nextId++,
        imageUrl: reader.result as string,
        imageOrder: this.images().length
      };
      this.images.update(arr => [...arr, newImage]);
    };
    reader.readAsDataURL(file);

    this.isOpenFileUpload.set(false);
  }

  fileUploadCancel() {
    this.isOpenFileUpload.set(false);
  }

  // ---- Dialog - Edit/Delete ----

  openDialog(image: Image) {
    this.selectedImage.set(image);
    this.isOpenDialog.set(true);
  }

  closeDialog(){
    this.isOpenDialog.set(false);
  }

  deleteSelectedImage() {
    const img = this.selectedImage();
    if (!img) return;

    this.images.update(arr =>
      arr.filter(i => i.imageId !== img.imageId)
    );

    this.images.update(arr =>
      arr.map((img, idx) => ({ ...img, imageOrder: idx }))
    );

    this.selectedImage.set(null);
    this.isOpenDialog.set(false);
  }

  openEditFileUpload() {
    this.isOpenDialog.set(false);
    this.isEditItem.set(true);
  }

  editFileUploadConfirm(file: File){
    const img = this.selectedImage();
    if (!img) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.images.update(arr =>
        arr.map(i =>
          i.imageId === img.imageId
            ? { ...i, imageUrl: reader.result as string }
            : i
        )
      );
    };

    reader.readAsDataURL(file);

    this.selectedImage.set(null);
    this.isEditItem.set(false);
  }

  editFileUploadCancel(){
    this.selectedImage.set(null);
    this.isEditItem.set(false);
  }

}
