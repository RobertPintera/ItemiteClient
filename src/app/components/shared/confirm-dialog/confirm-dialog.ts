import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    TranslatePipe
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog {
  readonly prompt = input('Are you sure you want to perform this action?');
  onConfirmClicked = output<void>();
  onCancelClicked = output<void>();

  OnConfirmClicked() {
    this.onConfirmClicked.emit();
  }

  OnCancelClicked() {
    this.onCancelClicked.emit();
  }
}
