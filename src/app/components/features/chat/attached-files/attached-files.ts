import {Component, computed, effect, input, output, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-attached-files',
  imports: [
    TranslatePipe
  ],
  templateUrl: './attached-files.html',
  styleUrl: './attached-files.css'
})
export class AttachedFiles {
  readonly files = input<File[]>([]);
  readonly onFileDeleted = output<number>();
  readonly onRequestAdd = output<void>();

  OnFileDeleted(index: number): void {
    this.onFileDeleted.emit(index);
  }

  OnRequestAdd() {
    this.onRequestAdd.emit();
  }
}

