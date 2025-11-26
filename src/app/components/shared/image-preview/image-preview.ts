import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.css'
})
export class ImagePreview {
  readonly image = input.required<string>();
  readonly onExitClicked = output();

  OnExitClicked() {
    this.onExitClicked.emit();
  }
}
