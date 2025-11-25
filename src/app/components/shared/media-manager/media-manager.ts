import {Component, signal,} from '@angular/core';
import {Image} from '../../../core/models/Image';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {Button} from '../button/button';


@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.html',
  imports: [
    CdkDropList,
    Button,
    CdkDrag,
  ],
  styleUrl: './media-manager.css'
})
export class MediaManager {
  readonly images = signal<Image[]>([]);
  readonly isEditOrder = signal<boolean>(false);

  private nextId = 1;

  toggleEditOrder() {
    console.log(this.isEditOrder());
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
}
